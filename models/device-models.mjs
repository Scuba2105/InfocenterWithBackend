import fs from 'fs';
import path from 'path';

export function getAllDeviceData(__dirname) {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, 'data', 'device-data.json'), (err, data) => {
            if (err) {
                reject({type: "FileHandlingError", message: err.message, cause: err, action: "read", route: "Device"});
            }
            else {
                try {
                    const deviceData = JSON.parse(data);
                    resolve(deviceData);
                }
                catch(err) {
                    reject({type: "ParsingError", message: err.message, cause: err, route: "Device"})
                }
            }
        });
    })
}

export function writeAllDeviceData(__dirname, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path.join(__dirname, 'data', 'device-data.json'), data, (err) => {
            if (err) {
                reject({type: "FileHandlingError", message: err.message, cause: err, action: "read", route: "Device"});
            } 
            resolve("Success");
        });
    });
}

export function deleteFile(__dirname, filepath) {
    return new Promise((resolve, reject) => {
        fs.unlink(path.join(__dirname, "public", filepath), (err) => {
            if (err) {
                reject({type: "FileHandlingError", message: err.message, cause: err, action: "delete", route: "Device"});
            } else {
                resolve("Success");
            }
        });
    })
}

export function renameFile(originalFilename, newFilename) {
    return new Promise((resolve, reject) => {
        fs.rename(originalFilename, newFilename, (err) => { 
            if (err) {
                reject({type: "FileHandlingError", message: err.message, cause: err, action: "rename", route: "Device"});
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