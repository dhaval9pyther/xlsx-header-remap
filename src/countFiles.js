// example.js
import { validateHeaders, remapHeader } from "./remap-xlsx.js";
import { headerMap } from "./configs/headerConfig.js";
import fs from 'fs';
import { getAllFiles, getAllFilesCount } from "./proccessFileNames.js";

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

    return {
        county: county.toUpperCase(),
        _inputDir: _inputDir,}
}

const processFilesRemap = async( _inputDir) => {

    //let fileList =  await fs.promises.readdir(_inputDir);
    let fileListInput =  await getAllFilesCount(_inputDir, 'WIP');
    console.log('Files in folder "WIP"',fileListInput.length)

    console.log('========X========')

    let fileListOutput =  await getAllFilesCount(_inputDir, 'FINAL');
    console.log('Files in folder "FINAL"',fileListOutput.length)
    console.log('========X========')
    console.log('Files count status : ', fileListInput.length == fileListOutput.length)
    // if (!fs.existsSync(_outputDir)) {
    //     console.log("DIR Created ! ", _outputDir)
    //     await fs.mkdirSync(_outputDir, { recursive: true });
    // }

    //console.log("File Count :",fileList.length)
    //fileList = fileList.filter(i=> i.endsWith(".xlsx"));
    // for (let i = 0; i < fileList.length; i++) {
    //     let _outputDir = fileList[i].replace("/WIP/", "/FINAL/");
    //     const fileName = `${fileList[i]}`;
    //     const outputName = _outputDir;
    //     await remapHeader(headerMapping, fileName, outputName, addNewColumns);
    // }
}

const main = async () => {
    const { county,_inputDir, addNewColumns} = getConfigs();
    //console.log('=== VALIDATING HEADERS ===');
    //await validateHeaders();

    console.log('\n=== FILE COUNT STATUS ===');
    console.log("COUNTY::>",county);
    await processFilesRemap(_inputDir, addNewColumns, county);
}

main();