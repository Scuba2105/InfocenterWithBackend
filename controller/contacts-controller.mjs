import { getAllStaffContactsData, getAllVendorContactsData, writeAllStaffContactsData, 
writeAllVendorContactsData, generateNewStaffContactData, generateNewVendorContactData } from '../models/contacts-models.mjs'
import { formatPhoneNumber } from '../utils/utils.mjs';
import { Mutex } from 'async-mutex';
import { FileHandlingError, DBError, ParsingError } from '../error-handling/file-errors.mjs';

// Assists with preventing race conditions. 
const staffContactsDataMutex = new Mutex();
const vendorContactsDataMutex = new Mutex();

const staffInputsDescriptions = ["Contact Name", "Contact Position", "Hospital", "Department", "Office Phone", "Dect Phone", "Mobile Phone"];
const staffRegexArray = [/^[a-z ,.'-]+$/i, /^[a-z &\/]+$/i, /^[a-z &\/]+$/i, /^[a-z0-9 &\/]+$/i, /^[0-9]{10}$|^[1-9][0-9]{7}$|^[0-9]{5}$/, /^[0-9]{5}$/, /^0[0-9]{9}$/, /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/] 
const vendorInputsDescriptions = ["Vendor", "Contact Name", "Contact Position", "Office Phone", "Mobile Phone", "Email"];
const vendorRegexArray = [/^[a-z ,.'-3]+$/i, /^[a-z ,.'-]+$/i, /^[a-z ,.'-/]+$/i, /^[0-9]{10}$|^[1-9][0-9]{7}$/, /^0[0-9]{9}$/, /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/];
const phoneEntryKeys = ["Office Phone", "Dect Phone", "Mobile Phone"];
const vendorPhoneKeys = ["Office Phone", "Mobile Phone", "Email"];

export async function addNewContactData(req, res, next, __dirname) {
    if (req.params.formType === "staff") {
        staffContactsDataMutex.runExclusive(async () => {
            try {
                // Read the existing contacts data.
                const existingContactsData = await getAllStaffContactsData(__dirname).catch((err) => {
                    if (err.type === "FileHandlingError") {
                        throw new FileHandlingError(err.message, err.cause, err.action, err.route);
                    }
                    else {
                        throw new ParsingError(err.message, err.cause, err.route);
                    }
                });

                // Validate the supplied input values.
                for (let [index, input] of staffInputsDescriptions.entries()) {
                    if (req.body[input]) {
                        const descIndex = staffInputsDescriptions.indexOf(input);
                        if (!staffRegexArray[descIndex].test(req.body[input])) {
                            throw new Error(`The input ${input} is not of the required pattern. Please edit the value and try again`);
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
                const fileWrittenResult = await writeAllStaffContactsData(__dirname, JSON.stringify(existingContactsData, null, 2)).catch((err) => {
                    throw new FileHandlingError(err.message, err.cause, err.action, err.route);
                });

                // Send the success response message.
                res.json({type: "Success", message: 'Data Upload Successful'});
            
            }
            catch (err) {
                // Send the error response message.
                console.log({Route: "Add Staff Contact", Error: err.message});
                next(err);
            }
        })
    }
    else if (req.params.formType === "vendor") {
        vendorContactsDataMutex.runExclusive(async () => {
            try {
                // Read the existing contacts data.
                const existingContactsData = await getAllVendorContactsData(__dirname).catch((err) => {
                    if (err.type === "FileHandlingError") {
                        throw new FileHandlingError(err.message, err.cause, err.action, err.route);
                    }
                    else {
                        throw new ParsingError(err.message, err.cause, err.route);
                    }
                });

                // Validate the supplied input values.
                for (let [index, input] of vendorInputsDescriptions.entries()) {
                    if (req.body[input]) {
                        const descIndex = vendorInputsDescriptions.indexOf(input);
                        if (!vendorRegexArray[descIndex].test(req.body[input])) {
                            throw new Error(`The input ${input} is not of the required pattern. Please edit the value and try again`);
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
                const fileWrittenResult = await writeAllVendorContactsData(__dirname, JSON.stringify(existingContactsData, null, 2)).catch((err) => {
                    throw new FileHandlingError(err.message, err.cause, err.action, err.route);
                });

                // Send the success response message.
                res.json({type: "Success", message: 'Data Upload Successful'});
        
            }
            catch (err) {
                // Send the error response message.
                console.log({Route: "Add Vendor Contact", Error: err.message});
                next(err);
            }
        })
    }
}

export async function updateContactData(req, res, next, __dirname) {
    if (req.params.formType === "staff") {
        staffContactsDataMutex.runExclusive(async () => {  
            try {      
                const updatedData = req.body;
                const existingContactsData = await getAllStaffContactsData(__dirname).catch((err) => {
                    if (err.type === "FileHandlingError") {
                        throw new FileHandlingError(err.message, err.cause, err.action, err.route);
                    }
                    else {
                        throw new ParsingError(err.message, err.cause, err.route);
                    }
                });
            
                // Validate the supplied input values.
                for (let [index, input] of staffInputsDescriptions.entries()) {
                    if (updatedData[input]) {
                        const descIndex = staffInputsDescriptions.indexOf(input);
                        if (!staffRegexArray[descIndex].test(updatedData[input])) {
                            throw new Error(`The input ${input} is not of the required pattern. Please edit the value and try again`);
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
                const fileWrittenResult = writeAllStaffContactsData(__dirname, JSON.stringify(updatedContactsData, null, 2)).catch((err) => {
                    throw new FileHandlingError(err.message, err.cause, err.action, err.route);
                });

                // Send the success response message.
                res.json({type: "Success", message: 'Data Upload Successful'});
    
            }
            catch (err) {
                // Send the error response message.
                console.log({Route: "Update Staff Contact", Error: err.message});
                next(err);
            }
        })
    }
    else if (req.params.formType === "vendor") {
        vendorContactsDataMutex.runExclusive(async () => {
            try {
                const updatedData = req.body;
                
                // Read the existing contacts data from file.
                const existingContactsData = await getAllVendorContactsData(__dirname).catch((err) => {
                    if (err.type === "FileHandlingError") {
                        throw new FileHandlingError(err.message, err.cause, err.action, err.route);
                    }
                    else {
                        throw new ParsingError(err.message, err.cause, err.route);
                    }
                });

                // Validate the supplied input values.
                for (let [index, input] of vendorInputsDescriptions.entries()) {
                    if (req.body[input]) {
                        const descIndex = vendorInputsDescriptions.indexOf(input);
                        if (!vendorRegexArray[descIndex].test(req.body[input])) {
                            throw new Error(`The input ${input} is not of the required pattern. Please edit the value and try again`);
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
                const fileWrittenResult = await writeAllVendorContactsData(__dirname, JSON.stringify(updatedContactsData, null, 2)).catch((err) => {
                    throw new FileHandlingError(err.message, err.cause, err.action, err.route);
                });

                // Send the success response message.
                res.json({type: "Success", message: 'Data Upload Successful'});
        
            }
            catch (err) {
                // Send the error response message.
                console.log({Route: "Update Vendor Contact", Error: err.message});
                next(err);
            }
        })
    } 
}
