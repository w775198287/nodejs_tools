
const xlsx = require('node-xlsx')
const fs = require('fs')
const path = require('path')

const dest_exl_path = "./export/"
const xlsxName = "ss_language.xls"
const path_json = "./language.json"

const languages = ['en']

function deal() {
    let dir = path.join(__dirname, path_json)
    const strJson = fs.readFileSync(dir, 'utf-8', (err, data) => {
        if (err) {
            console.log(err)
            return
        }
    })
    // console.log(typeof(strJson));
    let jsonData = strJson;
    // console.log(jsonData);
    if (typeof(jsonData) == 'string') {
        jsonData = JSON.parse(jsonData)
    }
    // console.log(jsonData);

    let excelData = [];
    let addInfo = {};
    addInfo.name = "language";
    addInfo.data = [['ID', 'en']];

    let str = ""

    for (const key in jsonData) {
        str = JSON.stringify(jsonData[key]['en']);
        // stringify为了防止\n换行符丢失，但是多出来一组”“双引号，slice用于处理多出的”“双引号
        str = str.slice(1, str.length - 1);
        str = (str)
        addInfo.data.push([key, str]);
    }
    excelData.push(addInfo);
    console.log(excelData)

    let buffer = xlsx.build(excelData);
    fs.writeFile(path.join(dest_exl_path+xlsxName), buffer, (err)=>{
        if (err) {
            throw(err);
        }
        console.log('Write to xls has finished');
    })
}

try {
    deal()
    console.log('Success!')
} catch (error) {
    console.log('Fail! ' + error)
}
