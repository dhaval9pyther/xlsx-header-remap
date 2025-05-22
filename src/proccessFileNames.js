import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

export const getAllFiles = async(countryPath, nextPath) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    //const metaDataPath = './MASTERDATA';
    let countryDataPath = countryPath;
    const allFilesPath = [];

    if (!fs.existsSync(countryDataPath)) {
        console.log("Country data folder is not exist.");
        return [];
    }

    if (!fs.existsSync(countryDataPath+'/FINAL/')) {
        console.log("FINAL Dir created..!");
        await fs.mkdirSync(countryDataPath+'/FINAL/', { recursive: true });
        //return [];
    }

    const firstInnerFolders = await fs.promises.readdir(countryDataPath);
    countryDataPath = path.join(countryDataPath, nextPath);

    const importPath = path.join(countryDataPath, 'IMPORT');
    const exportPath = path.join(countryDataPath, 'EXPORT');

    if (fs.existsSync(importPath)) {
        if (fs.existsSync(importPath+'/.DS_Store')) {
            fs.unlinkSync(importPath+'/.DS_Store')
        }
        const importYears = await fs.promises.readdir(importPath);    
        for (let i = 0; i < importYears.length; i++) {
            let yearsPath = path.join(importPath, importYears[i]);
            if (fs.existsSync(yearsPath+'/.DS_Store')) {
                fs.unlinkSync(yearsPath+'/.DS_Store')
            }
            const innerPath = await fs.promises.readdir(yearsPath);

            for (let j = 0; j < innerPath.length; j++) {
                let tempPath = path.join(yearsPath, innerPath[j])
                //console.log("tempPath::>",tempPath)
                if (fs.existsSync((tempPath))) {
                   const filePath =  await fs.promises.readdir(tempPath);
                   filePath.forEach((fileInnerPath) => {
                    let finalPath = path.join(tempPath, fileInnerPath);
                    if (!finalPath.endsWith('/.DS_Store')) {
                        allFilesPath.push(finalPath);   
                    }
                   })
                }
            }
        }
    }

    if (fs.existsSync(exportPath)) {
        const exportYears = await fs.promises.readdir(exportPath);
        for (let i = 0; i < exportYears.length; i++) {
            let yearsPath = path.join(exportPath, exportYears[i]);
            const innerPath = await fs.promises.readdir(yearsPath);
            
            for (let j = 0; j < innerPath.length; j++) {
                let tempPath = path.join(yearsPath, innerPath[j])
                //console.log("tempPath::>",tempPath)
                if (fs.existsSync((tempPath))) {
                   const filePath =  await fs.promises.readdir(tempPath);
                   filePath.forEach((fileInnerPath) => {
                    let finalPath = path.join(tempPath, fileInnerPath);
                    allFilesPath.push(finalPath);
                   })
                }
            }
        }
    }

    return allFilesPath;
}

export const getAllFilesCount = async(countryPath, nextPath) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    //const metaDataPath = './MASTERDATA';
    let countryDataPath = countryPath;
    const allFilesPath = [];

    if (!fs.existsSync(countryDataPath)) {
        console.log("Country data folder is not exist.");
        return [];
    }

    if (!fs.existsSync(countryDataPath+'/FINAL/')) {
        console.log("FINAL Dir created..!");
        await fs.mkdirSync(countryDataPath+'/FINAL/', { recursive: true });
        //return [];
    }

    const firstInnerFolders = await fs.promises.readdir(countryDataPath);
    countryDataPath = path.join(countryDataPath, nextPath);

    const importPath = path.join(countryDataPath, 'IMPORT');
    const exportPath = path.join(countryDataPath, 'EXPORT');

    if (fs.existsSync(importPath)) {
        const importFiles = [];
        if (fs.existsSync(importPath+'/.DS_Store')) {
            fs.unlinkSync(importPath+'/.DS_Store')
        }
        const importYears = await fs.promises.readdir(importPath);    
        for (let i = 0; i < importYears.length; i++) {
            let yearsPath = path.join(importPath, importYears[i]);
            if (fs.existsSync(yearsPath+'/.DS_Store')) {
                fs.unlinkSync(yearsPath+'/.DS_Store')
            }
            const innerPath = await fs.promises.readdir(yearsPath);

            for (let j = 0; j < innerPath.length; j++) {
                let tempPath = path.join(yearsPath, innerPath[j])
                //console.log("tempPath::>",tempPath)
                if (fs.existsSync((tempPath))) {
                   const filePath =  await fs.promises.readdir(tempPath);
                   filePath.forEach((fileInnerPath) => {
                    let finalPath = path.join(tempPath, fileInnerPath);
                    if (!finalPath.endsWith('/.DS_Store')) {
                        allFilesPath.push(finalPath);   
                        importFiles.push(finalPath);   
                    }
                   })
                }
            }
        }
        console.log('Import Files in "', nextPath , '" : ',importFiles.length)
    }

    if (fs.existsSync(exportPath)) {
        const exportFiles = [];
        const exportYears = await fs.promises.readdir(exportPath);
        for (let i = 0; i < exportYears.length; i++) {
            let yearsPath = path.join(exportPath, exportYears[i]);
            const innerPath = await fs.promises.readdir(yearsPath);
            
            for (let j = 0; j < innerPath.length; j++) {
                let tempPath = path.join(yearsPath, innerPath[j])
                //console.log("tempPath::>",tempPath)
                if (fs.existsSync((tempPath))) {
                   const filePath =  await fs.promises.readdir(tempPath);
                   filePath.forEach((fileInnerPath) => {
                    let finalPath = path.join(tempPath, fileInnerPath);
                    allFilesPath.push(finalPath);
                    exportFiles.push(finalPath);
                   })
                }
            }
        }
        console.log('Export Files in "', nextPath , '" : ',exportFiles.length)
    }

    return allFilesPath;
}


const main = async() => {
    const country = "CAMR".toUpperCase();
    const allFiles = await getAllFiles(country);
    console.log("allFiles::>",allFiles.length)

    // const filePath = '/Users/nirali/workspace-upload/upload-to-elastic/MASTERDATA/VENEZUELA/WIP/IMPORT/2018/CH_01_10/01_CH_ALL_IM_01_VENEZUELA_JAN_DEC_2018.xlsx';
    // const filePath2 = '/Users/nirali/workspace-upload/upload-to-elastic/MASTERDATA/VENEZUELA/WIP/IMPORT/2018/CH_21_30/01_CH_ALL_IM_25_VENEZUELA_JAN_DEC_2018_01.xlsx';
    // const getInfo = getFileNameInfo(filePath);
    // const getInfo2 = getFileNameInfo(filePath2);
    // console.log("getInfo::>",getInfo)
    // console.log("getInfo:2:>",getInfo2)
}

// main();