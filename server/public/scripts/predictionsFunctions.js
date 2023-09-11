import { mobilenetModel, getModelLabels, loadMobileNetFeatureModel} from "./loadSavedLoadedModel.js";

tf.setBackend('webgl');
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
      statusElement.innerText = 'couldnt load the models and labels from server';
  }
}

function identifyPerson(imageData){
  // Perform AI operations without memory leaks
  let predictionArray;
  let highestIndex;

  tf.tidy(function () {
      const videoFrameTensor = tf.browser.fromPixels(imageData).div(255);
      const resizedFrameTensor = tf.image.resizeBilinear(videoFrameTensor, [MOBILE_NET_INPUT_HEIGHT, MOBILE_NET_INPUT_WIDTH], true);
      const imageFeatures = mobilenetModel.predict(resizedFrameTensor.expandDims());
      const predictions = predictionModel.predict(imageFeatures).squeeze();
      highestIndex = predictions.argMax().arraySync();
      predictionArray = predictions.arraySync();
  });

  return `${objectLabels[highestIndex]}: ${Math.floor(predictionArray[highestIndex] * 100)}% confidence`;
}

const canvasElement = document.getElementById("myCanvas");
const canvasContext = canvasElement.getContext("2d", { willReadFrequently: true });

export {
  loadCocoSsdModel,
  identifyPerson,
  loadPredictionModel,
  cocoSsdModel,
  canvasContext, canvasElement
}