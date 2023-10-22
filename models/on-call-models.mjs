import fs from 'fs';
import path from 'path';

export function getOnCallData(__dirname) {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, 'data', 'on-call-data.json'), (err, data) => {
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

export function writeOnCallData(__dirname, data) {
    fs.writeFile(path.join(__dirname, 'data', 'on-call-data.json'), data, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
}