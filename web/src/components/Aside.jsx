import { PredictionsBar } from "./PredictionsBar"
import { Camera } from "./Camera"
import { newClassLabel } from "../addClassLabel"
import { useEffect, useState } from "react"

export function Aside() {
  const [classLabels, setClassLabels] = useState([])
  const [classLabel, setClassLabel] = useState()
  useEffect(() => {
    setClassLabels([...classLabels, newClassLabel])
  }, [newClassLabel])
  return (
    <aside>
      <Camera />
      {
        classLabels.map((classLabel) => { return <PredictionsBar key={classLabel} /> })
      }
    </aside>
  )
}