
import { identifyPerson, cocoSsdModel,loadPredictionModel } from "./predictionsFunctions.js";

(async()=> await loadPredictionModel())(); 

self.onmessage = async (event) => {
  const capturedFrame  = event.data
  
  const predictions = await cocoSsdModel.detect(capturedFrame);
  // await predictions.forEach((prediction) => {
    
  //   const { bbox, class: className } = prediction;

  //   if (className == "person") {
  //     prediction.className = identifyPerson(capturedFrame, bbox);
  //   }
  // })
  // Add a delay of 100 milliseconds (adjust as needed)
  //await new Promise(resolve => setTimeout(resolve, 100));
  self.postMessage(predictions)
}
