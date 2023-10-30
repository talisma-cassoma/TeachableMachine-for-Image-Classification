import { useState, useContext, useEffect } from 'react';
import imageIcon from '../assets/imageIcon.svg'
import imagesCollectedIcon from '../assets/imagesCollectedIcon.svg'
import { gatherDataForClass } from "../gatherDataForClass.js";
import { CapturedFrameContext } from '../hooks/capturedFrameContext';


export function ClasslabelBox(prop) {

  const { capturedFrame } = useContext(CapturedFrameContext);
  const [numberOfImagesCollected, setNumberOfImagesCollected] = useState(0);
  
  const [prediction, setPrediction] = useState(prop.prediction);

  useEffect(() => {
    console.log(prop.prediction); // 
    setPrediction(prop.prediction);
  }, [prop.prediction]);

  const handleMouseDown = (event) => {
    //
    gatherDataForClass(event, capturedFrame);
    setNumberOfImagesCollected(prevCount => prevCount + 1);
  }

  const handleMouseUp = (event) => {
    gatherDataForClass(event, capturedFrame);
    //setNumberOfImagesCollected(prevCount => prevCount + 1);
  }

  return (
    <article className="classObject">
      <div className="header">
        <span>{prop.classLabelName}</span>
        <img src={imageIcon} alt="" />
      </div>
      <div className="body">
        <div>hold the button to capture the images for training</div>
        <div className="imagesCollected">
          <div className="icon dataCollector"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            data-1hot={prop.index} data-name={prop.classLabelName}
          >
            <img src={imagesCollectedIcon} alt="" />
            <span>webcam</span>
          </div>
          <div className="progessBar">
            {isNaN(prop.prediction)? (
              <div className="progress" style={{ backgroundColor: 'palegreen' }}>
                --no prediction--
              </div>
            ) : (
              <div
                className="progress"
                style={{ backgroundColor: 'palegreen', width: `${prediction * 100}px` }}
              >
                {prediction * 100}%
              </div>
            )}
          </div>
          <div className="numberOfImagesCollected">
            {numberOfImagesCollected}
          </div>
        </div>
      </div>
    </article>
  )
}
