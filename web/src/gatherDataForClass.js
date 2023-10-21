/**
 * Handle Data Gather for button mouseup/mousedown.
 **/
import * as tf from '@tensorflow/tfjs'

import { mobilenetModel, trainingInputs, trainingOutputs } from './buildModel'


const STOP_DATA_GATHER = -1;
const classLabels = []
let gatherDataState = STOP_DATA_GATHER;
let exampleCounts = [];


function dataGatherLoop(newFrame) {
    if (gatherDataState !== STOP_DATA_GATHER) {
        let imageFeatures = tf.tidy(function () {
            let videoFrameAsTensor = tf.browser.fromPixels(newFrame);
            let resizedTensorFrame = tf.image.resizeBilinear(videoFrameAsTensor, [224, 224], true);
            let normalizedTensorFrame = resizedTensorFrame.div(255);
            return mobilenetModel.predict(normalizedTensorFrame.expandDims()).squeeze();
        });
        console.log(imageFeatures)

        trainingInputs.push(imageFeatures);
        trainingOutputs.push(gatherDataState);
        
        // Intialize array index element if currently undefined.
        if (exampleCounts[gatherDataState] === undefined) {
            exampleCounts[gatherDataState] = 0;
        }
        exampleCounts[gatherDataState]++;

        //console.log())
    }
}

function gatherDataForClass(event, newFrame) {
    const target = event.target.closest('.icon.dataCollector').getAttribute('data-1hot')
    const classNumber = parseInt(target);
    console.log(target);

    gatherDataState = (gatherDataState === STOP_DATA_GATHER) ? classNumber : STOP_DATA_GATHER;
    console.log(newFrame)
    dataGatherLoop(newFrame);
}
export {
    gatherDataForClass
}