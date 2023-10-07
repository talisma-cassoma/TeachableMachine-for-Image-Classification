export function PredictionsBar(props) {
  return (
    <div className="predictions">
      <div className="progressBarContainer">
        <span>{props.classLabelName}</span>
        <div className="progessBar">
          <div className="progress" style={{ backgroundColor: 'red' }}>
            --no prediction--
          </div>
        </div>
      </div>
    </div>
  )
}