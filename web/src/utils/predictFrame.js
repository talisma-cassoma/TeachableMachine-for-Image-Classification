import * as tf from '@tensorflow/tfjs'
//tf.backend("webgl")

export const IAWorker = new Worker('../worker/IAWebWorker.js', { type: 'module' });

