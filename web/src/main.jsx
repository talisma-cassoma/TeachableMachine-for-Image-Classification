import React from 'react'
import ReactDOM from 'react-dom/client'
import './main.css';

import usersLogo from '../src/assets/usersLogo.svg'
import { Camera } from './components/Camera';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div className='container'>
      <main>
        <header>
          <h1>Teachable - Machine</h1>
          <h2>A <strong>Web App</strong> for fast train a neural network based on tensorflowjs</h2>
          <p id="status">Awaiting TF.js load</p>
        </header>
        <Camera />
      </main>
      <aside>
        <section className='predictions'>
          {/* <img src={usersLogo} alt="user logo" /> */}
          <p>predictions</p>
        </section>
        <section className='predictions'>
          <img src={usersLogo} alt="user logo" />
          <p>predictions</p>
        </section>
      </aside>
    </div>
  </React.StrictMode>,
)
