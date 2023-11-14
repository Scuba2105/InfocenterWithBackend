import sql from "mssql";
import { infoCenterDBConfig } from "../config.mjs";
import fs from 'fs';
import path from 'path';
import { determineTeam } from '../utils/utils.mjs';
import { hash } from "bcrypt";

// Property lookup translates request data keys to backend keys
const staffObjectPropLookup = {"name": "name", "id": "id", "workshop": "hospital", "position": "position", 
"officePhone": "officePhone", "dectPhone": "dectPhone", "workMobile": "workMobile", 
"personalMobile": "personalMobile", "hostname": "hostname",  "extension": "img", "email": "email"};

sql.on("error", (err) => {
    console.log(`Failed to connect to the database: ${err}`)
})

export function getAllStaffData(__dirname) {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, 'data', 'staff-data.json'), (err, data) => {
            if (err) {
                reject({type: "FileHandlingError", message: err.message, action: "read", route: "Staff"});
            }
            else {
                try {
                    const staffData = JSON.parse(data);
                    resolve(staffData);
                }
                catch(err) {
                    reject({type: "ParsingError", message: err.message, route: "Staff"})
                }
            }
        });
    })
}

export function writeAllStaffData(__dirname, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path.join(__dirname, 'data', 'staff-data.json'), data, (err) => {
            if (err) {
                reject({type: "FileHandlingError", message: err.message, action: "write", route: "Staff"});
            } 
            resolve("Success");
        });
    });
}

export function updateStaffEntry(req, currentData) {
    for (const [key, value] of Object.entries(req.body)) {
        
        // Get the staff object property corresponding to the form data name.
        const prop = staffObjectPropLookup[key];
        
        if (value !== currentData[key]) {
            
            // prop is valid then overwrite the data entry with req.body entry
            if (prop !== undefined) {
                // Update the current data
                currentData[prop] = value;
            }
        }
    }

    // Update the team entry if required
    const position = currentData.position
    const workshop = currentData.hospital
    const team = determineTeam(position, workshop);
    if (team !== currentData.team) {
        currentData.team = team;
    }
        
    return currentData;
}

export async function addNewUserCredentials(id, name, email, hashedPassword) {
    return new Promise(async(resolve, reject) => {
        try {
            // Connect to the database
            await sql.connect(infoCenterDBConfig);  
        
            // Create a new request object
            const request = new sql.Request();

            // Query the database for user credentials
            const result = await request
                .input('input_parameter1', sql.VarChar, email)
                .input('input_parameter2', sql.VarChar, name)
                .input('input_parameter3', sql.VarChar, hashedPassword)
                .input('input_parameter4', sql.VarChar, "user")
                .input('input_parameter5', sql.VarChar, id)
                .query(`INSERT INTO Users(Email, FullName, Password, AccessPermissions, StaffId)
                        VALUES (@input_parameter1, @input_parameter2, @input_parameter3, @input_parameter4, @input_parameter5)`)

            // Check that the data was inserted into the database.
            if (result.rowsAffected == 0){
                reject({type: "DBError", message: `Nothing was inserted into the database as the entered Staff ID already exists. Please verify you have entered the correct ID.`,
                table: "Users", action: "INSERT", querySuccess: true});
            }

            // Return the recordset.
            resolve(result.recordset); 
        }
        catch (error) {
            reject({type: "DBError", message: error.message, cause: error, table: "Users", action: "INSERT"});          
        }
    })
}

export async function updateUserCredentials(existingId, id, name, email) {
    return new Promise(async(resolve, reject) => {
        try {
            // Connect to the database
            await sql.connect(infoCenterDBConfig);  
        
            // Create a new request object
            const request = new sql.Request();

            // Query the database for user credentials
            const result = await request
                .input('input_parameter1', sql.VarChar, email)
                .input('input_parameter2', sql.VarChar, name)
                .input('input_parameter3', sql.VarChar, id)
                .input('input_parameter4', sql.VarChar, existingId)
                .query(`UPDATE Users SET Email=@input_parameter1, FullName=@input_parameter2, 
                        StaffId=@input_parameter3 WHERE StaffId=@input_parameter4`)
            
            // Check that the data was inserted into the database.
            if (result.rowsAffected == 0){
                reject({type: "DBError", message: `Nothing was inserted into the database as the entered Staff ID already exists. Please verify you have entered the correct ID.`,
                table: "Users", action: "UPDATE", querySuccess: true});
            }

            // Return the recordset.
            resolve(result.recordset)
        }
        catch (error) {
            reject({type: "DBError", message: error.message, cause: error, table: "Users", action: "UPDATE"});  
        }
    })
}

// Creates template object for new staff entry
export function generateNewStaffData(name, id, workshop, position, officePhone, email, team) {

    return {
        hospital: workshop,
        position: position,
        id: id,
        name: name,
        officePhone: officePhone,
        dectPhone: "",
        workMobile: "",
        personalMobile: "",
        team: team,
        email: email,
        hostname: "",
      }
}

// Get a staff member entry based on name 
export function getEmployee(staffArray, name) {
    return staffArray.find((entry) => {
        return entry.name = name;
    })
}

// Checks if DB fields have been changed
export function hasDBFieldsChanged(name, id, email, currentData) {
    if (name === currentData.email && id === currentData.id && email === currentData.email) {
        return false;
    }
    return true;
}