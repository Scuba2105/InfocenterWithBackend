import fs from 'fs';
import path from 'path'
import { generateEmailAddress } from "../utils/utils.mjs"

const __dirname = path.dirname(".");

async function getConfigDevices() {
    const staffContactData = fs.readFileSync("C:/Users/officeworks/Documents/Web Development/React Tutorial/technical_information_app/InfocenterWithBackend/data/vendor-contacts.json");
    const staffContacts = JSON.parse(staffContactData)
    
    staffContacts.forEach((entry) => {
        entry.lastUpdate = "14/09/2023"
    });
    
    console.log(staffContacts);
    fs.writeFileSync('./testData.json', JSON.stringify(staffContacts, null, 2));
}  

getConfigDevices()

