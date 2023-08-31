import { Camera } from "./camera.js";
/**
 * Loads the MobileNet model and warms it up so ready for use.
 **/
let mobilenet 
const CLASS_NAMES = []
const STATUS = document.getElementById("status");
let trainingDataInputs = [];
let trainingDataOutputs = [];
let examplesCount = [];

async function loadMobileNetFeatureModel() {
    const URL =
        'https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v3_small_100_224/feature_vector/5/default/1';
    // Define the key for storing the model in local storage
    const modelKey = 'mobilenet-v3';
    try {
        mobilenet = await tf.loadGraphModel('localstorage://' + modelKey);
        // Save the model to local storage
        await mobilenet.save('localstorage://' + modelKey);

        } catch (error) {
        // If there is an error, log it and load the model from the URL
        //console.error(error);
        console.log("downloading the mobilenet...")
        mobilenet = await tf.loadGraphModel(URL, { fromTFHub: true });
        console.log('MobileNet v3 loaded successfully!')
        // Save the model to local storage
       // await mobilenet.save('localstorage://' + modelKey);
        }

    STATUS.innerText = 'MobileNet v3 loaded successfully!';

    // Warm up the model by passing zeros through it once.
    tf.tidy(function () {
        let answer = mobilenet.predict(tf.zeros([1, Camera.MOBILE_NET_INPUT_HEIGHT, Camera.MOBILE_NET_INPUT_WIDTH, 3]));
        console.log(answer.shape);
    });
    console.log('MobileNet v3 ready to work')
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