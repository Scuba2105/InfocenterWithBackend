import {PDFDocument, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { generateEmailAddress } from '../utils/utils.mjs';

const rootDirectory = path.dirname('.');

// Read the binary data of the Genius 3 template. 
const existingPdfBytes = fs.readFileSync(path.join(rootDirectory, 'templates', 'Genius 3 Service Request Template.pdf'));

// Load a PDFDocument from the existing PDF bytes
const pdfDoc = await PDFDocument.load(existingPdfBytes)

// Get the first page of the document
const pages = pdfDoc.getPages()
const firstPage = pages[0]

// Define name for testing. In actual app this will be in the request data
const name = "Steven Bradbury";

/* Define the list of serial numbers to write to the pdf. In the app this will be obtained from 
   Mobile EMS based on BME.*/
const serialNumbers = ['N1234567', 'N1356789', 'N2314536', 'N2332245', 'N2348907', 'N1234567', 'N1356789', 'N2314536', 'N2332245'];

// Determine the email address of the employee and current date
const emailAddress = generateEmailAddress(name);
const date = new Date().toLocaleDateString();

/* Store text information in array to loop over and draw to pdf
   In PDF Land, the default (0, 0) coordinate is located at the bottom left corner of the page. 
   With y increasing upwards and x increasing towards the right. */
const textDataArray = [{text: name, position: {x: 182, y: 588}, fontSize: 9}, 
    {text: emailAddress, position: {x: 182, y: 571}, fontSize: 9}, 
    {text: date, position: {x: 442, y: 83}, fontSize: 14}, 
    {text: name, position: {x: 150, y: 83}, fontSize: 14}];

// Add name to the document for Cardinal Health.
textDataArray.forEach((data) => {
    firstPage.drawText(data.text, {
        x: data.position.x,
        y: data.position.y, 
        size: data.fontSize,
    });
});

// Set the initial position for the serial numbers
const initialPosition = {x: 162, y: 490};
let updatedPosition = initialPosition;

// Loop over the serial numbers and add them to the table
serialNumbers.forEach((serial) => {
    
    // Write the serial number to the page
    firstPage.drawText(serial, {
        x: updatedPosition.x,
        y: updatedPosition.y, 
        size: 9,
    });

    // Write the Model to the page
    firstPage.drawText('Genius 3', {
        x: updatedPosition.x - 85,
        y: updatedPosition.y, 
        size: 9,
    });

    // Write the fault description to the page
    firstPage.drawText('Not Working / Requires Calibration', {
        x: updatedPosition.x + 100,
        y: updatedPosition.y, 
        size: 9,
    });

    // Increment the y position for writing the next serial number
    updatedPosition.y -= 17;
});

// Serialize the PDFDocument to bytes (a Uint8Array)
const pdfBytes = await pdfDoc.save()

fs.writeFileSync(path.join(rootDirectory, 'Genius 3 Test.pdf'), pdfBytes);