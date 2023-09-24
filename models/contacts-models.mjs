import fs from 'fs';
import path from 'path';

export function getAllStaffContactsData(__dirname) {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, 'data', 'staff-contacts.json'), (err, data) => {
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

export function getAllVendorContactsData(__dirname) {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, 'data', 'vendor-contacts.json'), (err, data) => {
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

export function writeAllStaffContactsData(__dirname, data) {
    fs.writeFile(path.join(__dirname, 'data', 'staff-contacts.json'), data, (err) => {
        if (err) {
            throw err;
        }
        console.log('The file has been saved!');
    });
}

export function writeAllVendorContactsData(__dirname, data) {
    fs.writeFile(path.join(__dirname, 'data', 'vendor-contacts.json'), data, (err) => {
        if (err) {
            throw err;
        }
        console.log('The file has been saved!');
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