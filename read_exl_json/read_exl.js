
const XLSX = require('xlsx')
const fs = require('fs')

const dest_json_path = "./export/"
const dest_ts_path = "./export/LanDef.ts"
const xlsxName = "language.xlsx"

const WorkBook = XLSX.readFile(xlsxName, { type: 'string' })
// 读取language的sheet
const WorkSheet = WorkBook.Sheets['language'];
// 读取数据格式为json
const sheetJson = XLSX.utils.sheet_to_json(WorkSheet);

// 可能有多种语言，这里可以填写exl中en外的其他的语言
const languages = ['en']

// 主函数
function deal_language() {
    let allJsonReady = {}
    let idArr = [];
    for (let i = 0; i < languages.length; i++) {
        allJsonReady[languages[i]] = [];
    }
    for (const row in sheetJson) {
        if (Object.hasOwnProperty.call(sheetJson, row)) {
            const rowInfo = sheetJson[row];
            // 如果id为空或者无效，则跳过
            if (!rowInfo['Id'] || rowInfo['Id'] == "") {
                continue;
            }
            // id单独放
            idArr.push(rowInfo['Id'])
            // 其他放到一个object
            for (let i = 0; i < languages.length; i++) {
                allJsonReady[languages[i]].push(rowInfo[languages[i]] ? rowInfo[languages[i]] : "")
            }
        }
    }

    for (const key in allJsonReady) {
        if (Object.hasOwnProperty.call(allJsonReady, key)) {
            let idx = languages.findIndex((item) => { return item === key })
            if (idx != -1) {
                const element = allJsonReady[key];
                writeJsonToFile(idArr, element ? element : "", dest_json_path + "language_" + key + ".json")
            }
        }
    }
    writeDataToTsFile(idArr, dest_ts_path);
}

// 写入json文件
function writeJsonToFile(ids, langs, fileName) {
    var ws = fs.createWriteStream(fileName)
    ws.write("{")
    for (let i = 0; i < ids.length; i++) {
        // 在这里遇到\n换行的问题；采用了json格式的字符串后就解决了。
        ws.write("\n\t" + JSON.stringify(ids[i]) + ": " + JSON.stringify(langs[i]) + ((i != ids.length - 1) ? ',' : ''))
    }
    ws.write("\n}")
    ws.close();
}

// ts文件。这个可有可无。因为项目用的ts文件，所以导出id文件为ts。视项目而定
function writeDataToTsFile(ids, fileName) {
    var ws = fs.createWriteStream(fileName)
    ws.write("export namespace Lan{")
    for (let i = 0; i < ids.length; i++) {
        ws.write(`\n\texport const ${ids[i]} = "${ids[i]}";`)
    }
    ws.write("\n}")
    ws.close();
}

try {
    deal_language()
    console.log('Success!')
} catch (error) {
    console.log('Fail! ' + error)
}
