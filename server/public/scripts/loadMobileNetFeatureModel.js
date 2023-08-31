/**
 * Loads the MobileNet model and warms it up for use.
 **/
import { Camera } from "./camera.js";

let mobilenetModel;
const classLabels = [];
const statusElement = document.getElementById("status");
let trainingInputs = [];
let trainingOutputs = [];
let exampleCounts = [];

async function loadMobileNetFeatureModel() {
    const modelURL =
        'https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v3_small_100_224/feature_vector/5/default/1';
    const modelLocalStorageKey = 'mobilenetModel-v3';
    
    try {
        mobilenetModel = await tf.loadGraphModel('localstorage://' + modelLocalStorageKey);
        await mobilenetModel.save('localstorage://' + modelLocalStorageKey);
    } catch (error) {
        console.log("Downloading MobileNet...");
        mobilenetModel = await tf.loadGraphModel(modelURL, { fromTFHub: true });
        console.log('MobileNet v3 loaded successfully!')
        // Save the model to local storage
        // await mobilenetModel.save('localstorage://' + modelLocalStorageKey);
    }

    statusElement.innerText = 'MobileNet v3 loaded successfully!';
    
    // Warm up the model by passing zeros through it once.
    tf.tidy(function () {
        let dummyPrediction = mobilenetModel.predict(tf.zeros([1, Camera.MOBILE_NET_INPUT_HEIGHT, Camera.MOBILE_NET_INPUT_WIDTH, 3]));
        console.log(dummyPrediction.shape);
    });
    console.log('MobileNet v3 is ready for use');
}

export {
    loadMobileNetFeatureModel,
    mobilenetModel,
    trainingInputs,
    trainingOutputs,
    exampleCounts,
    classLabels,
    statusElement
}
