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
            if (err) {
                reject({type: "FileHandlingError", message: err.message, cause: err, action: "write", route: "Requests"});
            } 
            resolve("Success");
        });
    });
}

export function moveRequestFile(__dirname, fileTypeDirectory, currentFilePath, newFilePath) {
    return new Promise((resolve, reject) => {
        createDirectory(path.join(__dirname, "public", fileTypeDirectory));
        fs.rename(currentFilePath, newFilePath, (err) => {
            if (err) {
                reject({type: "FileHandlingError", message: err.message, cause: err, action: "rename", route: "Requests"});
            } 
            resolve("Success");
        })
    })
}

export function deleteFile(__dirname, filepath) {
    return new Promise((resolve, reject) => {
        fs.unlink(path.join(__dirname, `public${filepath}`), (err) => {
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
        if (curr.requestor !== requestData.requestor && curr.timestamp !== requestData.timestamp) {
            acc.push(curr);
        }
        return acc;
    }, []);

    // Delete the resource type key if the array is now empty.
    if (updatedModelTypeRequestData.length === 0) {
        delete modelRequestsData[requestLookups[requestData.requestType]]
    }
    else {
        // Update (mutate) the model request data variable.
        modelRequestsData[requestLookups[requestData.requestType]] = updatedModelTypeRequestData;
    }   
        
    // Update (mutate) the all requests data array and remove any entry models with no current requests.
    const updatedAllRequestsData = allRequestsData.reduce((acc, curr) => {
        if (curr.model === requestData.model) {
            const keyNo = Object.keys(curr).length;
            if (keyNo > 2) {
                acc.push(modelRequestsData)
            }
        }
        else {
            acc.push(curr);
        }
        return acc;
    }, [])

    return updatedAllRequestsData;
}

