import './Camera.css'
import cameralogo from '../assets/camera.svg'
import trainLogo from '../assets/startTrain.svg'
import trainButtonLogo from '../assets/trainButton.svg'
import React, { useRef, useState, useEffect } from 'react';
import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import Webcam from "react-webcam";
import predictionLoop from './drawBoundedSquares';


let cocoSsdModel = undefined
try {
  cocoSsdModel = await cocoSsd.load();
  await cocoSsdModel.save('http://localhost:3000/upload/model/cocossd');
} catch (error) {
  console.log(error)
  // cocoSsdModel = cocoSsd.load({ modelUrl: './images/model.json' }).then(model => {
  //     console.log(model);
  //   })
}

export function Camera() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  //load the cocoSsdModel
  const checkCamera = async () => {
    setInterval(() => {
      if (
        typeof webcamRef.current !== "undefined" &&
        webcamRef.current !== null &&
        webcamRef.current.video.readyState === 4
      ) {
        // Get Video Properties
        const video = webcamRef.current.video;
        const videoWidth = webcamRef.current.video.videoWidth;
        const videoHeight = webcamRef.current.video.videoHeight;

        // Set video width
        webcamRef.current.video.width = videoWidth;
        webcamRef.current.video.height = videoHeight;

        // Set canvas width
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;

        // Get canvas context
        const ctx = canvasRef.current.getContext("2d", { willReadFrequently: true });
        ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
        const capturedFrame = ctx.getImageData(0, 0, videoWidth, videoHeight);
        const {x, y, width, height, color, text} = predictionLoop(capturedFrame)
        ctx.clearRect(0, 0, videoWidth, videoHeight);
        ctx.putImageData(capturedFrame, 0, 0);

        ctx.beginPath();
        ctx.rect(x, y, width, height);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = color;
        ctx.font = '8px Arial';
        ctx.fillText(text, x + 5, y + 10);
        
      }
    }, 100)
  }
  useEffect(() => { checkCamera() }, []);
  return (
    <section className='videoPlay'>
      <Webcam id="webcam" ref={webcamRef} autoPlay playsInline muted />
      <canvas ref={canvasRef}></canvas>
      <div className="navBar">
        <div id="enableCam" className="icon" >
          <img src={cameralogo} alt="camera icon" />
        </div>
        <div className="enablePredictionButton icon">
          <img src={trainLogo} alt="start train icon" />
        </div>
        <a className="train icon" href="/train">
          <img src={trainButtonLogo} alt="train icon" />
        </a>
      </div>
    </section>
  )
}