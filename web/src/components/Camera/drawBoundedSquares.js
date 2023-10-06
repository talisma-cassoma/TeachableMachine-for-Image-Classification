import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from '@tensorflow-models/coco-ssd';

export default async function predictionLoop(capturedFrame){
// //console.log(capturedFrame)
// let cocoSsdModel = undefined
// try {
//   cocoSsdModel = await  tf.loadGraphModel('http://localhost:5173/cocossd/model.json');
//   ///await cocoSsdModel.save('http://localhost:3000/cocossd/model.json');
//   const predictions = await cocoSsdModel.predict(capturedFrame)
//   console.log(predictions)
// } catch (error) {
//   console.log(error)
//   // cocoSsdModel = cocoSsd.load({ modelUrl: './images/model.json' }).then(model => {
//     //})
// }
return {x:5, y:5, widht:150, height:150, color:'red', text: "hellow world"}
//   setInterval(() => {
//     detect(cocoSsdModel);
//   }, 5);
// }
// const detect = async (cocoSsdModel) => {
//   if (
//     typeof webcamRef.current !== "undefined" &&
//     webcamRef.current !== null &&
//     webcamRef.current.video.readyState === 4
//   ) {
//     // Get Video Properties
//     const video = webcamRef.current.video;
//     const videoWidth = webcamRef.current.video.videoWidth;
//     const videoHeight = webcamRef.current.video.videoHeight;

//     // Set video width
//     webcamRef.current.video.width = videoWidth;
//     webcamRef.current.video.height = videoHeight;

//     // Set canvas width
//     canvasRef.current.width = videoWidth;
//     canvasRef.current.height = videoHeight;
//     if (cocoSsdModel) {
//       const predictions = await cocoSsdModel.detect(video)
//       console.log(predictions)
//     }
//     // Get canvas context
//     const ctx = canvasRef.current.getContext("2d");
//     ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
//   }
}

 