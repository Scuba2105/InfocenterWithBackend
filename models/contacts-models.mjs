import fs from 'fs';
import path from 'path';

export function getAllStaffContactsData(__dirname) {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, 'data', 'staff-contacts.json'), (err, data) => {
            if (err) {
                reject({type: "FileHandlingError", message: err.message, cause: err, action: "read", route: "Staff Contacts"});
            }
            else {
                try {
                    const staffContactsData = JSON.parse(data);
                    resolve(staffContactsData);
                }
                catch(err) {
                    reject({type: "ParsingError", message: err.message, cause: err, route: "Staff Contacts"})
                }
            }
        });
    })
}

export function getAllVendorContactsData(__dirname) {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, 'data', 'vendor-contacts.json'), (err, data) => {
            if (err) {
                reject({type: "FileHandlingError", message: err.message, cause: err, action: "read", route: "Vendor Contacts"});
            }
            else {
                try {
                    const vendorData = JSON.parse(data);
                    resolve(vendorData);
                }
                catch(err) {
                    reject({type: "ParsingError", message: err.message, cause: err, route: "Vendor Contacts"})
                }
            }
        });
    })
}

export function writeAllStaffContactsData(__dirname, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path.join(__dirname, 'data', 'staff-contacts.json'), data, (err) => {
            if (err) {
                reject({type: "FileHandlingError", message: err.message, cause: err, action: "write", route: "Staff Contacts"});
            } 
            resolve("Success");
        });
    });
}

export function writeAllVendorContactsData(__dirname, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path.join(__dirname, 'data', 'vendor-contacts.json'), data, (err) => {
            if (err) {
                reject({type: "FileHandlingError", message: err.message, cause: err, action: "write", route: "Vendor Contacts"});
            } 
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