import { getAllStaffData, writeAllStaffData, updateStaffEntry, generateNewStaffData, 
    addNewUserCredentials, updateUserCredentials, hasDBFieldsChanged } from '../models/staff-models.mjs';
import bcrypt, { hash } from "bcrypt";
import { determineTeam } from '../utils/utils.mjs';
import { Mutex } from 'async-mutex';
import { generateNewAccountEmail } from '../mail-server/mail-server.mjs';
import { FileHandlingError, DBError, ParsingError } from '../error-handling/file-errors.mjs';

// Use to prevent race conditions
const staffDataMutex = new Mutex();

// Inputs label property lookup
const propLabelLookup = {name: "Name", if: "Staff Id", workshop: "Workshop", position: "Position",
                        officePhone: "Office Phone", dectPhone: "Dect Phone", workMobile: "Mobile Phone",
                        personalMobile: "Personal Mobile", hostname: "Laptop Hostname", email: "Email Address",
                        "existing-id": "Exisitng Id"}

// Define array of regex's to use for validation.
const inputsRegexLookup = {name: /^[a-z\s,.'-]+$/i, id: /^[0-9]{8}$/i, workshop: /^[a-z ,.'-]+$/i,
                          position: /^[a-z ,.'-]+$/i, officePhone: /^[0-9]{8}$|^[0-9]{3}\s[0-9]{5}$|^[0-9]{5}$/,
                          dectPhone: /^[0-9]{5}$|^\s*$/, workMobile: /^0[0-9]{9}$|^[0-9]{4}\s[0-9]{3}\s[0-9]{3}$|^\s*$/,
                          personalMobile: /^0[0-9]{9}$|^[0-9]{4}\s[0-9]{3}\s[0-9]{3}$|^\s*$/,
                          hostname: /^[A-Z]{3}BME[0-9]{3}|^\s*$/, 
                          email: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                          "existing-id": /^[0-9]{8}$/i,
                          extension: /jpg|png/};

export async function addNewStaffData(req, res, next, __dirname) {
    staffDataMutex.runExclusive(async () => {
        try {
        // Get the current device data 
        const staffData = await getAllStaffData(__dirname).catch((err) => {
            if (err.type === "FileHandlingError") {
                throw new FileHandlingError(err.message, err.cause, err.action, err.route);
            }
            else {
                throw new ParsingError(err.message, err.cause, err.route);
            }
        });
        
        // Validate the request body data
        for (const [key, value] of Object.entries(req.body)) {
            if (!inputsRegexLookup[key].test(value)) {
                throw new Error(`The input value for ${propLabelLookup[key]} is not valid. Please update correct this and try again`);
            }
        }

        // Define the mandatory data in the request body
        const name = req.body.name;
        const id = req.body.id;
        const workshop = req.body.workshop;
        const position = req.body.position;
        const officePhone = req.body.officePhone;
        const email = req.body.email;
        const team = determineTeam(position, workshop);

        // Check that the staff ID is unique
        const currentIDs = staffData.map((entry) => {
            return entry.id
        });
        if (!currentIDs.includes(id)) {
            // throw new Error(`The Staff ID entered already exists. Please ensure a unique ID is entered and try again`);
            // Generate a new staff data object
            const newStaffData = generateNewStaffData(name, id, workshop, position, officePhone, email, team)   

            // Add any optional data provided to the data object
            const optionalData = ["dectPhone", "workMobile", "personalMobile", "img"];
            
            // Loop over optional data and add to data object
            optionalData.forEach((entry) => {
                if (req.body[entry]) {
                    newStaffData[entry] = req.body[entry];
                }
            });

            // Append the new staff data 
            staffData.push(newStaffData);

            // Write the data to file
            const fileWritten = await writeAllStaffData(__dirname, JSON.stringify(staffData, null, 2)).catch((err) => {
                throw new FileHandlingError(err.message, err.cause, err.action, err.route);
            });

            // Define hashing parameters and generate password hash
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(`InfoCentreUser${id}?`, saltRounds);

            // Create new entry in the Users table
            const dbInsertResult = await addNewUserCredentials(id, name, email, hashedPassword).catch((err) => {
                throw new DBError(err.message, err.cause, err.table, err.action, err.querySuccess);
            });

            res.json({type: "Success", message: 'Data Upload Successful'}); 
            return
        }

        // Define hashing parameters and generate password hash
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(`InfoCentreUser${id}?`, saltRounds);
        
        // Create new entry in the Users table
        const dbInsertResult = await addNewUserCredentials(id, name, email, hashedPassword).catch((err) => {
            throw new DBError(err.message, err.cause, err.table, err.action, err.querySuccess);
        });

        // Send the account and login details email to the new user
        // const sentEmail = await generateNewAccountEmail(email, `InfoCentreUser${id}?`).catch((err) => {
        //     throw new Error(`${err}`);
        // });

        // Send the success response message.
        res.json({type: "Success", message: `App Data already exists for ${name}. Please verify this data is valid and update if required. Database Entry successfully updated.`}); 
        
        } catch (err) {
            // Log the route and error message and call error handling middlware.
            console.log({Route: "Add New Staff", Error: err.message});
            next(err);
        }
    })
}

export async function updateExistingStaffData(req, res, next, __dirname) {
    staffDataMutex.runExclusive(async () => {
        try {
        // Get the current device data 
        const staffData = await getAllStaffData(__dirname).catch((err) => {
            if (err.type === "FileHandlingError") {
                throw new FileHandlingError(err.message, err.cause, err.action, err.route);
            }
            else {
                throw new ParsingError(err.message, err.cause, err.route);
            }
        });
        
        // Validate the request body data
        for (const [key, value] of Object.entries(req.body)) {
            console.log(key, inputsRegexLookup[key], value);
            if (!inputsRegexLookup[key].test(value)) {
                throw new Error(`The input value for ${propLabelLookup[key]} is not valid. Please correct this value and try again`)
            }
        }
        
        // Get the staff ID and find the existing employee data
        const existingId = req.body["existing-id"];
        const currentData = staffData.find((entry) => {
            return entry.id === existingId;
        });
                
        // Update the data based on the key value pairs in the request body.
        const updatedEntry = updateStaffEntry(req, currentData);

        // Update the database if any mandatory data is updated
        const {name, id, email} = (req.body)
        
        // Check if mandatory fields changed and update Users table if required.
        const dbFieldsChanged = hasDBFieldsChanged(name, id, email, currentData);
        if (dbFieldsChanged) {
            const dbUpdateResult = await updateUserCredentials(existingId, id, name, email).catch((err) => {
                throw new DBError(err.message, err.cause, err.table, err.action, err.querySuccess);
            });
        }
        
        // Add the new entry to the staff array.
        const updatedStaffData = staffData.map((entry) => {
            if (entry.id === existingId) {
                return updatedEntry;
            }
            return entry;
        })

        // Write the data to file
        const fileWritten = await writeAllStaffData(__dirname, JSON.stringify(updatedStaffData, null, 2)).catch((err) => {
            throw new FileHandlingError(err.message, err.cause, err.action, err.route);
        });

        // Send the success response message.
        res.json({type: "Success", message: 'Data Upload Successful'}); 
    
        } catch (err) {
            // Log the route and error message and call error handling middlware.
            console.log({Route: `Update ${req.body["existing-id"]}`, Error: err.message});
            next(err);
        }
    })
}
