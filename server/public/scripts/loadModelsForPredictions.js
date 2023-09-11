/**
 * Loads the MobileNet model and warms it up for use.
 **/
import "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.11.0/dist/tf.min.js"
import "https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd"

const{tf} = self

let mobilenetModel;
const MOBILE_NET_INPUT_WIDTH = 224;
const MOBILE_NET_INPUT_HEIGHT= 224;
const classLabels = [];
let trainingInputs = [];
let trainingOutputs = [];

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
    
    // Warm up the model by passing zeros through it once.
    tf.tidy(function () {
        let dummyPrediction = mobilenetModel.predict(tf.zeros([1, MOBILE_NET_INPUT_HEIGHT, MOBILE_NET_INPUT_WIDTH, 3]));
        console.log(dummyPrediction.shape);
    });
    console.log('MobileNet v3 is ready for use');
}
async function getModelLabels() {
    const response = await fetch("http://localhost:3000/train/labels");
    const jsonData = await response.json();
    const classNames = jsonData.labels;
    return classNames;
}

export {
    loadMobileNetFeatureModel,
    mobilenetModel,
    trainingInputs,
    trainingOutputs,
    classLabels,
    getModelLabels
}