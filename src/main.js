// example.js
import { validateHeaders, remapHeader } from "./remap-xlsx.js";
import { headerMap } from "./configs/headerConfig.js";
import fs from 'fs';

const getConfigs = (key) => {
    const args = process.argv.slice(2);
    const inputArg = args.find((arg) => arg.startsWith("--input="));
    const _inputDir = inputArg?.split("=")[1];
    const outputArgs = args.find((arg) => arg.startsWith("--output="));
    const _outputDir = outputArgs?.split("=")[1];
    const countyArgs = args.find((arg) => arg.startsWith("--country="));
    const county = countyArgs?.split("=")[1].toUpperCase();

    if (!headerMap[county]) {
        console.log("================X==============")
        console.log("COUNTRY CONFIG NOT FOUND..!")
        console.log("================X==============")
        process.exit(0);
    }

    const addNewColumns = headerMap[county].ADD_NEW_COLUMNS_API;
    delete headerMap[county].ADD_NEW_COLUMNS_API;
    const headerMapping = headerMap[county];

    return {
        county: county.toUpperCase(),
        headerMapping: headerMapping,
        _inputDir: _inputDir,
        _outputDir: _outputDir,
        addNewColumns: addNewColumns }
}

const processFilesRemap = async(headerMapping, _inputDir, _outputDir,addNewColumns) => {

    let fileList =  await fs.promises.readdir(_inputDir);

    if (!fs.existsSync(_outputDir)) {
        console.log("DIR Created ! ", _outputDir)
        await fs.mkdirSync(_outputDir, { recursive: true });
    }

    fileList = fileList.filter(i=> i.endsWith(".xlsx"));
    for (let i = 0; i < fileList.length; i++) {
        const fileName = `${_inputDir}/${fileList[i]}`;
        const outputName = `${_outputDir}/${fileList[i]}`;
        await remapHeader(headerMapping, fileName, outputName, addNewColumns);
    }
}

const main = async () => {
    const { county, headerMapping,_inputDir, _outputDir, addNewColumns} = getConfigs();
    //console.log('=== VALIDATING HEADERS ===');
    //await validateHeaders();

    console.log('\n=== REMAPPING HEADERS ===');
    console.log("COUNTY::>",county);
    await processFilesRemap(headerMapping, _inputDir, _outputDir, addNewColumns);
}

main();