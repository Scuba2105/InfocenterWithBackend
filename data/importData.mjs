import fs from 'fs';
import path from 'path'
import { generateEmailAddress } from "../utils/utils.mjs"

const __dirname = path.dirname(".");

async function getConfigDevices() {
    const staffData = fs.readFileSync("C:/Users/60146774/Web Development/Information Centre With Backend/InfocenterWithBackend/data/device-data.json");
    const deviceInfo = JSON.parse(staffData)
    
    const devices = deviceInfo.filter((entry) => {
        return entry.config !== "";
    }).map(entry => entry.model);
    
    console.log(devices)
    //fs.writeFileSync('./testData.json', JSON.stringify(staffInfo, null, 2));
}  

getConfigDevices()

