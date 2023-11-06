import fs from 'fs';
import path from 'path';

export function getOnCallData(__dirname) {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, 'data', 'on-call-data.json'), (err, data) => {
            if (err) {
                console.error(err);
                reject(`The On-Call data was unable to be read: ${err.message}`);
            }
            else {
                try {
                    const onCallData = JSON.parse(data);
                    resolve(onCallData);
                }
                catch(err) {
                    reject(`The On-Call data was unable to be parsed: ${err.message}`)
                }
            }
        });
    })
}

export function writeOnCallData(__dirname, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path.join(__dirname, 'data', 'on-call-data.json'), data, (err) => {
            if (err) {
                reject(`The error occurred while writing the On-Call data: ${err}`);
            } 
            console.log('The file has been saved!');
            resolve("Success");
        });
    });
}

export function removeStaleEntries(data, cutOffWindowWeeks) {
    const currentDate = new Date();
    const cutOffTime = currentDate.getTime() - cutOffWindowWeeks * (7*24*60*60*1000);
    const filteredEditData = data.rosterEdits.filter((entry) => {
        return entry.endDate >= cutOffTime
    });
    const filteredConfirmationData = data.rosterConfirmation.filter((entry) => {
        return entry.endDate >= cutOffTime
    });
    return {rosterEdits: filteredEditData, rosterConfirmation: filteredConfirmationData};
}