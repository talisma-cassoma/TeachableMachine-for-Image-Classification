import { innerHtml } from "./html.js";
import getRandomColor from "./randomColors.js";
import gatherDataForClass from "./gatherDataForClass.js";
import {
    classLabels,
    mobilenetBase,
    trainingInputs,
    trainingOutputs
} from "./loadSavedLoadedModel.js";



let classObject ;
const buttonAddClass = document.querySelector('button.add-class')
const classes = document.querySelector('section.block3')
const predictionContainer = document.querySelector('.predictions')
const predictionBarsProgress = []
const numberOfImagesCollected = []

async function convertAnsaveTensor(dataCollector, image) {
    
    let classNumber = parseInt(dataCollector);
    console.log(classNumber);
 
    let imageFeatures = tf.tidy(function () {
        let imageAsTensor = tf.browser.fromPixels(image);
        let resizedTensorFrame = tf.image.resizeBilinear(imageAsTensor, [224,
            224], true);
        let normalizedTensorFrame = resizedTensorFrame.div(255);
        return mobilenetBase.predict(normalizedTensorFrame.expandDims()).squeeze();
    });

    trainingInputs.push(imageFeatures);
    trainingOutputs.push(classNumber);
    // console.log("trainingInputs: ", trainingInputs);
    // console.log("trainingOutputs: ", trainingOutputs);
    // Intialize array index element if currently undefined.
}

async function processImages(collectedData, inputImagesElement) {
    const {dataCollector, collectedImages}= collectedData;
    const files = await inputImagesElement.files;
    collectedImages.innerText = files.length ;  

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        reader.onload = async function () {
            const image = new Image();
            image.src = reader.result;

            image.onload = async function () {

                // Process the tensor (normalization, resizing)
                convertAnsaveTensor(dataCollector, image)
            }
        }

        reader.readAsDataURL(file);
    }
}

const Class = {
    init() {
        buttonAddClass.addEventListener('click', Class.add)
    },
    add() {

        let newClassName = prompt("Please enter a name:", "");
        if (newClassName == null || newClassName == "") {
            alert("no class added")
        } else {
            //create a html element
            classObject = document.createElement('article')
            classObject.innerHTML = innerHtml.classBox(newClassName, classLabels.length)
            classObject.classList.add('classObject')
            classes.appendChild(classObject)

            //get div.icon.dataCollector on html
            let dataCollectorButton = classObject.children[1].children[1].children[0]
            let collectedImages= classObject.children[1].children[1].children[1]
            dataCollectorButton.addEventListener("mousedown", gatherDataForClass);
            dataCollectorButton.addEventListener("mouseup", gatherDataForClass);
            // Populate the human readable names for classes.
            classLabels.push(dataCollectorButton.getAttribute("data-name"));
            //console.log(classLabels)
            //array of nbrs of images colleccted div a each class div  
            numberOfImagesCollected.push(collectedImages)

            const inputImagesElement = classObject.children[0].children[0]
            const dataCollector = dataCollectorButton.getAttribute('data-1hot')
            inputImagesElement.addEventListener("change",
                () => processImages({dataCollector, collectedImages}, inputImagesElement));


            ////create a progress element in html 
            Class.createLabelPredictionsBar(newClassName)
        }
    },
    createLabelPredictionsBar(className) {
        const predictionBar = document.createElement('div')
        //fill html
        predictionBar.innerHTML = innerHtml.progressBar(className)
        predictionBar.classList.add('progressBarContainer')
        //save it in html page
        predictionContainer.appendChild(predictionBar)

        const progress = predictionBar.children[1].children[0]
        progress.style.backgroundColor = getRandomColor()
        predictionBarsProgress.push(progress)
        //get div.numberOfImagesCollected in html
    }
}




export { Class, classLabels, predictionBarsProgress }