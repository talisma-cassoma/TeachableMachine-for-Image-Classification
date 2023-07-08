import { Camera } from "./camera.js"
import { mobilenet, loadMobileNetFeatureModel } from "./loadMobileNetFeatureModel.js";
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
					let resizedTensorFrame = tf.image.resizeBilinear(videoFrameAsTensor, [Camera.MOBILE_NET_INPUT_HEIGHT,
					Camera.MOBILE_NET_INPUT_WIDTH], true);

					let imageFeatures = mobilenet.predict(resizedTensorFrame.expandDims());
					let predict = model.predict(imageFeatures).squeeze();

					let predictionArray = predict.arraySync();


					for (let i = 0; i < labels.length; i++) {

						let classPredictionConfidence = Math.floor(predictionArray[i] * 100)
						predictionBarsProgress[i].style.width = `${classPredictionConfidence}%`
						predictionBarsProgress[i].innerText = classPredictionConfidence + '%'
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

		await Prediction.setPredictionsBars()
		
		loadMobileNetFeatureModel()

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
