import {  statusElement } from "./loadSavedLoadedModel.js";
import { classLabels } from "./class.js"

export async function downloadModel(model) {
    if (model === undefined) {
        console.log("model undefined")
    } else {
        //save labels on model
        // model.config = {labels: classLabels};
        await model.save('http://localhost:3000/upload')

        const data = { labels: classLabels };

        let response = await fetch('http://localhost:3000/train/labels', {
            method: 'POST',
            mode: "cors",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json"
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(data)
        });

        console.log('!!MODEL DOWNLOADED!!')
         statusElement.innerText = '!! MODEL DOWNLOADED !!'
    }
}