import React, { createContext, useEffect, useState } from 'react';
import { IAWorker } from '../predictFrame';

const CapturedFrameContext = createContext();

function CapturedFrameProvider({ children }) {
  const [capturedFrame, setCapturedFrame] = useState(null);
  const [predictions, setPredictions] = useState([])

  useEffect(()=>{
    IAWorker.onmessage = async (event) => {
      const [ action, data ] = await event.data;
      if (action === 'starting predictions') {
        IAWorker.postMessage(['predict frame', capturedFrame])
      }
      else if (action === 'predictions') {
        setPredictions(data); // This updates the value of `predictions`
        //console.log('pred :', predictions)
      }
    }
  },[capturedFrame, predictions])

  return (
    <CapturedFrameContext.Provider value={{ capturedFrame, setCapturedFrame, predictions, setPredictions }}>
      {children}
    </CapturedFrameContext.Provider>
  );
}

export {
 CapturedFrameContext,
 CapturedFrameProvider,
}