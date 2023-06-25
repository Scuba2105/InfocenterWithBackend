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