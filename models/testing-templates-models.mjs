import fs from 'fs';
import path from 'path';

export function getAllTestingTemplateData(__dirname) {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, 'data', 'testing-progress-data.json'), (err, data) => {
            if (err) {
                reject({type: "FileHandlingError", message: err.message, cause: err, action: "read", route: "Testing Templates"});
            }
            else {
                try {
                    const testingTemplateData = JSON.parse(data);
                    resolve(testingTemplateData);
                }
                catch(err) {
                    reject({type: "ParsingError", message: err.message, cause: err, route: "Testing Templates"})
                }
            }
        });
    })
}

export function writeAllTestingTemplateData(__dirname, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path.join(__dirname, 'data', 'testing-progress-data.json'), data, (err) => {
            if (err) {
                reject({type: "FileHandlingError", message: err.message, cause: err, action: "read", route: "Templates"});
            } 
            resolve("Success");
        });
    });
}