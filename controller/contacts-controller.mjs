import { readContactsData, readVendorContactsData, writeStaffContactsData, writeVendorContactsData,
generateNewStaffContactData } from '../utils/utils.mjs';

const phoneEntryKeys = ["Office Phone", "Dect Phone", "Mobile Phone"];

export async function addNewContactData(req, res, __dirname) {
    if (req.params.formType === "staff") {
        
        const existingContactsData = await readContactsData(__dirname);

        // Generate new contact object with mandatory data.
        const newContactData = generateNewStaffContactData(req.body); 

        // Add any supplied phone numbers to the new contqact object. 
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

    }
}
