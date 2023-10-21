import { buildModel } from './buildModel';

const model = await buildModel()
console.log(model)

 async function predict(capturedFrame){
// console.log(capturedFrame)
return {x:5, y:5, widht:150, height:150, color:'red', text: "hellow world"}
}

export{
  predict
}
 