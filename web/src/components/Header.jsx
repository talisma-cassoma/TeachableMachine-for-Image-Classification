import addClassIcon from '../assets/addClassIcon.svg'
import downloadIcon from '../assets/downloadIcon.svg'

export function Header() {
  return (
    <>
      <section className="block1">
        <button className="add-class">
          <img src={addClassIcon} alt="" /> Add a class</button>
      </section>
      <section className="block2">
        <button id="train">Train model</button>
        <button id="download">
          <img src={downloadIcon} alt="" /> Download</button>
        <button id="reset">Reset</button>
      </section>
    </>
  )
}