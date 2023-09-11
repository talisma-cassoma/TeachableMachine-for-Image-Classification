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

async function identifyPerson(capturedFrame, personBbox) {
  let prediction;
  tf.tidy(function () {
  // Convert the image element to a tensor
  const imageTensor = tf.browser.fromPixels(capturedFrame);

  // Crop the ROI from the image tensor using tf.image.cropAndResize
  const [x, y, width, height] = personBbox;
  const [imageHeight, imageWidth] = imageTensor.shape.slice(0, 2);
  const boxes = [[y / imageHeight, x / imageWidth, (y + height) / imageHeight, (x + width) / imageWidth]];
  const boxIndices = [0];
  const cropSize = [224, 224];
  const roiTensor = tf.image.cropAndResize(imageTensor, boxes, boxIndices, cropSize);

  // Use the mobilenet model to predict the class of the ROI
  prediction = mobilenetModel.predict(roiTensor);
  })
  return prediction;
}

export {
  loadCocoSsdModel,
  identifyPerson,
  loadPredictionModel,
  cocoSsdModel
}