import * as tf from '@tensorflow/tfjs'

import { buildModel, model, trainingInputs, trainingOutputs } from './buildModel'
import { ClassLabels } from './buildModel';

function logProgress(epoch, logs) {
	console.log('Data for epoch ' + epoch, logs);
}

export async function trainModel() {
  
  await buildModel()

	tf.util.shuffleCombo(trainingInputs, trainingOutputs);
	let outputsAsTensor = tf.tensor1d(trainingOutputs, 'int32');
	let oneHotOutputs = tf.oneHot(outputsAsTensor, ClassLabels.length);
	let inputsAsTensor = tf.stack(trainingInputs);

	let results = await model.fit(inputsAsTensor, oneHotOutputs, {
		shuffle: true, batchSize: 5, epochs: 10,
		callbacks: { onEpochEnd: logProgress }
	});

	outputsAsTensor.dispose();
	oneHotOutputs.dispose();
	inputsAsTensor.dispose();
}

