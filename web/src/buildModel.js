import * as tf from "@tensorflow/tfjs";
tf.backend('webgl')

const ClassLabels = [];
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
    // Warm up the model by passing zeros through it once.
    tf.tidy(function () {
      let dummyPrediction = mobilenetModel.predict(tf.zeros([1, 224, 224, 3]));
      console.log(dummyPrediction.shape);
    });

    console.log('mobilenetModel v3 loaded successfully!')
    // Save the model to local storage
    // await mobilenetModel.save('localstorage://' + modelLocalStorageKey);
  }
}
async function buildModel() {
  model = tf.sequential();
  model.add(tf.layers.dense({ inputShape: [1024], units: 128, activation: 'relu' }));
  model.add(tf.layers.dense({ units: ClassLabels.length, activation: 'softmax' }));

  model.summary();

  // Compile the model with the defined optimizer and specify a loss function to use.
  model.compile({
    // Adam changes the learning rate over time which is useful.
    optimizer: 'adam',
    // Use the correct loss function. If 2 classes of data, must use binaryCrossentropy.
    // Else categoricalCrossentropy is used if more than 2 classes.
    loss: (ClassLabels.length === 2) ? 'binaryCrossentropy' : 'categoricalCrossentropy',
    // As this is a classification problem you can record accuracy in the logs too!
    metrics: ['accuracy']
  });

  console.log(model);
  //transfer leaaning
}

export {
  buildModel,
  loadMobileNet,
  model,
  mobilenetModel,
  trainingInputs,
  trainingOutputs,
  ClassLabels
}