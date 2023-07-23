// Import necessary modules
import { Camera } from "./camera.js";
import { mobilenet, loadMobileNetFeatureModel } from "./loadMobileNetFeatureModel.js";
import { Class, predictionBarsProgress } from "./class.js";

// Get canvas and context for rendering
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// Variables to store model and prediction data
let cocoSsdModel = undefined;
let squares = [];
let model = undefined;
let labels = [];

// Function to draw a single square on the canvas
function drawSquare(x, y, size, color, text) {
	ctx.beginPath();
	ctx.rect(x, y, size.width, size.height);
	ctx.strokeStyle = color;
	ctx.lineWidth = 2;
	ctx.stroke();
	if (text) {
		ctx.fillStyle = color;
		ctx.font = '10px Arial';
		ctx.fillText(text, x + 5, y + 10);
	}
}


// Load the Coco-SSD model
async function loadCoco() {
	cocoSsdModel = await cocoSsd.load();
}

// Prediction module with functions related to models and prediction loop
const Prediction = {
	// Function to get the model labels names from the server
	async getModelLabelsNames() {
		const response = await fetch("http://localhost:3000/train/labels");
		const jsonData = await response.json();
		const classNames = jsonData.labels;
		return classNames;
	},

	// Prediction loop function to continuously make predictions
	async predictLoop() {
		if (Camera.videoPlaying) {
			ctx.drawImage(Camera.VIDEO, 0, 0, canvas.width, canvas.height);

			const predictions = await cocoSsdModel.detect(Camera.VIDEO);

			ctx.clearRect(0, 0, canvas.width, canvas.height);

			predictions.forEach((prediction) => {
				const imageData = ctx.getImageData(prediction.bbox[0], prediction.bbox[1], prediction.bbox[2], prediction.bbox[3]);

				tf.tidy(function () {
					let videoFrameAsTensor = tf.browser.fromPixels(imageData).div(255);
					let resizedTensorFrame = tf.image.resizeBilinear(videoFrameAsTensor, [Camera.MOBILE_NET_INPUT_HEIGHT, Camera.MOBILE_NET_INPUT_WIDTH], true);
					let imageFeatures = mobilenet.predict(resizedTensorFrame.expandDims());
					let predict = model.predict(imageFeatures).squeeze();
					let highestIndex = predict.argMax().arraySync();
					let predictionArray = predict.arraySync();

					let text = `${labels[highestIndex]}: ${Math.floor(predictionArray[highestIndex] * 100)} % confidence`;
					drawSquare(
						prediction.bbox[0],
						prediction.bbox[1],
						{
							width: prediction.bbox[2],
							height: prediction.bbox[3],
						},
						'red',
						text // Pass the text to draw above the rectangle
					);
				});
			});

			requestAnimationFrame(Prediction.predictLoop);
		} else {
			console.log("Camera is off");
		}
	},
	// Function to load the AI model from the server
	async loadModel() {
		try {
			model = await tf.loadLayersModel("http://localhost:3000/assets/uploads/model.json");
			model.summary();
			labels = await Prediction.getModelLabelsNames();
			await loadCoco();
			loadMobileNetFeatureModel();
		} catch (error) {
			console.error("Error loading the model:", error);
		}
	},

	// Function to enable the prediction loop on button click
	enable() {
		const predBtn = document.querySelector(".enablePredictionButton");
		predBtn.addEventListener("click", () => {
			if (Camera.videoPlaying) {
				Prediction.predictLoop();
			} else {
				console.log("Camera is off");
			}
		});
	},
};

// Main App module to initialize the camera, models, and prediction loop
const App = {
	async init() {
		Camera.init(); // Initialize camera
		await Prediction.loadModel(); // Load AI model
		Prediction.enable(); // Enable prediction loop on button click
	},
};

App.init(); // Start the app by initializing everything