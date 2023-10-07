import React, { useState } from 'react'

import './global.css';
import addClassIcon from './assets/addClassIcon.svg'
import downloadIcon from './assets/downloadIcon.svg'

import { Camera } from './components/Camera';
import { ClasslabelBox } from './components/ClassLabelBox';
import { PredictionsBar } from './components/PredictionsBar';


export function App() {

  const [newClassLabel, setNewClassLabel] = useState('')
  const [classLabels, setclassLabels] = useState([])

  function addClassLabel() {
    setNewClassLabel(prompt("Please enter a name:", ""));
    if (newClassLabel == null || newClassLabel == "") {
        alert("no class added")
    } else {
    setclassLabels([newClassLabel, ...classLabels])
    }
  }

  return (
    <main className='container'>
      <section className="block1">
        <button className="add-class" onClick={addClassLabel}>
          <img src={addClassIcon} alt="" /> Add a class</button>
      </section>
      <section className="block2">
        <button id="train">Train model</button>
        <button id="download">
          <img src={downloadIcon} alt="" /> Download</button>
        <button id="reset">Reset</button>
      </section>
      <main className="block3">
        {
          classLabels.map((classLabel, index) => { 
            return <ClasslabelBox key={index} index={index} classLabelName={classLabel}/> })
        }
      </main>
      <aside>
        <Camera />
        {/* {
          classLabels.map((classLabel, index) => { 
            return <PredictionsBar  key={index}  classLabelName={classLabel} /> })
        } */}
      </aside>
    </main>)
}