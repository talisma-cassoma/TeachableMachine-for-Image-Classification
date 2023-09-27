import './Camera.css'
import cameralogo from '../assets/camera.svg'
import trainLogo from '../assets/startTrain.svg'
import trainButtonLogo from '../assets/trainButton.svg'
import React, { useRef, useState , useEffect} from 'react';
import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import Webcam from "react-webcam";

export function Camera() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  //load the cocoSsdModel
  const runModel= async () => {
    const cocoSsdModel =await cocoSsd.load();
  setInterval(() => {
    detect(cocoSsdModel);
  }, 100);
  }
  const detect = async (cocoSsdModel) => {
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
      // canvasRef.current.width = videoWidth;
      // canvasRef.current.height = videoHeight;
      const predictions = await cocoSsdModel.detect(video)
      console.log(predictions)

    }
  }
  useEffect(()=>{runModel()}, []);
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