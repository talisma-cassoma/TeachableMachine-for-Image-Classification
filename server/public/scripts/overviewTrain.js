import { Camera } from "./camera.js"
import { loadMobileNetFeatureModel } from "./loadSavedLoadedModel.js";
import { Class, predictionBarsProgress } from "./class.js";

let model = undefined
let labels = []

const Prediction = {

	async getModelLabelsNames() {
		const response = await fetch("http://localhost:3000/train/labels");
		const jsonData = await response.json();
		const classNames = jsonData.labels
		return classNames
	},
	async setPredictionsBars() {
		labels = await Prediction.getModelLabelsNames()
		//console.log(labels)
		for (let i = 0; i < labels.length; i++) {
			Class.createLabelPredictionsBar(labels[i])
		}
	},
	enable() {

		const predBtn = document.querySelector('.enablePredictionButton')

		predBtn.addEventListener('click', function predictLoop() {
			if (Camera.videoPlaying) {

				tf.tidy(function predictLoop() {
					let videoFrameAsTensor = tf.browser.fromPixels(Camera.VIDEO).div(255);
					let resizedTensorFrame = tf.image.resizeBilinear(videoFrameAsTensor, [Camera.MOBILE_NET_INPUT_HEIGHT, Camera.MOBILE_NET_INPUT_WIDTH], true);
			
					// Add batch dimension
					resizedTensorFrame = resizedTensorFrame.expandDims(0);
			
					let predict = model.predict(Camera.VIDEO);
					let predictionArray = predict.arraySync();
			
					for (let i = 0; i < labels.length; i++) {
							let classPredictionConfidence = Math.floor(predictionArray[0][i] * 100);
							predictionBarsProgress[i].style.width = `${classPredictionConfidence}%`;
							predictionBarsProgress[i].innerText = classPredictionConfidence + '%';
					}
			});
			
						
				window.requestAnimationFrame(predictLoop);

			} else {
				console.log("camera is off")
			}
		})
	},
	async loadModel() {

		model = await tf.loadLayersModel('http://localhost:3000/assets/uploads/model.json');
		
		model.summary()
		console.log('the model is ready for use');

		await Prediction.setPredictionsBars()
		
	}
}

const App = {
	async init() {
		Camera.init()
		await Prediction.loadModel();
		Prediction.enable()
	}
}

App.init()