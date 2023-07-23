/***************************************************************************************
here we use TensorFlow.js for AI object detection 
on a live video stream from the user's camera. It loads a pre-trained Coco-SSD model 
for object detection and another AI model from a server for classification. The detected 
objects and their predictions are displayed on an HTML canvas element in real-time.
******************************************************************************************/
// Import necessary modules
import { Camera } from "./camera.js"; // Import the Camera module from camera.js
import { mobilenet, loadMobileNetFeatureModel } from "./loadMobileNetFeatureModel.js"; // Import functions from loadMobileNetFeatureModel.js

// Get canvas and context for rendering
const canvas = document.getElementById("myCanvas"); // Get the canvas element with ID "myCanvas"
const ctx = canvas.getContext("2d"); // Get the 2D rendering context for the canvas

// Variables to store model and prediction data
let cocoSsdModel = undefined; // Coco-SSD model for object detection
let model = undefined; // AI model for predictions
let labels = []; // Array to store the labels/names of objects the model can predict

// Function to draw a single square on the canvas
function drawSquare(x, y, size, color, text) {
    ctx.beginPath(); // Begin drawing a path
    ctx.rect(x, y, size.width, size.height); // Create a rectangle path
    ctx.strokeStyle = color; // Set the stroke color
    ctx.lineWidth = 2; // Set the stroke width
    ctx.stroke(); // Draw the stroke
    if (text) {
        ctx.fillStyle = color; // Set the fill color
        ctx.font = '10px Arial'; // Set the font style for text
        ctx.fillText(text, x + 5, y + 10); // Draw the text above the rectangle
    }
}

// Load the Coco-SSD model
async function loadCoco() {
    cocoSsdModel = await cocoSsd.load(); // Load the Coco-SSD model for object detection
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
        if (Camera.videoPlaying) { // Check if the camera is active
            ctx.drawImage(Camera.VIDEO, 0, 0, canvas.width, canvas.height); // Draw the video frame on the canvas

            const predictions = await cocoSsdModel.detect(Camera.VIDEO); // Use Coco-SSD model to make predictions on the video

            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before drawing new predictions

            predictions.forEach((prediction) => {
                const imageData = ctx.getImageData(prediction.bbox[0], prediction.bbox[1], prediction.bbox[2], prediction.bbox[3]); // Get image data for the predicted bounding box

                tf.tidy(function () { // Perform TensorFlow operations without memory leaks
                    let videoFrameAsTensor = tf.browser.fromPixels(imageData).div(255); // Convert the image data to a tensor and normalize
                    let resizedTensorFrame = tf.image.resizeBilinear(videoFrameAsTensor, [Camera.MOBILE_NET_INPUT_HEIGHT, Camera.MOBILE_NET_INPUT_WIDTH], true); // Resize the tensor to match the input size of the MobileNet model
                    let imageFeatures = mobilenet.predict(resizedTensorFrame.expandDims()); // Get the image features using MobileNet
                    let predict = model.predict(imageFeatures).squeeze(); // Use the AI model to make predictions on the image features
                    let highestIndex = predict.argMax().arraySync(); // Get the index of the highest prediction value
                    let predictionArray = predict.arraySync(); // Convert the predictions tensor to an array

                    let text = `${labels[highestIndex]}: ${Math.floor(predictionArray[highestIndex] * 100)} % confidence`; // Create the text to display above the rectangle
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

            requestAnimationFrame(Prediction.predictLoop); // Request the next animation frame to continue the prediction loop
        } else {
            console.log("Camera is off");
        }
    },

    // Function to load the AI model from the server
    async loadModel() {
        try {
            model = await tf.loadLayersModel("http://localhost:3000/assets/uploads/model.json"); // Load the AI model from the server
            model.summary(); // Display the summary of the AI model
            labels = await Prediction.getModelLabelsNames(); // Get the labels/names of objects from the server
            await loadCoco(); // Load the Coco-SSD model for object detection
            loadMobileNetFeatureModel(); // Load the MobileNet feature model
        } catch (error) {
            console.error("Error loading the model:", error);
        }
    },

    // Function to enable the prediction loop on button click
    enable() {
        const predBtn = document.querySelector(".enablePredictionButton"); // Get the prediction button element
        predBtn.addEventListener("click", () => { // Add click event listener to the button
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
