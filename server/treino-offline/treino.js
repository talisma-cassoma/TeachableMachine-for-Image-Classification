import fs from 'node:fs';
import path from 'node:path';
import * as tf from '@tensorflow/tfjs-node';

let mobilenetModel;
const classLabels = [];
let trainingInputs = [];
let trainingOutputs = [];
const datasetPath = './PlantDoc-Dataset';
const imageSize = 224;
let model = undefined;
let predict = false;



async function loadMobileNetFeatureModel() {
    const modelURL = 'https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v3_small_100_224/feature_vector/5/default/1';
    const modelLocalStorageKey = 'mobilenetModel-v3';
    try {
        mobilenetModel = await tf.loadGraphModel('file://' + modelLocalStorageKey);
        console.log('Modelo MobileNet carregado do armazenamento local.');
    } catch (error) {
        console.log("Baixando o MobileNet...");
        mobilenetModel = await tf.loadGraphModel(modelURL, { fromTFHub: true });
        console.log('MobileNet v3 baixado com sucesso!');
    }
    try {
        tf.tidy(() => {
            if (mobilenetModel) {
                const prediction = mobilenetModel.predict(tf.zeros([1, 224, 224, 3]));
                console.log('Predição feita com sucesso');
                prediction.dispose();
            } else {
                console.error('Modelo não carregado corretamente.');
            }
        });
    } catch (err) {
        console.error('Erro no tf.tidy:', err);
    }
    console.log('MobileNet v3 está pronto para uso');
}

async function loadDatasetImages(datasetDirectory) {
    const data = [];
    const labels = [];
    const classNames = [];
    const subfolders = fs.readdirSync(datasetDirectory);
    subfolders.forEach((subfolder) => {
        const label = subfolder;
        classNames.push(label);
        const imagesPath = path.join(datasetDirectory, subfolder);
        const imageFiles = fs.readdirSync(imagesPath);
        imageFiles.forEach((file) => {
            const imagePath = path.join(imagesPath, file);
            console.log(imagePath);
            const imageBuffer = fs
         
                const imageTensor = tf.node.decodeImage(imageBuffer, 3)
                    .resizeBilinear([imageSize, imageSize])
                    .div(255.0);
                data.push(imageTensor);
                labels.push(classNames.indexOf(label));
            
                console.error(`Erro ao decodificar a imagem ${imagePath}:`, err);
                
        });
    });
    return { data, labels, classNames };
}


/**
 * Função para realizar o loop de predição com o modelo treinado.
 */
async function predictImage(imageTensor) {
    const imageFeatures = mobilenetModel.predict(imageTensor.expandDims());
    const prediction = model.predict(imageFeatures).squeeze();

    const highestIndex = prediction.argMax().arraySync();
    const predictionArray = prediction.arraySync();

    console.log(`Predição: Classe ${highestIndex}, Confiança: ${predictionArray[highestIndex] * 100}%`);
}

/**
 * Função para realizar o treino e iniciar a predição.
 */
async function trainAndPredict() {
    predict = false;

    // Embaralha as entradas e saídas para o treino
    tf.util.shuffleCombo(trainingInputs, trainingOutputs);
    const outputsAsTensor = tf.tensor1d(trainingOutputs, 'int32');
    const oneHotOutputs = tf.oneHot(outputsAsTensor, classLabels.length);
    const inputsAsTensor = tf.stack(trainingInputs);

    // Treinamento do modelo
    await model.fit(inputsAsTensor, oneHotOutputs, {
        shuffle: true, batchSize: 5, epochs: 10,
        callbacks: {
            onEpochEnd: (epoch, logs) => {
                console.log(`Epoch ${epoch}: Loss = ${logs.loss}, Accuracy = ${logs.acc}`);
            }
        }
    });

    // Libera memória dos tensores usados
    outputsAsTensor.dispose();
    oneHotOutputs.dispose();
    inputsAsTensor.dispose();

    predict = true;

    // Loop de predição com as imagens do dataset
    for (let i = 0; i < trainingInputs.length; i++) {
        await predictImage(trainingInputs[i]);
    }
}

/**
 * Função para construir o modelo.
 */
const Train = {
    buildModel() {
        model = tf.sequential();
        model.add(tf.layers.dense({ inputShape: [1024], units: 128, activation: 'relu' }));
        model.add(tf.layers.dense({ units: classLabels.length, activation: 'softmax' }));

        model.compile({
            optimizer: 'adam',
            loss: (classLabels.length === 2) ? 'binaryCrossentropy' : 'categoricalCrossentropy',
            metrics: ['accuracy']
        });

        console.log('Modelo compilado.');
    },
    async init() {
        // Constrói o modelo e inicia o treinamento
        Train.buildModel();
        await trainAndPredict();
    },
};

/**
 * Função de inicialização do aplicativo.
 */
const App = {
    async init() {
        // Carrega o modelo MobileNet
        await loadMobileNetFeatureModel();

        // Carrega imagens do dataset PlantDoc
        const { data, labels, classNames } = await loadDatasetImages(`${datasetPath}/train`);
        data.forEach((input, index) => {
            trainingInputs.push(input);
            trainingOutputs.push(labels[index]);
        });
        classLabels.push(...classNames);

        // // // Inicia o treinamento
        // // await Train.init();
    }
};

App.init();
