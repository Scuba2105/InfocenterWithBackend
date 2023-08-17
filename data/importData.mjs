import fs from 'fs';
import path from 'path'
import { generateEmailAddress } from "../utils/utils.mjs"

const __dirname = path.dirname(".");

async function getStaffInfo() {
    const staffData = fs.readFileSync("C:/Users/officeworks/Documents/Web Development/React Tutorial/technical_information_app/InfocenterWithBackend/data/staff-data.json");
    const staffInfo = JSON.parse(staffData)
    
    const names = staffInfo.map((entry) => {
        return {name: entry.name, email: generateEmailAddress(entry.name)}
    })
    fs.writeFileSync('./testData.json', JSON.stringify(names, null, 2));
}  

getStaffInfo()

