
import { identifyPerson, cocoSsdModel,loadPredictionModel } from "./predictionsFunctions.js";

(async()=> await loadPredictionModel())(); 

self.onmessage = async (event) => {
  const capturedFrame  = event.data
  
  // Use the cocoSsd model to detect objects in the image
  const predictions = await cocoSsdModel.detect(capturedFrame);
 
   // Loop through the predictions array
   for (let i = 0; i < predictions.length; i++) {
     // Get the class name and score of each detection
     const className = predictions[i].class;
     const score = predictions[i].score;
 
     // If the class name is 'person' and the score is above a threshold (e.g. 0.5)
     if (className === 'person' && score > 0.5) {
       // Get the bounding box coordinates of the person class in pixels
       const personBbox = predictions[i].bbox;
 
       // Call identifyPerson function to process the person ROI
       const prediction = await identifyPerson(capturedFrame, personBbox);
 
       // Replace the class with mobilenetModel prediction
       predictions[i].class = prediction;
     }
   }
  await new Promise(resolve => setTimeout(resolve, 100));
  self.postMessage(predictions)
}
