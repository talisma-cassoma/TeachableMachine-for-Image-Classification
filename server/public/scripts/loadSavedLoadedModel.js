/**
 * Loads the MobileNet model and warms it up for use.
 **/
import { Camera } from "./camera.js";

let mobilenetBase = undefined;
let mobilenetModel;
const classLabels = [];
const statusElement = document.getElementById("status");
let trainingInputs = [];
let trainingOutputs = [];

async function loadMobileNetFeatureModel() {
    const modelURL =
    'https://storage.googleapis.com/jmstore/TensorFlowJS/EdX/SavedModels/mobilenet-v2/model.json';
   //'https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v3_small_100_224/feature_vector/5/default/1'
    const modelLocalStorageKey = 'mobilenetModel-v3';
    
    try {
        mobilenetModel = await tf.loadLayersModel('localstorage://' + modelLocalStorageKey);
        await mobilenetModel.save('localstorage://' + modelLocalStorageKey);
    } catch (error) {
        console.log("Downloading MobileNet...");
        mobilenetModel = await tf.loadLayersModel(modelURL);
        console.log('MobileNet v3 loaded successfully!')
        // Save the model to local storage
        // await mobilenetModel.save('localstorage://' + modelLocalStorageKey);
    }
    const layer = mobilenetModel.getLayer('global_average_pooling2d_1')
    mobilenetBase = tf.model({inputs: mobilenetModel.inputs, outputs: layer.output})
    mobilenetBase.summary();
    statusElement.innerText = 'MobileNet v3 loaded successfully!';
    
    // Warm up the model by passing zeros through it once.
    tf.tidy(function () {
        let dummyPrediction = mobilenetBase.predict(tf.zeros([1, Camera.MOBILE_NET_INPUT_HEIGHT, Camera.MOBILE_NET_INPUT_WIDTH, 3]));
        console.log(dummyPrediction.shape);
    });
    console.log('MobileNetBase is ready for use');
}
async function getModelLabels() {
    const response = await fetch("http://localhost:3000/train/labels");
    const jsonData = await response.json();
    const classNames = jsonData.labels;
    return classNames;
}

export {
    loadMobileNetFeatureModel,
    mobilenetBase,
    trainingInputs,
    trainingOutputs,
    classLabels,
    statusElement,
    getModelLabels
}