import React, { useState, useEffect, useContext } from 'react'
import './global.css';
import addClassIcon from './assets/addClassIcon.svg'
import downloadIcon from './assets/downloadIcon.svg'
import { Camera } from './components/Camera';
import { ClasslabelBox } from './components/ClassLabelBox';
import { CapturedFrameProvider, CapturedFrameContext } from './hooks/capturedFrameContext'
import { IAWorker } from './predictFrame';

IAWorker.postMessage(['load mobilenet', 'IA'])

export function App() {
  const [newClassLabel, setNewClassLabel] = useState('')
  const [classLabels, setclassLabels] = useState([])
  const { capturedFrame, predictions, setPredictions } = useContext(CapturedFrameContext);

  function addClassLabel() {
    const label = prompt("Please enter a name:", "");

    if (label === null || label === "") {
      alert("no class added");
    } else {
      setNewClassLabel(label);
    }
  }

  useEffect(() => {
    if (newClassLabel !== "" && classLabels.indexOf(newClassLabel) === -1) {
      setclassLabels([...classLabels, newClassLabel]);
      IAWorker.postMessage(['add new class', newClassLabel])
    }
  }, [newClassLabel, classLabels]);

  return (
    <main className='container'>
      <section className="block1">
        <button className="add-class" onClick={addClassLabel}>
          <img src={addClassIcon} alt="" /> Add a class</button>
      </section>
      <section className="block2">
        <button id="train" onClick={() => {
          IAWorker.postMessage(['start train', 'IA'])
        }}>Train model</button>
        <button id="download">
          <img src={downloadIcon} alt="" /> Download</button>
        <button id="reset">Reset</button>
      </section>
      <main className="block3">
        {
          classLabels.map((classLabel, index) => {
            return (
              <ClasslabelBox
                key={index}
                index={index}
                classLabelName={classLabel}
                //prediction={Math.floor(predictions[index])} // Update here
              />
            )
          })
        }
      </main>
      <aside>
        <Camera />
      </aside>
    </main>
  )
}
