import {PdfReader} from 'pdfreader';
import path from 'path';

const __dirname = path.dirname('.');

// pdf parse data from uploaded pdf buffer
function pdfParseData(file, dataArray) {
    return new Promise((resolve, reject) => {
      new PdfReader().parseBuffer(file, function(err, item){
        if (err)
          reject(err);
        else if (!item)
          resolve(dataArray);
        else if (item.text)
          dataArray.push(item);
      });
    });
};


// parse the saved file data for testing
function pdfParseFile(dataArray) {
    return new Promise((resolve, reject) => {
        new PdfReader().parseFileItems(path.join(__dirname, "34210_2 Recall Defect Correction.pdf"), (err, item) => {
            if (err) reject(`error:, ${err}`);
            else if (!item) resolve(dataArray);
            else if (item.text) dataArray.push(item.text);
        });
    })
}

// Extract the x, y coordinates and text data from parsed text.

async function getSerialNumber() {
    let dataArray = [];
    const pdfObject = await pdfParseFile(dataArray)
    
    // GE Healthcare extraction algorithm;
    const serialNumberHeadingIndex = pdfObject.indexOf('Serial Number:');
    const serialNumber = pdfObject[serialNumberHeadingIndex + 1];

    console.log(serialNumber);    
}

// Run the get serial number function
getSerialNumber();
