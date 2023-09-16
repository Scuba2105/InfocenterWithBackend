import { readContactsData, readVendorContactsData, writeStaffContactsData, writeVendorContactsData,
generateNewStaffContactData, generateNewVendorContactData, formatPhoneNumber } from '../utils/utils.mjs';

const vendorRegexArray = [/^[a-z ,.'-3]+$/i, /^[a-z ,.'-]+$/i, /^[a-z ,.'-]+$/i, /^[0-9]{10}$|^[1-9][0-9]{7}$/, /^0[0-9]{9}$/, /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/];
const vendorInputsDescriptions = ["Vendor", "Contact Name", "Contact Position", "Office Phone", "Mobile Phone", "Email"];
const phoneEntryKeys = ["Office Phone", "Dect Phone", "Mobile Phone"];
const vendorPhoneKeys = ["Office Phone", "Mobile Phone", "Email"];

export async function addNewContactData(req, res, __dirname) {
    if (req.params.formType === "staff") {
        
        const existingContactsData = await readContactsData(__dirname);

        // Generate new contact object with mandatory data.
        const newContactData = generateNewStaffContactData(req.body); 

        // Add any supplied phone numbers to the new contact object. 
        const contactNumbersLookup = {"Office Phone": "officePhone", "Dect Phone": "dectPhone", "Mobile Phone": "mobilePhone"}
        phoneEntryKeys.forEach((entry) => {
            if (req.body[entry]) {
                newContactData[contactNumbersLookup[entry]] = req.body[entry]
            }
        })

        // Append new contact data to existing data
        existingContactsData.push(newContactData);
        
        // Write the data to file
        writeStaffContactsData(__dirname, JSON.stringify(existingContactsData, null, 2));

        // Send the success response message.
        res.json({type: "Success", message: 'Data Upload Successful'});
    }
    else if (req.params.formType === "vendor") {
        
        const existingContactsData = await readVendorContactsData(__dirname);

        // Validate the supplied input values
        for (let [index, input] of vendorInputsDescriptions.entries()) {
            if (req.body[input]) {
                const descIndex = vendorInputsDescriptions.indexOf(input);
                if (!vendorRegexArray[descIndex].test(req.body[input])) {
                    res.json({type: "Error", message: `The input ${input} is not of the required pattern. Please edit the value and try again`});
                }
            }
        }

        // Generate new contact object with mandatory data.
        const newContactData = generateNewVendorContactData(req.body); 
        
        // Add any supplied phone numbers or email to the new contact object.
        const contactNumbersLookup = {"Office Phone": "officePhone", "Mobile Phone": "mobilePhone", "Email": "email"}
        vendorPhoneKeys.forEach((entry) => {
            if (req.body[entry]) {
                let inputEntry = req.body[entry]
                if (entry !== "Email") {
                    // Format the phone numbers for easier reading
                    inputEntry = formatPhoneNumber(entry, req.body[entry])
                }                

                // Add the phone number to the contact data
                newContactData[contactNumbersLookup[entry]] = inputEntry;
            }
        })

        // Append new contact data to existing data
        existingContactsData.push(newContactData);

        // Write the data to file
        writeVendorContactsData(__dirname, JSON.stringify(existingContactsData, null, 2));

        // Send the success response message.
        res.json({type: "Success", message: 'Data Upload Successful'});
    }
}
