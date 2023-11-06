import fs from 'fs';
import path from 'path';

export function getAllDeviceData(__dirname) {
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

export function writeAllDeviceData(__dirname, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path.join(__dirname, 'data', 'device-data.json'), data, (err) => {
            if (err) {
                throw new Error(`The error occurred while writing the Device data: ${err}`);
            } 
            console.log('The file has been saved!');
            resolve("Success");
        });
    });
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