import * as tf from '@tensorflow/tfjs'

import {
	buildModel,
	model,
	mobilenetModel,
	trainingInputs,
	trainingOutputs
} from './buildModel'
import { ClassLabels } from './buildModel';
//import { IAWorker } from './predictFrame';

//let predict = false

function predictLoop() {
	self.onmessage = async function (event) {
		const [action, capturedFrame] = await event.data;
		// console.log('worker thread:', capturedFrame);

		if (action === 'predict frame') {
			while (true) {
				tf.tidy(function () {
					let videoFrameAsTensor = tf.browser.fromPixels(capturedFrame).div(255);
					let resizedTensorFrame = tf.image.resizeBilinear(videoFrameAsTensor, [224, 224], true);

					let imageFeatures = mobilenetModel.predict(resizedTensorFrame.expandDims());
					let prediction = model.predict(imageFeatures).squeeze();

					let predictionArray = prediction.arraySync();

					self.postMessage(['predictions', predictionArray])
				});

				// Use setTimeout for the next iteration
				setInterval(predictLoop, 0.1); // 0 ms means it will be executed as soon as possible
			}
		}
	}
}

function logProgress(epoch, logs) {
	console.log('Data for epoch ' + epoch, logs);
}

export async function trainModel() {

	await buildModel()

	tf.util.shuffleCombo(trainingInputs, trainingOutputs);
	let outputsAsTensor = tf.tensor1d(trainingOutputs, 'int32');
	let oneHotOutputs = tf.oneHot(outputsAsTensor, ClassLabels.length);
	let inputsAsTensor = tf.stack(trainingInputs);

	let results = await model.fit(inputsAsTensor, oneHotOutputs, {
		shuffle: true, batchSize: 5, epochs: 10,
		callbacks: { onEpochEnd: logProgress }
	});

	outputsAsTensor.dispose();
	oneHotOutputs.dispose();
	inputsAsTensor.dispose();

	self.postMessage(['starting predictions', 'IA'])
	//predict = true;
	predictLoop();
}

