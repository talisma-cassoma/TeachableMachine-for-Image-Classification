import { Camera } from "./camera.js"
import { Class, predictionBarsProgress } from "./class.js"

let model = undefined;
let labels = [];

const Prediction = {

	async getModelLabelsNames() {
		const response = await fetch("http://localhost:3000/train/labels");
		const jsonData = await response.json();
		return jsonData.labels;
	},

	async setPredictionsBars() {
		labels = await Prediction.getModelLabelsNames();
		for (let i = 0; i < labels.length; i++) {
			Class.createLabelPredictionsBar(labels[i]);
		}
	},

	enable() {
		const predBtn = document.querySelector('.enablePredictionButton');

		let isPredicting = false;

		predBtn.addEventListener('click', () => {
			if (isPredicting) return; // evita múltiplos listeners
			isPredicting = true;

			const predictLoop = () => {
				if (!Camera.videoPlaying) {
					console.log("Camera is off");
					isPredicting = false;
					return;
				}

				tf.tidy(() => {
					const videoFrameAsTensor = tf.browser.fromPixels(Camera.VIDEO).div(255);
					const resizedTensorFrame = tf.image.resizeBilinear(
						videoFrameAsTensor,
						[Camera.MOBILE_NET_INPUT_HEIGHT, Camera.MOBILE_NET_INPUT_WIDTH],
						true
					).expandDims(); // [1, 224, 224, 3]

					const prediction = model.predict(resizedTensorFrame).squeeze(); // combined model
					const predictionArray = prediction.arraySync();

					for (let i = 0; i < labels.length; i++) {
						const confidence = Math.floor(predictionArray[i] * 100);
						predictionBarsProgress[i].style.width = `${confidence}%`;
						predictionBarsProgress[i].innerText = confidence + '%';
					}
				});

				window.requestAnimationFrame(predictLoop);
			};

			window.requestAnimationFrame(predictLoop);
		});
	},

	async loadModel() {
		model = await tf.loadLayersModel('http://localhost:3000/assets/uploads/model.json');
		console.log("✅ Modelo combinado carregado com sucesso:");
		model.summary(); // Exibe arquitetura completa (deve incluir camadas MobileNet!)

		await Prediction.setPredictionsBars();
	}
};

const App = {
	async init() {
		Camera.init();
		await Prediction.loadModel();
		Prediction.enable();
	}
};

App.init();
