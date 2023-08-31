/***************************************************************************************
This code uses TensorFlow.js for AI object detection on a live video stream from the user's camera.
It loads a pre-trained Coco-SSD model for object detection and another AI model from a server for classification.
The detected objects and their predictions are displayed on an HTML canvas element in real-time.
******************************************************************************************/

// Import necessary modules
tf.setBackend('webgl');
import { Camera } from "./camera.js";
import { mobilenetModel, loadMobileNetFeatureModel } from "./loadMobileNetFeatureModel.js";

// Get canvas and context for rendering
const canvasElement = document.getElementById("myCanvas");
const canvasContext = canvasElement.getContext("2d", { willReadFrequently: true });

// Variables to store model and prediction data
let cocoSsdModel = undefined;
let predictionModel = undefined;
let objectLabels = [];
const maxPredictionQueueLength = 20;
const predictionQueue = [];

function identifyPerson(imageData){
    // Perform AI operations without memory leaks
    let predictionArray;
    let highestIndex;

    tf.tidy(function () {
        const videoFrameTensor = tf.browser.fromPixels(imageData).div(255);
        const resizedFrameTensor = tf.image.resizeBilinear(videoFrameTensor, [Camera.MOBILE_NET_INPUT_HEIGHT, Camera.MOBILE_NET_INPUT_WIDTH], true);
        const imageFeatures = mobilenetModel.predict(resizedFrameTensor.expandDims());
        const predictions = predictionModel.predict(imageFeatures).squeeze();
        highestIndex = predictions.argMax().arraySync();
        predictionArray = predictions.arraySync();
    });

    return `${objectLabels[highestIndex]}: ${Math.floor(predictionArray[highestIndex] * 100)}% confidence`;
}

function drawFrameWithBoundingBoxes(frame) {
    canvasContext.clearRect(0, 0, canvasElement.width, canvasElement.height);
    const { image, predictions } = frame;

    predictions.forEach((prediction) => {
        let text = '';
        const { bbox, class: className } = prediction;

        if (className == "person") {
            const imageData = canvasContext.getImageData(bbox[0], bbox[1], bbox[2], bbox[3]);
            text = identifyPerson(imageData);
        } else {
            text = `${className}: ${Math.floor(prediction.score * 100)}% confidence`;
        }

        drawSquareOnCanvas(image, bbox[0], bbox[1], { width: bbox[2], height: bbox[3] }, 'red', text);
    });
}

async function processPredictionFrames() {
    if (predictionQueue.length > 0) {
        const frame = predictionQueue.shift();
        drawFrameWithBoundingBoxes(frame);
    }
}

function drawSquareOnCanvas(image, x, y, size, color, text) {
    canvasContext.putImageData(image, 0, 0);
    canvasContext.beginPath();
    canvasContext.rect(x, y, size.width, size.height);
    canvasContext.strokeStyle = color;
    canvasContext.lineWidth = 1;
    canvasContext.stroke();

    if (text) {
        canvasContext.fillStyle = color;
        canvasContext.font = '8px Arial';
        canvasContext.fillText(text, x + 5, y + 10);
    }
}

async function loadCocoSsdModel() {
    cocoSsdModel = await cocoSsd.load();
    console.log('Coco-SSD model loaded');
}

const PredictionModule = {
    async getModelLabels() {
        const response = await fetch("http://localhost:3000/train/labels");
        const jsonData = await response.json();
        const classNames = jsonData.labels;
        return classNames;
    },

    async startPredictionLoop() {
        if (Camera.videoPlaying) {
            canvasContext.drawImage(Camera.VIDEO, 0, 0, canvasElement.width, canvasElement.height);
            const capturedFrame = canvasContext.getImageData(0, 0, canvasElement.width, canvasElement.height);

            const predictions = await cocoSsdModel.detect(capturedFrame);
            predictionQueue.push({ image: capturedFrame, predictions });

            if (predictionQueue.length >= maxPredictionQueueLength) {
                await processPredictionFrames();
            }

            setTimeout(PredictionModule.startPredictionLoop, 100);
        } else {
            console.log("Camera is off");
        }
    },

    async loadPredictionModel() {
        console.log('Loading models and labels');
        try {
            await Promise.all([
                predictionModel = await tf.loadLayersModel("http://localhost:3000/assets/uploads/model.json"),
                objectLabels = await PredictionModule.getModelLabels(),
                loadCocoSsdModel(),
                loadMobileNetFeatureModel()
            ]);
            predictionModel.summary();
        } catch (error) {
            console.error("Error loading the model:", error);
        }
    },

    enablePredictionLoopOnClick() {
        const predictionButton = document.querySelector(".enablePredictionButton");
        predictionButton.addEventListener("click", () => {
            if (Camera.videoPlaying) {
                PredictionModule.startPredictionLoop();
            } else {
                console.log("Camera is off");
            }
        });
    },
};

const MainApp = {
    async initialize() {
        Camera.init();
        await PredictionModule.loadPredictionModel();
        PredictionModule.enablePredictionLoopOnClick();
    },
};

document.addEventListener('DOMContentLoaded', () => {
    MainApp.initialize();
});