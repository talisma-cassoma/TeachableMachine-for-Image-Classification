import { Camera } from "./camera.js";
import {
    mobilenetModel,
    trainingInputs,
    trainingOutputs,
    classLabels,
} from "./loadSavedLoadedModel.js";
/**
 * Handle Data Gather for button mouseup/mousedown.
 **/
const STOP_DATA_GATHER = -1;
let gatherDataState = STOP_DATA_GATHER;
let exampleCounts = [];


function dataGatherLoop() {
    if (Camera.videoPlaying && gatherDataState !== STOP_DATA_GATHER) {
        let imageFeatures = tf.tidy(function () {
            let videoFrameAsTensor = tf.browser.fromPixels(Camera.VIDEO);
            let resizedTensorFrame = tf.image.resizeBilinear(videoFrameAsTensor, [Camera.MOBILE_NET_INPUT_HEIGHT,
            Camera.MOBILE_NET_INPUT_WIDTH], true);
            let normalizedTensorFrame = resizedTensorFrame.div(255);
            return mobilenetModel.predict(normalizedTensorFrame.expandDims()).squeeze();
        });

        trainingInputs.push(imageFeatures);
        trainingOutputs.push(gatherDataState);

        // Intialize array index element if currently undefined.
        if (exampleCounts[gatherDataState] === undefined) {
            exampleCounts[gatherDataState] = 0;
        }
        exampleCounts[gatherDataState]++;

        const numberOfImagesCollected = document.querySelectorAll('.numberOfImagesCollected')


        for (let n = 0; n < classLabels.length; n++) {

            numberOfImagesCollected[n].innerText = (exampleCounts[n] === undefined )? 0 : exampleCounts[n]
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