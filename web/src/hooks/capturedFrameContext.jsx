import React, { createContext, useState } from 'react';

const CapturedFrameContext = createContext();

function CapturedFrameProvider({ children }) {
  const [capturedFrame, setCapturedFrame] = useState(null);

  return (
    <CapturedFrameContext.Provider value={{ capturedFrame, setCapturedFrame }}>
      {children}
    </CapturedFrameContext.Provider>
  );
}

export {
 CapturedFrameContext,
 CapturedFrameProvider,
}