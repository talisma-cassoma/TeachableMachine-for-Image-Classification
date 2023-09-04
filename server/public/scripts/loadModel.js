/***************************************************************************************
This code uses TensorFlow.js for AI object detection on a live video stream from the user's camera.
It loads a pre-trained Coco-SSD model for object detection and another AI model from a server for classification.
The detected objects and their predictions are displayed on an HTML canvas element in real-time.
******************************************************************************************/

// Import necessary modules
tf.setBackend('webgl');
import { Camera } from "./camera.js";
import { loadPredictionModel, cocoSsdModel } from './predictionsFunctions.js'
//import { drawFrameWithBoundingBoxes, canvasContext, canvasElement } from './worker.js'

const monWorker = new Worker('./scripts/worker.js', { type: 'module' });
// Variables to store model and prediction data
const maxPredictionQueueLength = 20;
const predictionQueue = [];

async function processPredictionFrames() {
    if (predictionQueue.length > 0) {
        const frame = predictionQueue.shift();

        monWorker.postMessage(frame);
        console.log("Message envoyé au worker");
    }

    monWorker.onmessage = function (event) {
        const { action } = event.data;
        if (action == "finished") {
            console.log("Message reçu depuis le worker");
            return;
        }
    };
}

const PredictionModule = {

    async startPredictionLoop() {
        if (Camera.videoPlaying) {
            // Get canvas and context for rendering
            const canvasElement = document.getElementById("myCanvas");
            const canvasContext = canvasElement.getContext("2d", { willReadFrequently: true });

            canvasContext.drawImage(Camera.VIDEO, 0, 0, canvasElement.width, canvasElement.height);
            const capturedFrame = canvasContext.getImageData(0, 0, canvasElement.width, canvasElement.height);

            const predictions = await cocoSsdModel.detect(capturedFrame);
            predictionQueue.push({ image: capturedFrame, predictions });

            if (predictionQueue.length >= maxPredictionQueueLength) {
                await processPredictionFrames();
            }

            requestAnimationFrame(PredictionModule.startPredictionLoop);

        } else {
            console.log("Camera is off");
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
        await loadPredictionModel();
        PredictionModule.enablePredictionLoopOnClick();
    },
};

document.addEventListener('DOMContentLoaded', () => {
    MainApp.initialize();
});