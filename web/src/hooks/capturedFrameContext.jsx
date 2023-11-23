import React, { createContext, useEffect, useState } from 'react';
import { IAWorker } from '../utils/predictFrame';
//import { socket } from '../utils/websocket';

const CapturedFrameContext = createContext();

function CapturedFrameProvider({ children }) {
  const [capturedFrame, setCapturedFrame] = useState(null);
  const [predictions, setPredictions] = useState([])

  useEffect(()=>{
    // IAWorker.onmessage = async (event) => {
    //    console.log("ouvindo ...")
    //   const [ action, data ] = await event.data;
    //   console.log('event data: ',event.data)
    //   if (action === 'starting predictions') {
    //     IAWorker.postMessage(['predict frame', capturedFrame])

    //   }
    //   else if (action === 'predictions') {
    //     console.log('prediction array :', predictions)
    //     setPredictions([data[0]*Math.random(), data[1]*Math.random()]) ; // This updates the value of `predictions`
    //   }else{
    //     setPredictions([])
    //   }
    // }

    
  },[capturedFrame])

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