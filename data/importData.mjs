import fs from 'fs';
import path from 'path'
import { generateEmailAddress } from "../utils/utils.mjs"

const __dirname = path.dirname(".");

const hostnames = [
    {'Atif Siddiqui': 'JHHBME838'},
    {'Azmi Refal': 'TAMBME805'},
    {'Brett Pryor': 'TAMBME806'},
    {'Durga Sompalle': 'JHHBME835'},
    {'Dat Tien': 'Phung	JHHBME808'},
    {'Ellen Heydon': 'JHHBME824'},
    {'Glady Gideon': 'JHHBME830'},
    {'Ishaque Khan': 'JHHBME804'},
    {'John Larkworthy': 'TAMBME800'},
    {'Keith Ball': 'JHHBME828'},
    {'Leigh Ryan': 'JHHBME836'},
    {'Michael Dathan': 'JHHBME800'},
    {'Michelle Ison': 'JHHBME822'},
    {'Mitchell Pacey': 'JHHBME827'},
    {'Matthew Law': 'CMNBME800'},
    {'Matthew Murrell': 'JHHBME809'},
    {'Mitchell Pyne': 'JHHBME826'},
    {'Pedram Bidar': 'TAMBME807'},
    {'Paul Cookson': 'JHHBME810'},
    {'Patrick Small': 'JHHBME832'},
    {'Ray Aunei': 'Mose	JHHBME829'},
    {'Rodney Birt': 'JHHBME806'},
    {'Steven Bradbury': 'JHHBME825'},
    {'Troy Traeger': 'JHHBME833'},
    {'Tome Tomev': 'JHHBME837'},
    {'Wayne Fuller': 'JHHBME831'},
    {'Kendo Wu': 'JHHBME808'},
]

async function getStaffInfo() {
    const staffData = fs.readFileSync("C:/Users/60146774/Web Development/Information Centre With Backend/InfocenterWithBackend/data/staff-data.json");
    const staffInfo = JSON.parse(staffData)
    
    staffInfo.forEach((element) => {
        if (!['Tea Room','Triage','New Maitland Storage','New Maitland Workshop','ICU Workshop','B.E.E.R.','Biomed Powerfail','Armidale BME'].includes(element.name)) {
            console.log(element.name)
            element.hostname = hostnames[element.name];
        }        
    })
    fs.writeFileSync('./testData.json', JSON.stringify(staffInfo, null, 2));
}  

getStaffInfo()

