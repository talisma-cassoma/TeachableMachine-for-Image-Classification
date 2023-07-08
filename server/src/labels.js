import { readFile, writeFile } from 'fs/promises'

const File = {
     async readJson(filePath){
        const content = await File.getFileContent(filePath)
        return content
    }, 
     async getFileContent(filePath){
        const fileContent =  JSON.parse( await readFile(filePath) )
        return fileContent
    },
    async writeJsonFile(filePath, data){
        let content = JSON.stringify(data);
        await writeFile(filePath, content);
    }, 
}

const Labels = {
    async read(){
        const result = await File.readJson("public/assets/uploads/labels.json")
        return result
    }, 
    async save(data){

        const result = await File.writeJsonFile("public/assets/uploads/labels.json", data)
        return result
    }
}

export { Labels } 

