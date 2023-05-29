const fs = require("fs")
const path = require("path")
const tinify = require('tinify')
tinify.key = "pl1c48ZSHdx8mgfVFnWNP4zScFNFqGDC"

const fromPath = "./images/common/v1.2"
const destPath = "./export/"

function fileDisPlay(dir) {
    const files = fs.readdirSync(dir)
    // console.log(files)
    files.forEach((file) => {
        const p = path.join(dir, file)
        if (fs.statSync(p).isDirectory()) {
            fileDisPlay(p)
        } else {
            if (p.substring(p.length-3) == 'png') {
                tinify.fromFile(p).toFile(destPath+file).catch((err)=>{
                    console.log(err)
                })
            }
            // console.log('t = ',t)
        }
    })
}

fileDisPlay(fromPath)