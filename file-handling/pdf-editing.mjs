import {PDFDocument, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { generateEmailAddress } from '../utils/utils.mjs';

const rootDirectory = path.dirname('.');

const existingPdfBytes = fs.readFileSync(path.join(rootDirectory, 'Genius 3 Repair Form.pdf'));

// Load a PDFDocument from the existing PDF bytes
const pdfDoc = await PDFDocument.load(existingPdfBytes)

// Embed the Helvetica font
const courierFont = await pdfDoc.embedFont(StandardFonts.Courier);
console.log(courierFont.getCharacterSet());

// Get the first page of the document
const pages = pdfDoc.getPages()
const firstPage = pages[0]

// Define name for testing. In actual app this will be in the request data
const name = "Steven Bradbury";
const emailAddress = generateEmailAddress(name);

/* In PDF Land, the default (0, 0) coordinate is located at the bottom left corner of the page. 
With y increasing upwards and x increasing towards the right. */

// Add name to the document for Cardinal Health.
firstPage.drawText(name, {
    x: 182,
    y: 588, 
    size: 9,
});

// Add the email address to the document
firstPage.drawText(emailAddress, {
    x: 182,
    y: 571, 
    size: 9,
});

// Serialize the PDFDocument to bytes (a Uint8Array)
const pdfBytes = await pdfDoc.save()

fs.writeFileSync(path.join(rootDirectory, 'Genius 3 Test.pdf'), pdfBytes);