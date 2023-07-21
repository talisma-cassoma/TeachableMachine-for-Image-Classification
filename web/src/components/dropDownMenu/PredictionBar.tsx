
export function PredictionBar(label: string) {
  return (
    <><span>{label}</span><div className="progessBar">
      <div className="progress">
        {"--no prediction--"}
      </div>
    </div></>
  )
}