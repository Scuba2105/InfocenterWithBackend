import fs, { readFile, writeFile } from 'fs';
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
        fs.readFile(path.join(__dirname, 'data', 'device-data.json'), (err, data) => {
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

export function readContactsData(__dirname) {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, 'data', 'staff-contacts.json'), (err, data) => {
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

export function readVendorContactsData(__dirname) {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, 'data', 'vendor-contacts.json'), (err, data) => {
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

export function readStaffData(__dirname) {
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

export function writeStaffData(__dirname, data) {
    fs.writeFile(path.join(__dirname, 'data', 'staff-data.json'), data, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
}

export function writeDeviceData(__dirname, data) {
    fs.writeFile(path.join(__dirname, 'data', 'device-data.json'), data, (err) => {
        if (err) {
            throw err;
        }
        console.log('The file has been saved!');
    });
}

export function readThermometerData(__dirname) {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, 'data', 'thermometers.json'), (err, data) => {
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

export function writeThermometerData(__dirname, data) {
    fs.writeFile(path.join(__dirname, 'data', 'thermometers.json'), data, (err) => {
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

export function generateNewDeviceData(fileExt, newType, manufacturer, vendor, newModel) {

    return {
        img: fileExt,
        type: newType,
        manufacturer: manufacturer,
        vendor: vendor,
        model: newModel,
        serviceManual: false,
        userManual: false,
        config: "",
        software: "",
        documents: "",
        passwords: ""
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
        team: team,
        hostname: "",
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

export function generateEmailAddress(name) {
    const emailAddress = name === "Azmi Refal" ? `Mohamed${name.replace(' ', '.Mohamed')}@health.nsw.gov.au` : `${name.replace(' ', '.').replace(' ', '')}@health.nsw.gov.au`;
    return emailAddress;
}

export function isValidBME(bme) {
    const firstNumber = bme[0];
    const otherNumbers = bme.split("").slice(1).join("");
    if (bme.length === 5 && !isNaN(bme)) {
        return true;
    }
    else if ((firstNumber === "E" || firstNumber === "e") && !isNaN(otherNumbers)) {
        return true;
    }
    else {
        return false;
    }
}

export const brandOptions = ['Genius 3', 'GENIUS 3', '303013'];

export function getReducedName(name) {
    const reducedName = name.split(" ").map((entry, index) => {
        if (index == 0) {
            return entry.split("")[0];
        }
        else {
            return entry;
        }
    }).join(" ")

    return reducedName;
}

export function readTickImage(path) {
    const imageData = fs.readFileSync(path);
    return imageData;
}