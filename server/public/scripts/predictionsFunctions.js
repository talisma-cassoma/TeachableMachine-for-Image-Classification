import "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.11.0/dist/tf.min.js"
import "https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd"

import { mobilenetModel, getModelLabels, loadMobileNetFeatureModel } from "./loadModelsForPredictions.js";
const { tf, cocoSsd } = self
tf.backend("webgl")

const MOBILE_NET_INPUT_WIDTH = 224;
const MOBILE_NET_INPUT_HEIGHT = 224;
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
  let predictionArray;
  let highestIndex;

  tf.tidy(function () {
    const imageTensor = tf.browser.fromPixels(capturedFrame);
    const [y, x, width, height] = personBbox;
    let cropStartPoint = [y, x, 0]
    let cropSize = [height, width, 3]
    //debugger
    let croppedTensor = tf.slice(imageTensor, cropStartPoint, cropSize);
    let resizedTensor = tf.image.resizeBilinear(croppedTensor, [MOBILE_NET_INPUT_WIDTH, MOBILE_NET_INPUT_HEIGHT], true).toInt()
    const imageFeatures = mobilenetModel.predict(resizedTensor.expandDims());
    const predictions = predictionModel.predict(imageFeatures).squeeze();
    highestIndex = predictions.argMax().arraySync();
    predictionArray = predictions.arraySync();
  })
  return objectLabels[highestIndex]
}

export {
  loadCocoSsdModel,
  identifyPerson,
  loadPredictionModel,
  cocoSsdModel
}