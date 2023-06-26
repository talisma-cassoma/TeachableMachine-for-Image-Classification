import { STATUS } from "./loadMobileNetFeatureModel.js";
import { CLASS_NAMES } from "./class.js"

export async function downloadModel(model) {
    if (model === undefined) {
        console.log("model undefined")
    } else {
        //save labels on model
        // model.config = {labels: CLASS_NAMES};
        await model.save('http://localhost:3000/upload')

        const data = { labels: CLASS_NAMES };

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
        STATUS.innerText = '!! MODEL DOWNLOADED !!'
    }
}
