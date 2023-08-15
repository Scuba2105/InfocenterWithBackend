import fs from 'fs';
import path from 'path'
import { generateEmailAddress } from "../utils/utils.mjs"


async function getStaffInfo() {
    const staffData = fs.readFileSync('C:/Users/60146774/Web Development/Information Centre With Backend/InfocenterWithBackend/data/staff-data.json');
    const staffInfo = JSON.parse(staffData)
    
    const names = staffInfo.map((entry) => {
        return {name: entry.name, email: generateEmailAddress(entry.name)}
    })
    fs.writeFileSync('./testData.json', JSON.stringify(names, null, 2));
}  

getStaffInfo()

