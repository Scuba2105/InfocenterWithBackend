import { getAllStaffContactsData, getAllVendorContactsData, writeAllStaffContactsData, 
writeAllVendorContactsData, generateNewStaffContactData, generateNewVendorContactData } from '../models/contacts-models.mjs'
import { formatPhoneNumber } from '../utils/utils.mjs';
import { Mutex } from 'async-mutex';

// Assists with preventing race conditions. 
const staffContactsDataMutex = new Mutex();
const vendorContactsDataMutex = new Mutex();

const staffInputsDescriptions = ["Contact Name", "Contact Position", "Hospital", "Department", "Office Phone", "Dect Phone", "Mobile Phone"];
const staffRegexArray = [/^[a-z ,.'-]+$/i, /^[a-z &\/]+$/i, /^[a-z &\/]+$/i, /^[a-z &\/]+$/i, /^[0-9]{10}$|^[1-9][0-9]{7}$|^[0-9]{5}$/, /^[0-9]{5}$/, /^0[0-9]{9}$/, /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/] 
const vendorInputsDescriptions = ["Vendor", "Contact Name", "Contact Position", "Office Phone", "Mobile Phone", "Email"];
const vendorRegexArray = [/^[a-z ,.'-3]+$/i, /^[a-z ,.'-]+$/i, /^[a-z ,.'-/]+$/i, /^[0-9]{10}$|^[1-9][0-9]{7}$/, /^0[0-9]{9}$/, /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/];
const phoneEntryKeys = ["Office Phone", "Dect Phone", "Mobile Phone"];
const vendorPhoneKeys = ["Office Phone", "Mobile Phone", "Email"];

export async function addNewContactData(req, res, __dirname) {
    if (req.params.formType === "staff") {
        try {
            staffContactsDataMutex.runExclusive(async () => {
                const existingContactsData = await getAllStaffContactsData(__dirname);

                // Validate the supplied input values
                for (let [index, input] of staffInputsDescriptions.entries()) {
                    if (req.body[input]) {
                        const descIndex = staffInputsDescriptions.indexOf(input);
                        if (!staffRegexArray[descIndex].test(req.body[input])) {
                            res.json({type: "Error", message: `The input ${input} is not of the required pattern. Please edit the value and try again`});
                        }
                    }
                }

                // Generate new contact object with mandatory data.
                const newContactData = generateNewStaffContactData(req.body); 

                // Add any supplied phone numbers to the new contact object. 
                const contactNumbersLookup = {"Office Phone": "officePhone", "Dect Phone": "dectPhone", "Mobile Phone": "mobilePhone"}
                phoneEntryKeys.forEach((entry) => {
                    if (req.body[entry]) {
                        // Format the phone numbers, if required, for easier reading
                        const inputEntry = formatPhoneNumber(entry, req.body[entry])

                        // Add the entry to the new contact data object 
                        newContactData[contactNumbersLookup[entry]] = inputEntry
                    }
                })

                // Append new contact data to existing data
                existingContactsData.push(newContactData);
                
                // Write the data to file
                writeAllStaffContactsData(__dirname, JSON.stringify(existingContactsData, null, 2));

                // Send the success response message.
                res.json({type: "Success", message: 'Data Upload Successful'});
            })
        }
        catch (err) {
            // Send the error response message.
            console.log(JSON.stringify({Route: "Add Staff Contact", Error: err.message}), null, 2);
            res.json({type: "Error", message: `An error occurred while updating the data: ${err.message}. Please try again and if issue persists contact administrator`});
        }
    }
    else if (req.params.formType === "vendor") {
        try {
            vendorContactsDataMutex.runExclusive(async () => {
                const existingContactsData = await getAllVendorContactsData(__dirname);

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
                writeAllVendorContactsData(__dirname, JSON.stringify(existingContactsData, null, 2));

                // Send the success response message.
                res.json({type: "Success", message: 'Data Upload Successful'});
            })
        }
        catch (err) {
            // Send the error response message.
            console.log(JSON.stringify({Route: "Add Vendor Contact", Error: err.message}), null, 2);
            res.json({type: "Error", message: `An error occurred while updating the data: ${err.message}. Please try again and if issue persists contact administrator`});
        }
    }
}

export async function updateContactData(req, res, __dirname) {
    if (req.params.formType === "staff") {
        try {
            staffContactsDataMutex.runExclusive(async () => {        
                const updatedData = req.body;
                const existingContactsData = await getAllStaffContactsData(__dirname);
                
                // Validate the supplied input values.
                for (let [index, input] of staffInputsDescriptions.entries()) {
                    if (updatedData[input]) {
                        const descIndex = staffInputsDescriptions.indexOf(input);
                        if (!staffRegexArray[descIndex].test(updatedData[input])) {
                            res.json({type: "Error", message: `The input ${input} is not of the required pattern. Please edit the value and try again`});
                        }
                    }
                }
                
                // Use destructuring to get properties required for finding entries.
                const {existingName, existingPosition, ...requiredUpdateData} = updatedData;
                
                // Edit the updated entry in the staff data 
                const updatedContactsData = existingContactsData.map((entry) => {
                    if (entry.contact === existingName && entry.position === existingPosition && entry.hospital === requiredUpdateData.hospital && entry.department === requiredUpdateData.department) {
                        requiredUpdateData.officePhone = requiredUpdateData.officePhone === "" ? "" : formatPhoneNumber("Office Phone", requiredUpdateData.officePhone)
                        requiredUpdateData.mobilePhone = requiredUpdateData.mobilePhone === "" ? "" : formatPhoneNumber("Mobile Phone", requiredUpdateData.mobilePhone)
                        return requiredUpdateData;
                    }
                    else {
                        return entry;
                    }
                })
                
                // Write the data to file
                writeAllStaffContactsData(__dirname, JSON.stringify(updatedContactsData, null, 2));

                // Send the success response message.
                res.json({type: "Success", message: 'Data Upload Successful'});
            });
        }
        catch (err) {
            // Send the error response message.
            console.log(JSON.stringify({Route: "Update Staff Contact", Error: err.message}), null, 2);
            res.json({type: "Error", message: `An error occurred while updating the data: ${err.message}. Please try again and if issue persists contact administrator`});
        }
    }
    else if (req.params.formType === "vendor") {
        try { 
            vendorContactsDataMutex.runExclusive(async () => {
                const updatedData = req.body;
                
                const existingContactsData = await getAllVendorContactsData(__dirname);

                // Validate the supplied input values
                for (let [index, input] of vendorInputsDescriptions.entries()) {
                    if (req.body[input]) {
                        const descIndex = vendorInputsDescriptions.indexOf(input);
                        if (!vendorRegexArray[descIndex].test(req.body[input])) {
                            res.json({type: "Error", message: `The input ${input} is not of the required pattern. Please edit the value and try again`});
                        }
                    }
                }

                // Use destructuring to get properties required for finding entries.
                const {existingName, existingPosition, ...requiredUpdateData} = updatedData;
                
                // Edit the existing vendor data with the updated entry 
                const updatedContactsData = existingContactsData.map((entry) => {
                    if (entry.contact === existingName && entry.position === existingPosition && entry.vendor === requiredUpdateData.vendor) {
                        requiredUpdateData.officePhone = requiredUpdateData.officePhone === "" ? "" : formatPhoneNumber("Office Phone", requiredUpdateData.officePhone)
                        requiredUpdateData.mobilePhone = requiredUpdateData.mobilePhone === "" ? "" : formatPhoneNumber("Mobile Phone", requiredUpdateData.mobilePhone)
                        return requiredUpdateData;
                    }
                    else {
                        return entry;
                    }
                })
                
                // Write the data to file
                writeAllVendorContactsData(__dirname, JSON.stringify(updatedContactsData, null, 2));

                // Send the success response message.
                res.json({type: "Success", message: 'Data Upload Successful'});
            })
        }
        catch (err) {
            // Send the error response message.
            console.log(JSON.stringify({Route: "Update Vendor Contact", Error: err.message}), null, 2);
            res.json({type: "Error", message: `An error occurred while updating the data: ${err.message}. Please try again and if issue persists contact administrator`});
        }
    } 
}
