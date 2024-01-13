import fs from 'fs';
import path from 'path';
import { createDirectory } from '../utils/utils.mjs';

// Request property lookups
const requestLookups = {"Service Manual": "serviceManual", "User Manual": "userManual", "Configurations": "config", "Software": "software", "Documents": "documents", "Passwords": "passwords"};

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
            console.log(err)
            if (err) {
                reject({type: "FileHandlingError", message: err.message, cause: err, action: "write", route: "Requests"});
            } 
            resolve("Success");
        });
    });
}

export function moveRequestFile(__dirname, fileTypeDirectory, currentFilePath, newFilePath) {
    return new Promise((resolve, reject) => {
        createDirectory(path.join(__dirname, `public/${fileTypeDirectory}`));
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

export function removeRequestEntry(allRequestsData, requestData) {
    // Get the current request model request data.
    const modelRequestsData = allRequestsData.find((entry) => entry.model === requestData.model);
    
    // Get the data for the current request.
    const modelTypeRequestData = modelRequestsData[requestLookups[requestData.requestType]];

    // Remove the current request data as it has been approved. 
    const updatedModelTypeRequestData = modelTypeRequestData.reduce((acc, curr) => {
        console.log(curr, requestData)
        if (curr.requestor !== requestData.requestor && curr.timestamp !== requestData.timestamp) {
            acc.push(curr);
        }
        return acc;
    }, []);

    // Update (mutate) the model request data variable
    modelRequestsData[requestLookups[requestData.requestType]] = updatedModelTypeRequestData;
        
    // Update (mutate) the all requests data array
    const updatedAllRequestsData = allRequestsData.map((entry) => {
        if (entry.model === requestData.model) {
            return modelRequestsData;
        }
        return entry;
    })

    return updatedAllRequestsData;
}

