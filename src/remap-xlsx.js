import { remapXlsxHeaders, validateXlsxHeaders } from './headerMap.js';

export const validateHeaders = async () => {
  const expectedHeaders = ['PRODUCT', 'id', 'file', 'uniqueProductName', 'productGroup', 'casNo', 'api_intermediate', 'main_category', 'subCategory1', 'subCategory2', 'subCategory3', 'key', 'pureChemicalName', 'foundCasNumber', 'validChemicalNameCount', 'possibleName', 'verified'];
  
  const validationResult = await validateXlsxHeaders('../sample_map_data.xlsx', expectedHeaders);
  console.log('Validation Result:', JSON.stringify(validationResult, null, 2));
}

export const  remapHeader = async(headerMapping, fileName, outputName, addNewColumns) => {
  try {
    const result = await remapXlsxHeaders(
      fileName, // Input file
      outputName, // output file
      headerMapping,
      addNewColumns
    );
    
    console.log('Remapping Result:', result.success);
    console.log('Remapping Result:', result.message);
    console.log('Headers successfully remapped!', fileName.split('/').pop());
    console.log('------------------------------------------------------------')
    if (false && result.success) {
      
      // Log which headers were mapped in each sheet
      //Object.entries(result.sheets).forEach(([sheetName, sheetResult]) => {
        //console.log(`\nSheet: ${sheetName}`);
        //console.log('Mapped headers:', sheetResult.mappedHeaders);
        //console.log('Unmapped headers:', sheetResult.unmappedHeaders);
        //console.log('Added blank columns:', sheetResult.addedColumns);
      //});
    }
  } catch (error) {
    console.error('Error:', error);
  }
}