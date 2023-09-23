import bcrypt, { hash } from "bcrypt"
import {readDeviceData, readStaffData, readContactsData, readVendorContactsData } from '../utils/utils.mjs';
import { retrieveUserCredentials, updateUserPassword } from '../models/models.mjs';

export async function validateLoginCredentials(req, res, __dirname) {
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

        // Retrieve the use credentials from the database
        const data = await retrieveUserCredentials(email);
        
        if (data === undefined) {
            throw new Error("The entered email address is not in the database");
        }

        // Extract the values from the object
        const {FullName, Password, AccessPermissions, StaffId} = data[0];
        
        // Compare the submitted password and hashed password and determine if they match
        const passwordResult = await bcrypt.compare(submittedPassword, Password);
        
        if (passwordResult === true) {
            const appPermissions = {name: FullName, staffId: StaffId, accessPermissions: AccessPermissions};
            res.json({type: "Success", credentials: appPermissions});
        }
        else {
            res.status(400).json({type: "Error", message: `The entered password is incorrect.`})
        }

    } catch (error) {
        console.log(error);
        res.status(400).json({type: "Error", message: error.message});
    }
}

export async function changeLoginPassword(req, res, __dirname) {
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
        const passwordData = await retrieveUserCredentials(staffId);
            
        if (passwordData === undefined) {
            throw new Error("An unexpected error occurred. You user credentials could not be found in the database. Please contact an administartor.");
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
            const result = await updateUserPassword(staffId, hashedPassword); 
            res.json({type: "Success", message: "Password successfully updated"});
        }
        else {
            res.status(400).json({type: "Error", message: `The value entered for you current password is incorrect.`})
        }
        
    } catch (error) {
        console.log(error);
        res.status(400).json({type: "Error", message: error.message});
    }
}

export async function getAllData(req, res, __dirname) {
    try {
        const staffData = await readStaffData(__dirname);
        const deviceData = await readDeviceData(__dirname);
        const contactsData = await readContactsData(__dirname);
        const vendorContactsData = await readVendorContactsData(__dirname);
        const allData = {staffData: staffData, deviceData: deviceData, contactsData: contactsData, vendorContactsData: vendorContactsData};
        res.json(allData);
    }
    catch(error) {
        console.log(error);
    }
}

