import fs from 'fs';
import path from 'path';

export function getRequestsData(__dirname) {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, 'data', 'requests-data.json'), (err, data) => {
            if (err) {
                reject({type: "FileHandlingError", message: err.message, cause: err, action: "read", route: "Requests"});
            }
            else {
                try {
                    const requestsData = JSON.parse(data);
                    resolve(requestsData);
                }
                catch(err) {
                    reject({type: "ParsingError", message: err.message, cause: err, route: "Requests"})
                }
            }
        });
    })
}

export function writeRequestsData(__dirname, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path.join(__dirname, 'data', 'requests-data.json'), data, (err) => {
            if (err) {
                reject({type: "FileHandlingError", message: err.message, cause: err, action: "write", route: "Requests"});
            } 
            resolve("Success");
        });
    });
}

export function moveRequestFile(__dirname, currentFilePath, newFilePath) {
    return new Promise((resolve, reject) => {
        console.log(currentFilePath, newFilePath)
        fs.rename(currentFilePath, newFilePath, (err) => {
            if (err) {
                reject({type: "FileHandlingError", message: err.message, cause: err, action: "rename", route: "Requests"});
            } 
            resolve("Success");
        })
    })
}

export function deleteConfigFile(__dirname, filepath) {
    return new Promise((resolve, reject) => {
        fs.unlink(path.join(__dirname, "public", filepath), (err) => {
            if (err) {
                reject({type: "FileHandlingError", message: err.message, cause: err, action: "delete", route: "Requests"});
            } else {
                resolve("Success");
            }
        });
    })
}