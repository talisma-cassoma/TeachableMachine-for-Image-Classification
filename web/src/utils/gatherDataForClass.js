/**
 * Handle Data Gather for button mouseup/mousedown.
 **/
import * as tf from '@tensorflow/tfjs'
import { IAWorker } from './predictFrame';


const STOP_DATA_GATHER = -1;
let gatherDataState = STOP_DATA_GATHER;

async function gatherDataForClass(event, newFrame) {
    const target = event.target.closest('.icon.dataCollector').getAttribute('data-1hot');
    const classNumber = parseInt(target);

    gatherDataState = (gatherDataState === STOP_DATA_GATHER) ? classNumber : STOP_DATA_GATHER;

    IAWorker.postMessage(['collect frame', [gatherDataState, newFrame]])
}

export {
    gatherDataForClass
}