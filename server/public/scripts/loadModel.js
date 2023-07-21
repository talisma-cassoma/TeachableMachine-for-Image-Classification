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
function drawSquare(x, y, size, color) {
	ctx.beginPath();
	ctx.lineWidth = "2";
	ctx.strokeStyle = color;
	ctx.rect(x, y, size.width, size.height);
	ctx.stroke();
}

// Function to detect objects in the video frame
async function detectObjects() {
	const predictions = await cocoSsdModel.detect(Camera.VIDEO);
	squares = predictions.map(prediction => ({
		classNames: prediction.class,
		score: `${Math.round(parseFloat(prediction.score) * 100)} % confidence`,
		xPosition: prediction.bbox[0],
		yPosition: prediction.bbox[1],
		size: {
			width: prediction.bbox[2],
			height: prediction.bbox[3],
		},
		color: "red",
	}));
}

// Function to render the detected objects on the canvas
function render() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	squares.forEach(square => {
		drawSquare(square.xPosition, square.yPosition, square.size, square.color);
	});
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

	// Function to set up the prediction bars based on model labels
	async setPredictionsBars() {
		labels = await Prediction.getModelLabelsNames();
		labels.forEach(label => Class.createLabelPredictionsBar(label));
	},

	// Prediction loop function to continuously make predictions
	predictLoop() {
		if (Camera.videoPlaying) {
			ctx.drawImage(Camera.VIDEO, 0, 0, canvas.width, canvas.height);
			detectObjects(); // Call detectObjects before rendering
			render();

			// Use Tensorflow to make predictions and update prediction bars
			tf.tidy(function () {
				let videoFrameAsTensor = tf.browser.fromPixels(Camera.VIDEO).div(255);
				let resizedTensorFrame = tf.image.resizeBilinear(videoFrameAsTensor, [Camera.MOBILE_NET_INPUT_HEIGHT, Camera.MOBILE_NET_INPUT_WIDTH], true);
				let imageFeatures = mobilenet.predict(resizedTensorFrame.expandDims());
				let predict = model.predict(imageFeatures).squeeze();
				let predictionArray = predict.arraySync();

				for (let i = 0; i < labels.length; i++) {
					let classPredictionConfidence = Math.floor(predictionArray[i] * 100);
					predictionBarsProgress[i].style.width = `${classPredictionConfidence}%`;
					predictionBarsProgress[i].innerText = classPredictionConfidence + '%';
				}
			});

			// Request the next animation frame for continuous prediction loop
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
			await Prediction.setPredictionsBars();
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
