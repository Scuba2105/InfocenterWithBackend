import fs from 'fs';
import path from 'path';

export function getAllStaffContactsData(__dirname) {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, 'data', 'staff-contacts.json'), (err, data) => {
            if (err) {
                reject(`The Staff Contacts data was unable to be read: ${err.message}`);
            }
            else {
                try {
                    const staffContactsData = JSON.parse(data);
                    resolve(staffContactsData);
                }
                catch(err) {
                    reject(`The Staff Contacts data was unable to be parsed: ${err.message}`)
                }
            }
        });
    })
}

export function getAllVendorContactsData(__dirname) {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, 'data', 'vendor-contacts.json'), (err, data) => {
            if (err) {
                reject(`The Vendor Contacts data was unable to be read: ${err.message}`);
            }
            else {
                try {
                    const vendorData = JSON.parse(data);
                    resolve(vendorData);
                }
                catch(err) {
                    reject(`The Vendor Contacts data was unable to be parsed: ${err.message}`)
                }
            }
        });
    })
}

export function writeAllStaffContactsData(__dirname, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path.join(__dirname, 'data', 'staff-contacts.json'), data, (err) => {
            if (err) {
                reject(`The error occurred while writing the Staff Contacts data: ${err}`);
            } 
            console.log('The file has been saved!');
            resolve("Success");
        });
    });
}

export function writeAllVendorContactsData(__dirname, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path.join(__dirname, 'data', 'vendor-contacts.json'), data, (err) => {
            if (err) {
                reject(`The error occurred while writing the Vendor Contacts data: ${err}`);
            } 
            console.log('The file has been saved!');
            resolve("Success");
        });
    });
}

export function generateNewStaffContactData(reqBody) {
    return {
        contact: reqBody["Contact Name"],
        hospital: reqBody["Hospital"],
        department: reqBody["Department"],
        position: reqBody["Contact Position"],
        officePhone: "",
        mobilePhone: "",
        dectPhone: "",
        lastUpdate: reqBody["Current Date"]
    }
}

export function generateNewVendorContactData(reqBody) {
    return {
        vendor: reqBody["Vendor"],
        contact: reqBody["Contact Name"],
        position: reqBody["Contact Position"],
        officePhone: "",
        mobilePhone: "",
        email: "",
        lastUpdate: reqBody["Current Date"]
    }
}