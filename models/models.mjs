import sql from "mssql";
import { localDBConfig } from "../config.mjs";
import { localEMSConfig } from "../config.mjs";
import { determineTeam } from "../utils/utils.mjs";

const database = "local";

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
      await sql.connect(localDBConfig);  
      
      // Create a new request object
      const request = new sql.Request()
      
      // declare result variable
      let result;

      // make sure that any items are correctly URL encoded in the connection string
      if (length === 1) {
        if (database === "EMS")  
            result = await request.query(`SELECT BMENO, Serial_No, BRAND_NAME FROM tblEquipment WHERE BMENO = ${parameter}`);
        else (database === "local")
            result = await request.query(`SELECT BMENO, Serial_No FROM Equipment WHERE BMENO = ${parameter}`);
      } 
      else {
        if (database === "EMS")  
            result = await request.query(`SELECT BMENO, Serial_No, BRAND_NAME FROM tblEquipment WHERE BMENO IN ${parameter}`);
        else (database === "local")
            result = await request.query(`SELECT BMENO, Serial_No FROM Equipment WHERE BMENO IN ${parameter}`);
      }

      // Need to close connection
      console.log(result);
      return result.recordset;
  } 
  catch (error) {
    console.log(error);
    throw new Error(`An error occurred querying the database :- ${error.message}`);
  }
}

// const array = ["37646", "57565", "45742", "55406", "53729", "37746", "54024", "51784", "47767"];
// const lastIndex = array.length - 1;
// const queryParameter = array.map((bme, index) => {
//   return index === 0 ? `(${bme}` : index === lastIndex ? `${bme})` : `${bme}`
// }).join(",");


