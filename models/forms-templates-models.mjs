import fs from 'fs';
import path from 'path';

export function getAllFormsTemplatesData(__dirname) {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, 'data', 'forms-template-data.json'), (err, data) => {
            if (err) {
                reject({type: "FileHandlingError", message: err.message, cause: err, action: "read", route: "Forms-Templates"});
            }
            else {
                try {
                    const formsTemplatesData = JSON.parse(data);
                    resolve(formsTemplatesData);
                }
                catch(err) {
                    reject({type: "ParsingError", message: err.message, cause: err, route: "Forms-Templates"})
                }
            }
        });
    })
}

export function getUserFormsTemplatesData(__dirname, userId) {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, 'data', 'forms-template-data.json'), (err, data) => {
            if (err) {
                reject({type: "FileHandlingError", message: err.message, cause: err, action: "read", route: "Forms-Templates"});
            }
            else {
                try {
                    const formsTemplatesData = JSON.parse(data);
                    const userFormsTemplatesData = formsTemplatesData.find((entry) => {
                        return entry.staffId === userId;
                    }) 
                    resolve(userFormsTemplatesData);
                }
                catch(err) {
                    reject({type: "ParsingError", message: err.message, cause: err, route: "Forms-Templates"})
                }
            }
        });
    })
}

export function writeAllFormTemplateData(__dirname, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path.join(__dirname, 'data', 'forms-template-data.json'), data, (err) => {
            if (err) {
                reject({type: "FileHandlingError", message: err.message, cause: err, action: "read", route: "Device"});
            } 
            resolve("Success");
        });
    });
}