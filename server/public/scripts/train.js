import { Camera } from "./camera.js"
import { Class, classLabels, predictionBarsProgress } from "./class.js"
import {
	loadMobileNetFeatureModel,
	trainingInputs,
	trainingOutputs,
	mobilenetModel,
	statusElement,
} from "./loadSavedLoadedModel.js"

import { downloadModel } from "./downloadModel.js";


const TRAIN_BUTTON = document.getElementById("train");
const RESET_BUTTON = document.getElementById('reset');
const DOWNLOAD_BUTTON = document.getElementById('download');

let model = undefined
let predict = false;

function predictLoop() {
	if (predict) {
		tf.tidy(function () {
			let videoFrameAsTensor = tf.browser.fromPixels(Camera.VIDEO).div(255);
			let resizedTensorFrame = tf.image.resizeBilinear(videoFrameAsTensor, [Camera.MOBILE_NET_INPUT_HEIGHT,
			Camera.MOBILE_NET_INPUT_WIDTH], true);

			let imageFeatures =  mobilenetModel.predict(resizedTensorFrame.expandDims());
			let prediction = model.predict(imageFeatures).squeeze();

			let highestIndex = prediction.argMax().arraySync();
			let predictionArray = prediction.arraySync();
			

			for (let i = 0; i < classLabels.length; i++) {

				let classPredictionConfidence = Math.floor(predictionArray[i] * 100) 
				predictionBarsProgress[i].style.width = `${classPredictionConfidence}%` 
				predictionBarsProgress[i].innerText = classPredictionConfidence + '%'
			}
		
		});

		window.requestAnimationFrame(predictLoop);
	}
}

function logProgress(epoch, logs) {
	console.log('Data for epoch ' + epoch, logs);
}

async function trainAndPredict() {
	predict = false;
	
	tf.util.shuffleCombo(trainingInputs, trainingOutputs);
	let outputsAsTensor = tf.tensor1d(trainingOutputs, 'int32');
	let oneHotOutputs = tf.oneHot(outputsAsTensor, classLabels.length);
	let inputsAsTensor = tf.stack(trainingInputs);

	let results = await model.fit(inputsAsTensor, oneHotOutputs, {
		shuffle: true, batchSize: 5, epochs: 10,
		callbacks: { onEpochEnd: logProgress }
	});

	outputsAsTensor.dispose();
	oneHotOutputs.dispose();
	inputsAsTensor.dispose();
	predict = true;
	predictLoop();
}


const Train = {
	buildModel() {
		model = tf.sequential();
		model.add(tf.layers.dense({ inputShape: [1024], units: 128, activation: 'relu' }));
		model.add(tf.layers.dense({ units: classLabels.length, activation: 'softmax' }));

		model.summary();

		// Compile the model with the defined optimizer and specify a loss function to use.
		model.compile({
			// Adam changes the learning rate over time which is useful.
			optimizer: 'adam',
			// Use the correct loss function. If 2 classes of data, must use binaryCrossentropy.
			// Else categoricalCrossentropy is used if more than 2 classes.
			loss: (classLabels.length === 2) ? 'binaryCrossentropy' : 'categoricalCrossentropy',
			// As this is a classification problem you can record accuracy in the logs too!
			metrics: ['accuracy']
		});
	},
	predict() {
		trainAndPredict()
	},
	init() {
		Train.buildModel()
		Train.predict()

	},
	reset() {
		predict = false;
		examplesCounts.length = 0;
		for (let i = 0; i < trainingInputs.length; i++) {
			trainingInputs[i].dispose();
		}
		trainingInputs.length = 0;
		trainingOutputs.length = 0;
		statusElement.innerText = 'No data collected';

		console.log('Tensors in memory: ' + tf.memory().numTensors);
	},
	async downloadModel() {
		//stop prediction lopp
		predict = false;
		//start download
		await downloadModel(model);

	}
}

const App = {
	init() {
		Camera.init()
		// Call the function immediately to start loading.
		loadMobileNetFeatureModel();

		//eaneable adding class
		Class.init()

		TRAIN_BUTTON.addEventListener("click", Train.init);

		RESET_BUTTON.addEventListener('click', Train.reset);

		DOWNLOAD_BUTTON.addEventListener('click', Train.downloadModel);

	}
}

App.init()