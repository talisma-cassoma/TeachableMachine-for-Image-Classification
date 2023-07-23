/*
here we use TensorFlow.js for AI object detection 
on a live video stream from the user's camera. It loads a pre-trained Coco-SSD model 
for object detection and another AI model from a server for classification. The detected 
objects and their predictions are displayed on an HTML canvas element in real-time.
*/
// Import necessary modules
import { Camera } from "./camera.js";
import { mobilenet, loadMobileNetFeatureModel } from "./loadMobileNetFeatureModel.js";

// Get canvas and context for rendering
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// Variables to store model and prediction data
let cocoSsdModel = undefined; // Coco-SSD model for object detection
let squares = []; // An array to store squares drawn on the canvas
let model = undefined; // AI model for predictions
let labels = []; // Array to store the labels/names of objects the model can predict

// Function to draw a single square on the canvas
function drawSquare(x, y, size, color, text) {
    // ... (drawing logic)
}

// Load the Coco-SSD model
async function loadCoco() {
    cocoSsdModel = await cocoSsd.load();
}

// Prediction module with functions related to models and prediction loop
const Prediction = {
    // Function to get the model labels names from the server
    async getModelLabelsNames() {
        // Fetch the model labels/names from the server
        const response = await fetch("http://localhost:3000/train/labels");
        const jsonData = await response.json();
        const classNames = jsonData.labels;
        return classNames; // Return the labels/names
    },

    // Prediction loop function to continuously make predictions
    async predictLoop() {
        if (Camera.videoPlaying) {
            // ... (prediction logic)

            // Request the next animation frame to continue the prediction loop
            requestAnimationFrame(Prediction.predictLoop);
        } else {
            console.log("Camera is off");
        }
    },

    // Function to load the AI model from the server
    async loadModel() {
        try {
            // Load the AI model from the server
            model = await tf.loadLayersModel("http://localhost:3000/assets/uploads/model.json");
            model.summary();
            labels = await Prediction.getModelLabelsNames(); // Get the labels/names of objects from the server
            await loadCoco(); // Load the Coco-SSD model for object detection
            loadMobileNetFeatureModel(); // Load the MobileNet feature model
        } catch (error) {
            console.error("Error loading the model:", error);
        }
    },

    // Function to enable the prediction loop on button click
    enable() {
        const predBtn = document.querySelector(".enablePredictionButton");
        predBtn.addEventListener("click", () => {
            if (Camera.videoPlaying) {
                Prediction.predictLoop(); // Start the prediction loop
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
