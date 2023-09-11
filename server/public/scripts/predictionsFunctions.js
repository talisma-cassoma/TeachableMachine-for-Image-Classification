import "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.11.0/dist/tf.min.js"
import "https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd"

import { mobilenetModel, getModelLabels, loadMobileNetFeatureModel} from "./loadModelsForPredictions.js";
const {tf, cocoSsd} = self
tf.backend("webgl")

const MOBILE_NET_INPUT_WIDTH = 224;
const MOBILE_NET_INPUT_HEIGHT= 224;
let cocoSsdModel = undefined;
let predictionModel = undefined;
let objectLabels = [];

async function loadCocoSsdModel() {
  cocoSsdModel = await cocoSsd.load();
  console.log('Coco-SSD model loaded');
}
async function loadPredictionModel() {
  console.log('Loading models and labels');
  try {
      await Promise.all([
          predictionModel = await tf.loadLayersModel("http://localhost:3000/assets/uploads/model.json"),
          objectLabels = await getModelLabels(),
          loadCocoSsdModel(),
          loadMobileNetFeatureModel(),
          predictionModel.summary(),
      ]);
  } catch (error) {
      console.error("Error loading the model:", error);
  }
}

function identifyPerson(imageData, bbox){
  // Perform AI operations without memory leaks
  let predictionArray;
  let highestIndex;

  tf.tidy(function () {
      const videoFrameTensor = tf.browser.fromPixels(imageData).div(255); // Convert image element to TensorFlow tensor
    // Crop the image
    const [y1, x1, y2, x2] = bbox;
      const croppedImage = videoFrameTensor.slice([y1, x1, 0], [y2 - y1, x2 - x1, 3]);
      const resizedFrameTensor = tf.image.resizeBilinear(croppedImage, [MOBILE_NET_INPUT_HEIGHT, MOBILE_NET_INPUT_WIDTH], true);
      const imageFeatures = mobilenetModel.predict(resizedFrameTensor.expandDims());
      const predictions = predictionModel.predict(imageFeatures).squeeze();
      highestIndex = predictions.argMax().arraySync();
      predictionArray = predictions.arraySync();
  });

  return `${objectLabels[highestIndex]}: ${Math.floor(predictionArray[highestIndex] * 100)}% confidence`;
}

export {
  loadCocoSsdModel,
  identifyPerson,
  loadPredictionModel,
  cocoSsdModel
}