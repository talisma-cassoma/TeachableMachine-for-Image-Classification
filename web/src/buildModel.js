import * as tf from "@tensorflow/tfjs";

const classLabels = ['folha1', 'folah2', 'folha3'];
let model = undefined;
let mobilenetModel = undefined;
let trainingInputs = [];
let trainingOutputs = [];

async function loadMobileNet() {
  console.log("transfer learning")
  const modelURL =
    'http://localhost:5173/mobilenet/model.json';
  const modelLocalStorageKey = 'mobilenetModel-v3';

  try {
    mobilenetModel = await tf.loadGraphModel('localstorage://' + modelLocalStorageKey);
   
    await mobilenetModel.save('localstorage://' + modelLocalStorageKey);
  } catch (error) {
    console.log("Downloading mobilenetModel...");
    mobilenetModel = await tf.loadGraphModel(modelURL);
    console.log('mobilenetModel v3 loaded successfully!')
    // Save the model to local storage
    // await mobilenetModel.save('localstorage://' + modelLocalStorageKey);
  }
}
async function buildModel() {
  model = tf.sequential();
  model.add(tf.layers.dense({ inputShape: [1024], units: 128, activation: 'relu' }));
  model.add(tf.layers.dense({ units: classLabels.length, activation: 'softmax' }));

  model.summary();

  // Compile the model with the defined optimizer and specify a loss function to use.
  model.compile({
    // Adam changes the learning rate over time which is useful.
    optimizer: 'adam',
    // Use the correct loss function. If 2 classes of data, must use binaryCrossentropy.
    // Else categoricalCrossentropy is used if more than 2 classes.
    loss: (classLabels.length === 2) ? 'binaryCrossentropy' : 'categoricalCrossentropy',
    // As this is a classification problem you can record accuracy in the logs too!
    metrics: ['accuracy']
  });
  
  console.log(model);
  //transfer leaaning
  loadMobileNet()
  return model;
}

export {
  buildModel,
  model,
  mobilenetModel,
  trainingInputs,
  trainingOutputs
}