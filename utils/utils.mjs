import fs, { writeFile } from 'fs';
import path from 'path';

export function readAllData(__dirname) {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, 'data', 'data.json'), (err, data) => {
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

export function readDeviceData(__dirname) {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, 'data', 'data.json'), (err, data) => {
            if (err) {
                reject(`The data was unable to be read: ${err.message}`);
            }
            else {
                resolve(JSON.parse(data).deviceData);
            }
        });
    })
}

export function writeDataToFile(__dirname, data) {
    fs.writeFile(path.join(__dirname, 'data', 'data.json'), data, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
      });
}

export function createDirectory(dirPath) {
    try {
        fs.mkdirSync(dirPath,{ recursive: true })
    } catch (error) {  
    }
}

export function convertHospitalName(hospitalName) {
    const hospitalArray = hospitalName.split(' ');
    const hospital = hospitalArray.slice(0, -1).join(' ').toLowerCase();
    const hospitalDirectory = hospital == "john hunter" ? "jhh" : hospital === "royal newcastle" ? "rnc" : hospital;
    return hospitalDirectory;
}

export function capitaliseFirstLetters(input) {
    const words = input.split(' ');
    const formattedWords = words.map((word) => {
        return word === 'MPS' ? word : word[0].toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
    return formattedWords
}

export function generateNewDeviceData(fileExt, newType, manufacturer, newModel) {

    return {
        img: fileExt,
        type: newType,
        manufacturer: manufacturer,
        model: newModel,
        serviceManual: false,
        userManual: false,
        config: "",
        software: "",
        documents: "",
        placeholder2: ""
    }
}

export function generateNewStaffData(name, id, workshop, position, officePhone, team) {

    return {
        hospital: workshop,
        position: position,
        id: id,
        name: name,
        officePhone: officePhone,
        dectPhone: "",
        workMobile: "",
        personalMobile: "",
        team: team
      }
}

export function determineTeam(position, workshop) {
    
    // Define Management positions and Tamworth locations
    const managementPositions = ["Director", "Deputy Director", "Biomedical Engineer", "Service Co-ordinator"]
    const newEngland = ["Tamworth Hospital", "New England"];
    
    const team = managementPositions.includes(position) ? "Management" : 
                workshop === "John Hunter Hospital" ? "JHH" :
                workshop === "Royal Newcastle Centre" ? "JHH" :
                workshop === "Mechanical/Anaesthetics" ? "Mechanical" :
                newEngland.includes(workshop) ? "Tamworth" :
                "Hunter";

    return team;
}