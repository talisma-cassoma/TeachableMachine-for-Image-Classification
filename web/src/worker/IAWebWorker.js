import {
  loadMobileNet,
  ClassLabels,
  mobilenetModel,
  trainingInputs,
  trainingOutputs
} from '../buildModel';
import { trainModel } from '../train';
import * as tf from '@tensorflow/tfjs'

const STOP_DATA_GATHER = -1;
let exampleCounts = [];

function dataGatherLoop(gatherDataState, newFrame) {
  if (gatherDataState !== STOP_DATA_GATHER) {
    let imageFeatures = tf.tidy(function () {
      let videoFrameAsTensor = tf.browser.fromPixels(newFrame);
      let resizedTensorFrame = tf.image.resizeBilinear(videoFrameAsTensor, [224, 224], true);
      let normalizedTensorFrame = resizedTensorFrame.div(255);
      return mobilenetModel.predict(normalizedTensorFrame.expandDims()).squeeze();
    });
    // console.log(imageFeatures)

    trainingInputs.push(imageFeatures);
    trainingOutputs.push(gatherDataState);
    console.log(trainingOutputs)

    // Intialize array index element if currently undefined.
    if (exampleCounts[gatherDataState] === undefined) {
      exampleCounts[gatherDataState] = 0;
    }
    exampleCounts[gatherDataState]++;

    console.log(exampleCounts)
  }
}

self.onmessage = async (event) => {
  const [action, data] = event.data
  //console.log(action)
  switch (action) {
    case 'load mobilenet':
      await loadMobileNet();
      break;
    case 'add new class':
      ClassLabels.push(data);
      console.log(ClassLabels);
      break;
    case 'collect frame':
      const [classNumber, frame] = data;
      dataGatherLoop(classNumber, frame);
      break;
    case 'start train':
      trainModel();
      break;
    default:
      console.log(`Sorry, invalid operation.`);
  }

}
