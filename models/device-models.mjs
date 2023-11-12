import fs from 'fs';
import path from 'path';

export function getAllDeviceData(__dirname) {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, 'data', 'device-data.json'), (err, data) => {
            if (err) {
                reject(`The Device data was unable to be read: ${err.message}`);
            }
            else {
                try {
                    const deviceData = JSON.parse(data);
                    resolve(deviceData);
                }
                catch(err) {
                    reject(`The Device data was unable to be parsed: ${err.message}`)
                }
            }
        });
    })
}

export function writeAllDeviceData(__dirname, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path.join(__dirname, 'data', 'device-data.json'), data, (err) => {
            if (err) {
                reject(`The error occurred while writing the Device data: ${err}`);
            } 
            console.log('The file has been saved!');
            resolve("Success");
        });
    });
}

export function deleteDocumentFile(__dirname, filepath) {
    return new Promise((resolve, reject) => {
        fs.unlink(path.join(__dirname, "public2", filepath), (err) => {
            if (err) {
                reject({message: err.message, action: "delete", route: "Device"});
            } else {
                resolve("Success");
            }
        });
    })
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