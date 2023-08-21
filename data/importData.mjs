import fs from 'fs';
import path from 'path'
import { generateEmailAddress } from "../utils/utils.mjs"

const __dirname = path.dirname(".");

async function getStaffInfo() {
    const staffData = fs.readFileSync("C:/Users/60146774/Web Development/Information Centre With Backend/InfocenterWithBackend/data/staff-data.json");
    const staffInfo = JSON.parse(staffData)
    
    const staffIds = staffInfo.map((entry) => {
        return {id: entry.id, email: generateEmailAddress(entry.name)}
    })
    fs.writeFileSync('./testData.json', JSON.stringify(staffIds, null, 2));
}  

getStaffInfo()

