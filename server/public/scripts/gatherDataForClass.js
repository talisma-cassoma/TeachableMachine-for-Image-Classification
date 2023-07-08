import { Camera } from "./camera.js";
import {
    mobilenet,
    trainingDataInputs,
    trainingDataOutputs,
    examplesCount,
    CLASS_NAMES,
    STATUS
} from "./loadMobileNetFeatureModel.js";
/**
 * Handle Data Gather for button mouseup/mousedown.
 **/
const STOP_DATA_GATHER = -1;
let gatherDataState = STOP_DATA_GATHER;


function dataGatherLoop() {
    if (Camera.videoPlaying && gatherDataState !== STOP_DATA_GATHER) {
        let imageFeatures = tf.tidy(function () {
            let videoFrameAsTensor = tf.browser.fromPixels(Camera.VIDEO);
            let resizedTensorFrame = tf.image.resizeBilinear(videoFrameAsTensor, [Camera.MOBILE_NET_INPUT_HEIGHT,
            Camera.MOBILE_NET_INPUT_WIDTH], true);
            let normalizedTensorFrame = resizedTensorFrame.div(255);
            return mobilenet.predict(normalizedTensorFrame.expandDims()).squeeze();
        });

        trainingDataInputs.push(imageFeatures);
        trainingDataOutputs.push(gatherDataState);

        // Intialize array index element if currently undefined.
        if (examplesCount[gatherDataState] === undefined) {
            examplesCount[gatherDataState] = 0;
        }
        examplesCount[gatherDataState]++;

        const numberOfImagesCollected = document.querySelectorAll('.numberOfImagesCollected')


        for (let n = 0; n < CLASS_NAMES.length; n++) {

            numberOfImagesCollected[n].innerText = (examplesCount[n] === undefined )? 0 : examplesCount[n]
        }
        window.requestAnimationFrame(dataGatherLoop);
    }
}

export default function gatherDataForClass() {
    let classNumber = parseInt(this.getAttribute('data-1hot'));

    console.log(classNumber)
    gatherDataState = (gatherDataState === STOP_DATA_GATHER) ? classNumber : STOP_DATA_GATHER;
    dataGatherLoop();
}
