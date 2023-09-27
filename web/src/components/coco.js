
import * as cocoSsd from '@tensorflow-models/coco-ssd';

export default async function predict(imgData){
  const coco= await cocoSsd.load()
  const result = await coco.detect(imgData)
  return result ;
}