import sql from "mssql";
import { infoCenterDBConfig } from "../config.mjs";
import fs from 'fs';
import path from 'path';
import { determineTeam } from '../utils/utils.mjs';
import { hash } from "bcrypt";

// Property lookup translates request data keys to backend keys
const staffObjectPropLookup = {"name": "name", "id": "id", "hospital": "hospital", "position": "position", 
"office-phone": "officePhone", "dect-phone": "dectPhone", "work-mobile": "workMobile", 
"personal-mobile": "personalMobile", "hostname": "hostname",  "extension": "img"};

export function getAllStaffData(__dirname) {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, 'data', 'staff-data.json'), (err, data) => {
            if (err) {
                console.error(err);
                reject(`The data was unable to be read: ${err.message}`);
            }
            else {
                resolve(JSON.parse(data));
            }
        });
    })
}

export function writeAllStaffData(__dirname, data) {
    fs.writeFile(path.join(__dirname, 'data', 'staff-data.json'), data, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
}

export function updateStaffEntry(req, currentData) {
    for (const [key, value] of Object.entries(req.body)) {
        if (value !== currentData.id) {
            // Get the staff object property corresponding to the form data name.
            const prop = staffObjectPropLookup[key];

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

        // Return the recordset
        return result.recordset
    }
    catch (error) {
        console.log(error);
        throw error;
    }
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