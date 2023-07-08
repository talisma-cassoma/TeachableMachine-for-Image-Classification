import { Camera } from "./camera.js";
/**
 * Loads the MobileNet model and warms it up so ready for use.
 **/
let mobilenet = undefined
const CLASS_NAMES = []
const STATUS = document.getElementById("status");
let trainingDataInputs = [];
let trainingDataOutputs = [];
let examplesCount = [];

async function loadMobileNetFeatureModel() {
    const URL =
        'https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v3_small_100_224/feature_vector/5/default/1';

    mobilenet = await tf.loadGraphModel(URL, { fromTFHub: true });
    STATUS.innerText = 'MobileNet v3 loaded successfully!';

    // Warm up the model by passing zeros through it once.
    tf.tidy(function () {
        let answer = mobilenet.predict(tf.zeros([1, Camera.MOBILE_NET_INPUT_HEIGHT, Camera.MOBILE_NET_INPUT_WIDTH, 3]));
        console.log(answer.shape);
    });
}


export {
    loadMobileNetFeatureModel,
    mobilenet,
    trainingDataInputs,
    trainingDataOutputs,
    examplesCount,
    CLASS_NAMES,
    STATUS
}