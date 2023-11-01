import React from 'react'
import ReactDOM from 'react-dom/client'
import { CapturedFrameProvider } from './hooks/capturedFrameContext'
import { App } from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CapturedFrameProvider>
      <App />
    </CapturedFrameProvider>
  </React.StrictMode>,
)
