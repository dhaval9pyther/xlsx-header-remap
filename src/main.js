// example.js
import { validateHeaders, remapHeader } from "./remap-xlsx.js";
import { headerMap } from "./configs/headerConfig.js";
import fs from 'fs';
import { getAllFiles } from "./proccessFileNames.js";

const getConfigs = (key) => {
    const args = process.argv.slice(2);
    const inputArg = args.find((arg) => arg.startsWith("--input="));
    const _inputDir = inputArg?.split("=")[1];
    // const outputArgs = args.find((arg) => arg.startsWith("--output="));
    // const _outputDir = outputArgs?.split("=")[1];
    const countyArgs = args.find((arg) => arg.startsWith("--country="));
    const county = countyArgs?.split("=")[1].toUpperCase();

    const countyTypeArgs = args.find((arg) => arg.startsWith("--countryType="));
    const countyType = countyTypeArgs?.split("=")[1].toUpperCase();

    console.log("county::>",countyType)
    if (!headerMap[countyType]) {
        console.log("================X==============")
        console.log("COUNTRY CONFIG NOT FOUND..!")
        console.log("================X==============")
        process.exit(0);
    }

    const addNewColumns = headerMap[countyType].ADD_NEW_COLUMNS_API;
    delete headerMap[countyType].ADD_NEW_COLUMNS_API;
    const headerMapping = headerMap[countyType];

    return {
        county: county.toUpperCase(),
        headerMapping: headerMapping,
        _inputDir: _inputDir,
        //_outputDir: _outputDir,
        addNewColumns: addNewColumns }
}

const processFilesRemap = async(headerMapping, _inputDir,addNewColumns, county) => {

    //let fileList =  await fs.promises.readdir(_inputDir);
    let fileList =  await getAllFiles(_inputDir, 'WIP');
    // if (!fs.existsSync(_outputDir)) {
    //     console.log("DIR Created ! ", _outputDir)
    //     await fs.mkdirSync(_outputDir, { recursive: true });
    // }

    console.log("File Count :",fileList.length)
    //fileList = fileList.filter(i=> i.endsWith(".xlsx"));
    for (let i = 0; i < fileList.length; i++) {
        let _outputDir = fileList[i].replace("/WIP/", "/FINAL/");
        const fileName = `${fileList[i]}`;
        const outputName = _outputDir;
        await remapHeader(headerMapping, fileName, outputName, addNewColumns);
    }
}

const main = async () => {
    const { county, headerMapping,_inputDir, addNewColumns} = getConfigs();
    //console.log('=== VALIDATING HEADERS ===');
    //await validateHeaders();

    console.log('\n=== REMAPPING HEADERS ===');
    console.log("COUNTY::>",county);
    await processFilesRemap(headerMapping, _inputDir, addNewColumns, county);
}

main();