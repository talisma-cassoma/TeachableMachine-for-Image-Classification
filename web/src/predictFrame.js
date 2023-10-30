import * as tf from '@tensorflow/tfjs'
//tf.backend("webgl")

const IAWorker = new Worker('./src/IAWebWorker.js', { type: 'module' });

async function predict(capturedFrame) {
  // console.log(capturedFrame)
  // Sending capturedFrame to worker
  // IAWorker.postMessage(['video frame', capturedFrameTensor]);

  return { x: 5, y: 5, widht: 150, height: 150, color: 'red', text: "hellow world" }
}

function convertToTensor(capturedFrame) {
  // console.log(capturedFrame)
  // convert frame to tf tensor 
  // const capturedFrameTensor = tf.tidy(() => tf.browser.fromPixels(capturedFrame).div(255));
    
  let result;
  IAWorker.onmessage = async (event) => {result = await event.data;}
 
  return result
}

export {
  predict,
  convertToTensor,
  IAWorker,
}
