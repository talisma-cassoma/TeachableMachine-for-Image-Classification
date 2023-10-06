import React from 'react'
import addClassIcon from './assets/addClassIcon.svg'
import downloadIcon from './assets/downloadIcon.svg'

import ReactDOM from 'react-dom/client'
import './global.css';

import { Camera } from './components/Camera';
import { Classlabel } from './components/ClassLabel';
import { PredictionsBar } from './components/PredictionsBar';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <main className='container'>
        <section className="block1">
          <button className="add-class">
            <img src={addClassIcon} alt="" /> Add a class</button>
        </section>
        <section className="block2">
          <button id="train">Train model</button>
          <button id="download">
           <img src={downloadIcon} alt=""  /> Download</button>
          <button id="reset">Reset</button>
        </section>
        <section className="block3">
        <Classlabel/>
        </section>
        <aside>
          <Camera />
          <PredictionsBar/>
        </aside>
    </main>
  </React.StrictMode>,
)
