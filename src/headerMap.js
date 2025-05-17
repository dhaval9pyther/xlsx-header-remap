// headerMapper.js
import xlsx from 'xlsx';
import fs from 'fs/promises';

/**
 * Checks and replaces headers in an XLSX file based on a mapping object
 * @param {string} inputFilePath - Path to the input XLSX file
 * @param {string} outputFilePath - Path where the output XLSX file will be saved
 * @param {Object} headerMapping - Object containing old header names as keys and new header names as values
 * @param {string[]} [newColumns=[]] - Array of new column names to add as blank columns
 * @returns {Promise<Object>} Result object with status and information about the operation
 */
export const remapXlsxHeaders = async(inputFilePath, outputFilePath, headerMapping, newColumns=[]) => {
  try {
    // Check if input file exists
    try {
      await fs.access(inputFilePath);
    } catch (error) {
      return {
        success: false,
        message: `Input file not found: ${inputFilePath}`,
        error
      };
    }

    // Read the XLSX file
    const workbook = xlsx.readFile(inputFilePath, { type: 'file' });
    
    // Process each sheet in the workbook
    const result = {
      success: true,
      message: 'Headers successfully remapped',
      sheets: {}
    };
    
    workbook.SheetNames.forEach(sheetName => {
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert sheet to JSON to work with the data more easily
      const jsonData = xlsx.utils.sheet_to_json(worksheet);
      
      if (jsonData.length === 0) {
        result.sheets[sheetName] = {
          status: 'skipped',
          message: 'Sheet is empty'
        };
        return;
      }
      
      // Get current headers (keys of the first object)
      const currentHeaders = Object.keys(jsonData[0]);
      const updatedHeaders = new Map();
      const unmappedHeaders = [];
      
      // Check which headers exist in the mapping
      currentHeaders.forEach(header => {
        if (header in headerMapping) {
          updatedHeaders.set(header, headerMapping[header]);
        } else {
          unmappedHeaders.push(header);
        }
      });
      
      // Update headers in the data
      const updatedData = jsonData.map(row => {
        const newRow = {};
        
        Object.entries(row).forEach(([key, value]) => {
          // Use the mapped header or keep the original if not in mapping
          const newKey = updatedHeaders.has(key) ? updatedHeaders.get(key) : key;
          newRow[newKey] = value;
        });

        // Add new blank columns
        newColumns.forEach(columnName => {
          newRow[columnName] = '';
        });
        
        return newRow;
      });
      
      // Update the sheet with the modified data
      const newWorksheet = xlsx.utils.json_to_sheet(updatedData);
      workbook.Sheets[sheetName] = newWorksheet;
      
      // Record the results for this sheet
      result.sheets[sheetName] = {
        status: 'updated',
        mappedHeaders: Object.fromEntries(updatedHeaders),
        unmappedHeaders,
        addedColumns: newColumns
      };
    });
    
    // Write the updated workbook to the output file
    xlsx.writeFile(workbook, outputFilePath);
    
    return result;
  } catch (error) {
    return {
      success: false,
      message: 'An error occurred while processing the XLSX file',
      error: error.message
    };
  }
}

/**
 * Validates an XLSX file's headers against expected headers
 * @param {string} filePath - Path to the XLSX file
 * @param {string[]} expectedHeaders - Array of expected header names
 * @returns {Promise<Object>} Validation result object
 */
export const validateXlsxHeaders = async(filePath, expectedHeaders) =>{
  try {
    // Check if file exists
    try {
      await fs.access(filePath);
    } catch (error) {
      return {
        valid: false,
        message: `File not found: ${filePath}`,
        error
      };
    }

    // Read the XLSX file
    const workbook = xlsx.readFile(filePath, { type: 'file' });
    
    const result = {
      valid: true,
      message: 'All sheets validated',
      sheets: {}
    };
    
    // Process each sheet
    workbook.SheetNames.forEach(sheetName => {
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = xlsx.utils.sheet_to_json(worksheet);
      
      if (jsonData.length === 0) {
        result.sheets[sheetName] = {
          valid: false,
          message: 'Sheet is empty'
        };
        result.valid = false;
        return;
      }
      
      // Get current headers
      const currentHeaders = Object.keys(jsonData[0]);
      
      // Check if all expected headers are present
      const missingHeaders = expectedHeaders.filter(
        header => !currentHeaders.includes(header)
      );
      
      // Check if there are any unexpected headers
      const extraHeaders = currentHeaders.filter(
        header => !expectedHeaders.includes(header)
      );
      
      result.sheets[sheetName] = {
        valid: missingHeaders.length === 0,
        currentHeaders,
        missingHeaders,
        extraHeaders
      };
      
      if (missingHeaders.length > 0) {
        result.valid = false;
      }
    });
    
    return result;
  } catch (error) {
    return {
      valid: false,
      message: 'An error occurred while validating the XLSX file',
      error: error.message
    };
  }
}