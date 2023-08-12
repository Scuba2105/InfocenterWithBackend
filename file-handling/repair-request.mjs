import {PDFDocument, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { generateEmailAddress, getReducedName, readTickImage } from '../utils/utils.mjs';

export async function populateGenius3RequestTemplate(name, serialNumbers, rootDirectory) {
    try {
        
        // Read the binary data of the Genius 3 template. 
        const existingPdfBytes = fs.readFileSync(path.join(rootDirectory, 'public','templates', 'Genius_3_Service_Request_Template.pdf'));

        // Load a PDFDocument from the existing PDF bytes
        const pdfDoc = await PDFDocument.load(existingPdfBytes)

        // Get the first page of the document
        const pages = pdfDoc.getPages()
        const firstPage = pages[0]

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
        const pdfBytes = await pdfDoc.save();
        
        return pdfBytes;
        //fs.writeFileSync(path.join(rootDirectory, 'Genius 3 Test.pdf'), pdfBytes);        
    } catch (err) {
        console.log(err);
        throw new Error(err.message);
    }
}

export async function cardinalHealthRepairRequest(name, model, serialNumbers, faultDescription, rootDirectory) {
    try {

        let existingPdfBytes, existingPdfBytesTest;

        // Read the binary data of the Appropriate Cardinal Health Template. 
        if (serialNumbers.length === 1) {
            existingPdfBytes = fs.readFileSync(path.join(rootDirectory, 'public','templates', 'Cardinal_Health_Repair_Request_Template.pdf'));
            //existingPdfBytesTest = fs.readFileSync('C:/Users/officeworks/Documents/Web Development/React Tutorial/technical_information_app/InfocenterWithBackend/public/templates/Cardinal_Health_Repair_Request_Template.pdf');
        }
        else if (serialNumbers.length === 2) {
            existingPdfBytes = fs.readFileSync(path.join(rootDirectory, 'public','templates', 'Cardinal_Health_Repair_Request_Template_2_Devices.pdf'));
            //existingPdfBytesTest = fs.readFileSync('C:/Users/officeworks/Documents/Web Development/React Tutorial/technical_information_app/InfocenterWithBackend/public/templates/Cardinal_Health_Repair_Request_Template_2_Devices.pdf');
        }
        else {
            existingPdfBytes = fs.readFileSync(path.join(rootDirectory, 'public','templates', 'Cardinal_Health_Repair_Request_Template_3_Devices.pdf'));
            //existingPdfBytesTest = fs.readFileSync('C:/Users/officeworks/Documents/Web Development/React Tutorial/technical_information_app/InfocenterWithBackend/public/templates/Cardinal_Health_Repair_Request_Template_3_Devices.pdf');
        }
        
        // Load a PDFDocument from the existing PDF bytes
        const pdfDoc = await PDFDocument.load(existingPdfBytes)
        
        // Get the first page of the document
        const pages = pdfDoc.getPages()
        const firstPage = pages[0]
        
        // Determine the email address of the employee and current date
        const emailAddress = generateEmailAddress(name);
        const date = new Date().toLocaleDateString();

        /* Store text information in array to loop over and draw to pdf
        In PDF Land, the default (0, 0) coordinate is located at the bottom left corner of the page. 
        With y increasing upwards and x increasing towards the right. */
        const nameDateYPosition = serialNumbers.length === 1 ? 220 :
                                  serialNumbers.length === 2 ? 203 :
                                  187;

        const textDataArray = [{text: name, position: {x: 182, y: 588}, fontSize: 9}, 
            {text: emailAddress, position: {x: 182, y: 571}, fontSize: 9}, 
            {text: date, position: {x: 442, y: nameDateYPosition}, fontSize: 14}, 
            {text: name, position: {x: 150, y: nameDateYPosition}, fontSize: 14}];

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
        serialNumbers.forEach((serial, index) => {
            
            // Write the serial number to the page
            firstPage.drawText(serial, {
                x: updatedPosition.x,
                y: updatedPosition.y, 
                size: 9,
            });

            // Write the Model to the page
            firstPage.drawText(model, {
                x: updatedPosition.x - 85,
                y: updatedPosition.y, 
                size: 9,
            });

            // Write the fault description to the page
            firstPage.drawText(faultDescription[index], {
                x: updatedPosition.x + 100,
                y: updatedPosition.y, 
                size: 9,
            });

            // Increment the y position for writing the next serial number
            updatedPosition.y -= 17;
        });

        // // Serialize the PDFDocument to bytes (a Uint8Array)
        const pdfBytes = await pdfDoc.save();
        
        return pdfBytes;
        //fs.writeFileSync('C:/Users/officeworks/Documents/Web Development/React Tutorial/technical_information_app/InfocenterWithBackend/public/templates/Request_Test.pdf', pdfBytes); 

    } catch (err) {
        console.log(err);
        throw new Error(err.message);
    }
}

export async function fm30TransducersDeliveryNote(name, ultrasoundNumber, tocoNumber, rootDirectory) {
    try {
        
        const existingPdfBytes = fs.readFileSync(path.join(rootDirectory, 'public','templates', 'FM30 US and Toco Transducers.pdf'));
        //const existingPdfBytesTest = fs.readFileSync('C:/Users/officeworks/Documents/Web Development/React Tutorial/technical_information_app/InfocenterWithBackend/public/templates/FM30 US and Toco Transducers.pdf');
                
        // Load a PDFDocument from the existing PDF bytes
        const pdfDoc = await PDFDocument.load(existingPdfBytes)
        
        // Get the first page of the document
        const pages = pdfDoc.getPages()
        const firstPage = pages[0]
        
        // Determine the email address of the employee and current date
        const emailAddress = generateEmailAddress(name);
        const date = new Date().toLocaleDateString();

        const textDataArray = [{text: name, position: {x: 365, y: 717}, fontSize: 11}, 
            {text: emailAddress, position: {x: 365, y: 610}, fontSize: 11}, 
            {text: date, position: {x: 365, y: 697}, fontSize: 11},
            {text: String(ultrasoundNumber), position: {x: 76, y: 409}, fontSize: 14},
            {text: String(tocoNumber), position: {x: 76, y: 393}, fontSize: 14}];

        // Add name to the document for Cardinal Health.
        textDataArray.forEach((data) => {
            firstPage.drawText(data.text, {
                x: data.position.x,
                y: data.position.y, 
                size: data.fontSize,
            });
        });

        // // Serialize the PDFDocument to bytes (a Uint8Array)
        const pdfBytes = await pdfDoc.save();
        
        return pdfBytes;
        //fs.writeFileSync('C:/Users/officeworks/Documents/Web Development/React Tutorial/technical_information_app/InfocenterWithBackend/public/templates/Request_Test.pdf', pdfBytes); 
    } catch (err) {
        console.log(err);
        throw new Error(err.message);
    }
}

export async function FreseniusKabiRepairRequest(name, hospital, model, serialNumber, faultDescription, errorCode, contactNumber, pickup, rootDirectory) {
    try {
        
        const existingPdfBytes = fs.readFileSync(path.join(rootDirectory, 'public','templates', 'FM30 US and Toco Transducers.pdf'));
        //const existingPdfBytesTest = fs.readFileSync('C:/Users/officeworks/Documents/Web Development/React Tutorial/technical_information_app/InfocenterWithBackend/public/templates/FKA_Request_Template.pdf');
                
        // Load a PDFDocument from the existing PDF bytes
        const pdfDoc = await PDFDocument.load(existingPdfBytes)
        
        // Get the first page of the document
        const pages = pdfDoc.getPages()
        const firstPage = pages[0];

        const emailAddress = generateEmailAddress(name);
        const reducedName = getReducedName(name);
        const returnAddress = `ATTN: ${reducedName}, HNE Clinical Technology, Level 1 John Hunter Hospital, Lookout Road, New Lambton Heights, NSW, 2305`
        const date = new Date().toLocaleDateString();

        const pngImageBytes = readTickImage("C:/Users/officeworks/Documents/Web Development/React Tutorial/technical_information_app/InfocenterWithBackend/public/images/tick.png")
        const tickImage = await pdfDoc.embedPng(pngImageBytes)

        // Specify the array of text elements to draw to the form.
        const textArray = [{text: name, format: {x: 226, y: 787, size: 10}},
            {text: hospital, format: {x: 226, y: 740, size: 10}},
            {text: returnAddress.split(",").slice(0, 3).join(","), format: {x: 226, y: 627, size: 10,}},
            {text: returnAddress.split(",").slice(3).join(","), format: {x: 225, y: 613, size: 10}},
            {text: `(02) ${contactNumber}`, format: {x: 225, y: 568, size: 10}},
            {text: emailAddress, format: {x: 225, y: 524, size: 10}},
            {text: serialNumber, format: {x: 305, y: 412, size: 10}},
            {text: faultDescription, format: {x: 305, y: 319, size: 10}}];
            
        // Loop over the array of elements and draw each text to the page.
        textArray.forEach((entry) => {
            firstPage.drawText(entry.text, entry.format);
        })

        // Draw the error code to the PDF if it is present.
        if (errorCode !== "No Code") {
            // Draw Error Code
            firstPage.drawText(errorCode, {
                x: 305,
                y: 390,
                size: 10,
            });
        }

        // Draw the tick for the appropriate shipping        
        const shippingTickPosition = pickup === "TNT" ? 
        {x: 251, y: 692, width: 12, height: 12} : 
        {x: 328.3, y: 692, width: 12, height: 12};

        firstPage.drawImage(tickImage, shippingTickPosition)

        // Specify the colleciton date if not sending via TNT.
        if (pickup !== "TNT") {
            firstPage.drawText(date, {
                x: 386,
                y: 694,
                size: 10,
            })
        }

        // Determine the appropriate option to tick based on selected model.        
        const modelTickPosition = model === "Volumat" ? 
        {x: 96, y: 467, width: 12, height: 12} : 
        model === "Injectomat" ? {x: 242, y: 467, width: 12, height: 12} :
        model === "Agilia VP" ? {x: 365, y: 467, width: 12, height: 12} :
        model === "Agilia SP" ? {x: 495, y: 467, width: 12, height: 12} :
        "Other model selected"

        // Indicate the model of the device on the form.
        if (["Volumat", "Injectomat", "Agilia VP", "Agilia SP"].includes(model)) {
            firstPage.drawImage(tickImage, modelTickPosition)
        }
        else {
            firstPage.drawText(model, {
                x: 80,
                y: 446,
                size: 10
            })
        }
        
        // Serialize the PDFDocument to bytes (a Uint8Array)
        const pdfBytes = await pdfDoc.save();
        
        return pdfBytes;
        //fs.writeFileSync('C:/Users/officeworks/Documents/Web Development/React Tutorial/technical_information_app/InfocenterWithBackend/public/templates/Request_Test.pdf', pdfBytes); 
        
    } catch (err) {
        console.log(err);
        throw new Error(err.message);
    }
}


