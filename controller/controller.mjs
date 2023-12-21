import bcrypt, { hash } from "bcrypt";
import { getAllDeviceData } from '../models/device-models.mjs';
import { getAllStaffData } from '../models/staff-models.mjs'; 
import { getAllStaffContactsData, getAllVendorContactsData } from '../models/contacts-models.mjs';
import { getOnCallData } from '../models/on-call-models.mjs';
import { getUserFormsTemplatesData } from "../models/forms-templates-models.mjs";
import { getAllTestingTemplateData } from "../models/testing-templates-models.mjs";
import { retrieveUserCredentials, updateUserPassword } from '../models/models.mjs';
import { FileHandlingError, ParsingError, DBError } from "../error-handling/file-errors.mjs";

export async function validateLoginCredentials(req, res, next, __dirname) {
    try {
        // Define the entered credentials in the request
        const email = req.body.email;
        const submittedPassword = req.body.password;

        // Validate the user credentials 
        const emailRegex = /^[A-Za-z0-9]+\.[A-Za-z0-9]+(@health.nsw.gov.au)$|[0-9]+/;
        const invalidPasswordRegex = /^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$/
        
        // Check if email address valid
        if (!emailRegex.test(email)) {
            throw new Error("Email does not match the required email pattern");
        }

        // Check if password valid
        if (invalidPasswordRegex.test(submittedPassword)) {
            throw new Error("Password does not match required pattern. Please ensure it is at least 8 characters and has at least 1 lowercase letter, 1 uppercase letter, 1 number and 1 special character");
        }

        // Retrieve the user credentials from the database
        const data = await retrieveUserCredentials(email).catch((err) => {
            throw new DBError(err.message, err.cause, err.action, err.route);
        });
        
        if (data === undefined) {
            throw new Error("The entered Staff ID/Email Address is not in the database");
        }
        
        // Extract the values from the object
        const {FullName, Password, AccessPermissions, StaffId} = data[0];
        
        // Compare the submitted password and hashed password and determine if they match
        const passwordResult = await bcrypt.compare(submittedPassword, Password);
        
        if (passwordResult === true) {
            // Get the staff member details and credentials and send them
            const staffData = await getAllStaffData(__dirname).catch((err) => {
                if (err.type === "FileHandlingError") {
                    throw new FileHandlingError(err.message, err.cause, err.action, err.route);
                }
                else {
                    throw new ParsingError(err.message, err.cause, err.route);
                }
            });
                        
            const user = staffData.find((entry) => {
                return entry.id === StaffId
            })
            
            res.json({type: "Success", credentials: {name: FullName, staffId: StaffId, accessPermissions: AccessPermissions, imageType: user.img}});
        }
        else {
            res.status(400).json({type: "Error", message: `The entered password is incorrect.`})
        }

    } catch (err) {
        console.log({Route: "Validate Login", Error: err.message});
        next(err);
    }
}

export async function changeLoginPassword(req, res, next, __dirname) {
    try {
        // Get the data from the request body
        const staffId = req.body.staffId;
        const currentPassword = req.body.currentPassword;
        const newPassword = req.body.newPassword;

        // Define invalid password regex
        const invalidPasswordRegex = /^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$/

        // Check if entered passwords are valid
        if (invalidPasswordRegex.test(currentPassword)) {
            throw new Error("The entered value for your current password is incorrect and does not match the correct format.");
        }

        if (invalidPasswordRegex.test(newPassword)) {
            throw new Error("The value of your new password does not match required pattern. Please ensure it is at least 8 characters and has at least 1 lowercase letter, 1 uppercase letter, 1 number and 1 special character");
        }

        // Get the hashed password for the current user from the database and compare to submitted password
        // Retrieve the use credentials from the database
        const passwordData = await retrieveUserCredentials(staffId).catch((err) => {
            throw new Error(`${err}`);
        });
            
        if (passwordData === undefined) {
            throw new Error("You user credentials could not be found in the database. Please contact an administartor.");
        }        

        // Extract the hashed password from the returned database object for the current user.
        const {Password} = passwordData[0];
        
        // Compare the submitted password and hashed password and determine if they match
        const passwordResult = await bcrypt.compare(currentPassword, Password);
        
        if (passwordResult) {
            // Define hashing parameters and generate password hash
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
            
            // Update the password in the database
            const dbInsertResult = await updateUserPassword(staffId, hashedPassword).catch((err) => {
                throw new Error(`${err}`);
            });
            
            res.json({type: "Success", message: "Password successfully updated"});
        }
        else {
            res.status(400).json({type: "Error", message: `The value entered for your current password is incorrect.`})
        }
        
    } catch (err) {
        console.log({Route: "Change Password", Error: err.message});
        next(err)
    }
}

export async function getAllData(req, res, next, __dirname) {
    try {
        // Get logged in username.
        const staffId = req.params.staffId;
        
        // Await the resolution of all Promises for reading application data files. 
        const allDataArray = await Promise.all([getAllStaffData(__dirname), getAllDeviceData(__dirname),
            getAllStaffContactsData(__dirname), getAllVendorContactsData(__dirname),
            getOnCallData(__dirname),            
            getUserFormsTemplatesData(__dirname, staffId),
            getAllTestingTemplateData(__dirname)]).catch((err) => {
                throw new FileHandlingError(err.message, err.action, err.route);
            });
        
        // Create the allData object from the Promise.all array.
        const allData = {staffData: allDataArray[0], deviceData: allDataArray[1], 
                         contactsData: allDataArray[2], vendorContactsData: allDataArray[3], 
                         onCallData: allDataArray[4], formsTemplatesData: allDataArray[5],
                        "testingTemplatesData": allDataArray[6]};
        
        // Send the data as a json response.
        res.json(allData);
    }
    catch(err) {
        console.log({Route: "Get App Data", Error: err.message});
        next(err)
    }
}

