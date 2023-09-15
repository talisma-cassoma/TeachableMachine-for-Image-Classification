/***************************************************************************************
This code uses TensorFlow.js for AI object detection on a live video stream from the user's camera.
It loads a pre-trained Coco-SSD model for object detection and another AI model from a server for classification.
The detected objects and their predictions are displayed on an HTML canvas element in real-time.
******************************************************************************************/

// Import necessary modules
import { Camera } from "./camera.js";
import { drawFrameWithBoundingBoxes } from './drawFrameWithBoundingBoxes.js'

const predictionWorker = new Worker('./scripts/predictionsWorker.js', { type: 'module' });

// Variables to store model and prediction data
const maxPredictionQueueLength = 20;
const predictionQueue = [];


async function predict(capturedFrame) {
    let predictions = undefined;

    // Sending capturedFrame to worker
    predictionWorker.postMessage(capturedFrame);

    // Returning the predictions when they are received
    return new Promise((resolve) => {
        predictionWorker.onmessage = async (event) => {
            predictions = await event.data;
            resolve(predictions);
        };
    });
}

async function processPredictionFrames() {
    if (predictionQueue.length > 0) {
        const frame = await predictionQueue.shift();
        await drawFrameWithBoundingBoxes(frame)
    }
}
const PredictionModule = {
    async startPredictionLoop() {
        if (Camera.videoPlaying) {
            // Get canvas and context for rendering
            const canvasElement = document.getElementById("myCanvas");
            const canvasContext = canvasElement.getContext("2d", { willReadFrequently: true });

            canvasContext.drawImage(Camera.VIDEO, 0, 0, canvasElement.width, canvasElement.height);
            Camera.VIDEO.style.visibility = "hidden";
            const capturedFrame = canvasContext.getImageData(0, 0, canvasElement.width, canvasElement.height);

            const predictions = await predict(capturedFrame)
            await drawFrameWithBoundingBoxes({ image: capturedFrame, predictions })
            // predictionQueue.push({ image: capturedFrame, predictions });

            // if (predictionQueue.length >= maxPredictionQueueLength) {
            //     await processPredictionFrames();
            // }
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
        PredictionModule.enablePredictionLoopOnClick();
    },
};

document.addEventListener('DOMContentLoaded', () => {
    MainApp.initialize();
});