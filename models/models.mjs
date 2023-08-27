import sql from "mssql";
import { infoCenterDBConfig } from "../config.mjs";
import { localEMSConfig } from "../config.mjs";
import { determineTeam } from "../utils/utils.mjs";

const staffObjectPropLookup = {"name": "name", "id": "id", "hospital": "hospital", "position": "position", 
"office-phone": "officePhone", "dect-phone": "dectPhone", "work-mobile": "workMobile", 
"personal-mobile": "personalMobile", "extension": "img"};

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

// Get a staff member entry based on 
export function getEmployee(staffArray, name) {
    return staffArray.find((entry) => {
        return entry.name = name;
    })
}

// Get the Genius3 Serial Numbers from the BME list input
export async function getGenius3Serial(parameter, length) {
  try {

      // Need to validate the parameter input
      // Connect to the database
      await sql.connect(localEMSConfig);  
      //await sql.connect(localDBConfig);
      
      // Create a new request object
      const request = new sql.Request()
      
      // declare result variable
      let result;

      // make sure that any items are correctly URL encoded in the connection string
      if (length === 1) {
            result = await request.query(`SELECT BMENO, Serial_No, BRAND_NAME FROM tblEquipment WHERE BMENO = ${parameter}`);
            //result = await request.query(`SELECT BMENO, Serial_No FROM Equipment WHERE BMENO = ${parameter}`);
      } 
      else {
            result = await request.query(`SELECT BMENO, Serial_No, BRAND_NAME FROM tblEquipment WHERE BMENO IN ${parameter}`);
            //result = await request.query(`SELECT BMENO, Serial_No FROM Equipment WHERE BMENO IN ${parameter}`);
      }

      // Need to close connection
      return result.recordset;
  } 
  catch (error) {
    console.log(error);
    throw new Error(`An error occurred querying the database :- ${error.message}`);
  }
}

export async function disposeGenius3(parameter) {
    try {
  
        // Need to validate the parameter input
        // Connect to the database
        await sql.connect(localEMSConfig);  
        //await sql.connect(localDBConfig);
        
        // Create a new request object
        const request = new sql.Request()
        
        // declare result variable
        const result = await request
            .input('bmeString', parameter)
            .execute(`sp_SCB_ThermometerBulkDisposal`);        
  
        // Need to close connection
        return result.recordset;
    } 
    catch (error) {
      console.log(error);
      throw new Error(`An error occurred querying the database :- ${error.message}`);
    }
  }

  export async function getSerialNumbers(parameter, length) {
    try {
  
        // Need to validate the parameter input
        // Connect to the database
        await sql.connect(localEMSConfig);  
        //await sql.connect(localDBConfig);
        
        // Create a new request object
        const request = new sql.Request()
        
        // declare result variable
        let result;

        // make sure that any items are correctly URL encoded in the connection string
        if (length === 1) {
            result = await request.query(`SELECT BMENO, Serial_No, BRAND_NAME FROM tblEquipment WHERE BMENO = ${parameter}`);
            //result = await request.query(`SELECT BMENO, Serial_No FROM Equipment WHERE BMENO = ${parameter}`);
        } 
        else {
            result = await request.query(`SELECT BMENO, Serial_No, BRAND_NAME FROM tblEquipment WHERE BMENO IN ${parameter}`);
            //result = await request.query(`SELECT BMENO, Serial_No FROM Equipment WHERE BMENO IN ${parameter}`);
        }

        // Need to close connection
        return result.recordset;
    }
    catch (err) {
        console.log(err);
        throw new Error (err.message);
    }
}

export async function retrieveUserCredentials(email) {
        try {
            // Connect to the database
            await sql.connect(infoCenterDBConfig);  
        
            // Create a new request object
            const request = new sql.Request();

            // Query the database for user credentials
            const result = await request
                .input('input_parameter', sql.VarChar, email)
                .query(`SELECT * FROM Users WHERE Email = @input_parameter OR StaffID = @input_parameter`);

            // Return the recordset
            return result.recordset
        }
        catch (error) {
            console.log(error);
            throw error;
        }
}

export async function updateUserPassword(staffId, hashedPassword) {
    try {
        // Connect to the database
        await sql.connect(infoCenterDBConfig);  
        
        // Create a new request object
        const request = new sql.Request();

        // Query the database for user credentials
        const result = await request
            .input('input_parameter1', sql.VarChar, staffId)
            .input('input_parameter2', sql.VarChar, hashedPassword)
            .query(`UPDATE Users SET Password = @input_parameter2 WHERE StaffID = @input_parameter1`);
        if (result.rowsAffected == 0){
            throw 'Nothing was inserted into the database!';
        }
        // Return the recordset
        return result.recordset
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}



