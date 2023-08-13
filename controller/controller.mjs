import { Mutex } from 'async-mutex';
import {readDeviceData, readStaffData, writeDeviceData, writeStaffData, generateNewDeviceData, writeThermometerData, readThermometerData, generateNewStaffData, determineTeam } from '../utils/utils.mjs';
import { updateStaffEntry } from '../models/models.mjs';
import { populateGenius3RequestTemplate } from '../file-handling/repair-request.mjs';
import { getGenius3Serial, disposeGenius3 } from '../models/models.mjs';
import { isValidBME, brandOptions } from '../utils/utils.mjs';

// Define the mutex objects for both staff and device files.
// Assists with preventing race conditions. 
const staffDataMutex = new Mutex();
const deviceDataMutex = new Mutex();

export async function getAllData(req, res, __dirname) {
    try {
        const staffData = await readStaffData(__dirname);
        const deviceData = await readDeviceData(__dirname);
        const allData = {staffData: staffData, deviceData: deviceData};
        res.json(allData);
    }
    catch(error) {
        console.log(error);
    }
}

export async function updateExistingDeviceData(req, res, __dirname) {
    try {
        deviceDataMutex.runExclusive(async () => {
            const deviceData = await readDeviceData(__dirname);
            
            // Define the variables from the uploaded data
            const model = req.body.model;
            const manufacturer = req.body.manufacturer;
            let hospital, configPath;
            const documentKeys = Object.keys(req.body).filter((key) => {
                return /description[1-4]/.test(key);
            });
                
            // Retrieve the current data for the updated device
            const updatedDevice = deviceData.find((entry) => {
                return entry.model === model && entry.manufacturer === manufacturer;
            })
            
            // Update the device details if corresponding key exists in form data
            if (Object.keys(req.files).includes('service-manual')) {
                updatedDevice.serviceManual = true;
            }

            if (Object.keys(req.files).includes('user-manual')) {
                updatedDevice.userManual = true;
            }
            
            if (Object.keys(req.files).includes('configs')) {
                const hospital = req.body.hospital;
                const hospitalDirectory = convertHospitalName(hospital);
                const configPath = `/configurations/${hospitalDirectory}/${model}/${req.files.configs[0].originalname}`
                if (Object.keys(updatedDevice.config).includes(hospital)) {
                    updatedDevice.config[hospital].push(configPath)
                } 
                else if (updatedDevice.config === "") {
                    updatedDevice.config = {};
                    updatedDevice.config[hospital] = [configPath];
                }
                else {
                    updatedDevice.config[hospital] = [configPath];
                }
            }

            if (Object.keys(req.body).includes('software')) {
                const softwareData = req.body.software;
                const softwareDataArray = softwareData.split('=');
                const softwareType = softwareDataArray[0];
                const softwareLocation = softwareDataArray[1];
                    
                if (typeof updatedDevice.software !== "object") {
                    updatedDevice.software = {[softwareType]: softwareLocation};
                }
                else {
                    updatedDevice.software[softwareType] = softwareLocation;
                }
            }
            
            if (documentKeys.length !== 0) {
                if (typeof updatedDevice.documents === 'string') {
                    const documentsInfo = [];
                    documentKeys.forEach((key, index) => {
                        const keyObjectDetails = {label: req.body[key], filePath: `/documents/${model}/${req.files[`file${index + 1}`][0].originalname}`} 
                        documentsInfo.push(keyObjectDetails);
                    });
                    updatedDevice.documents = documentsInfo;
                }
                else {
                    documentKeys.forEach((key, index) => {
                        const keyObjectDetails = {label: req.body[key], filePath: `/documents/${model}/${req.files[`file${index + 1}`][0].originalname}`} 
                        updatedDevice.documents.push(keyObjectDetails);
                    });
                }
            }

            // Replace the old device data in the DeviceData array with the new data that has been entered 
            const updatedDeviceData = deviceData.map((entry) => {
                if (entry.model === model && entry.manufacturer === manufacturer) {
                    return updatedDevice
                }
                else {
                    return entry;
                }
            })

            // Write the data to file
            await writeDeviceData(__dirname, JSON.stringify(updatedDeviceData, null, 2));

            // Send the success response message.
            res.json({type: "Success", message: 'Data Upload Successful'});
        })
    }
    catch (err) {
        // Send the error response message.
        res.json({type: "Error", message: `An error occurred while updating the data: ${err.message}.\r\n Please try again and if issue persists contact administrator`});
    }
}

export async function addNewDeviceData(req, res, __dirname) {
    try {
        deviceDataMutex.runExclusive(async () => {
            // Get the current device data 
            const deviceData = await readDeviceData(__dirname);
            
            // Get the new device data from the request object
            const newModel = req.body.model;
            const newType = req.body.type;
            const manufacturer = req.body.manufacturer;
            const fileExt = req.body.extension;
        
            // Create the new data for the added device 
            const newDevice  = generateNewDeviceData(fileExt, newType, manufacturer, newModel);
                            
            // Push the new device data to the current device data array 
            deviceData.push(newDevice);
                                        
            // Write the data to file
            writeDeviceData(__dirname, JSON.stringify(deviceData, null, 2));

            // Send the success response message.
            res.json({type: "Success", message: 'Data Upload Successful'});
        })
    }
    catch(err) {
        // Send the error response message.
        res.json({type: "Error", message: `An error occurred while updating the data: ${err.message}.\r\n Please try again and if issue persists contact administrator`});
    }
}

export async function addNewStaffData(req, res, __dirname) {
    try {
        staffDataMutex.runExclusive(async () => {
            // Get the current device data 
            const staffData = await readStaffData(__dirname);
            
            // Define the mandatory data in the request body
            const name = req.body.name;
            const id = req.body.id;
            const workshop = req.body.workshop;
            const position = req.body.position;
            const officePhone = req.body["office-phone"];
            const team = determineTeam(position, workshop);

            // Generate a new staff data object
            const newStaffData = generateNewStaffData(name, id, workshop, position, officePhone, team)   

            // Add any optional data provided to the data object
            const optionalData = {"dect-phone": "dectPhone", "work-mobile": "workMobile", "personal-mobile": "personalMobile",
            "extension": "img"};
            console.log(req.body);
            // Loop over optional data and add to data object
            Object.keys(optionalData).forEach((key) => {
                if (req.body[key]) {
                    newStaffData[optionalData[key]] = req.body[key];
                }
            });

            // Append the new staff data 
            staffData.push(newStaffData);

            // Write the data to file
            writeStaffData(__dirname, JSON.stringify(staffData, null, 2));

            // Send the success response message.
            res.json({type: "Success", message: 'Data Upload Successful'}); 
        })   
    } catch (err) {
        // Send the error response message.
        res.json({type: "Error", message: `An error occurred while updating the data: ${err.message}.\r\n Please try again and if issue persists contact administrator`});
    }
}

export async function updateExistingStaffData(req, res, __dirname) {
    try {
        staffDataMutex.runExclusive(async () => {
            // Get the current device data 
            const staffData = await readStaffData(__dirname);
        
            // Get the staff ID and find the existing employee data
            const existingId = req.body["existing-id"];
            const currentData = staffData.find((entry) => {
                return entry.id === existingId;
            });
                    
            // Update the data based on the key value pairs in the request body.
            const updatedEntry = updateStaffEntry(req, currentData);

            // Add the new entry to the staff array
            const updatedStaffData = staffData.map((entry) => {
                if (entry.id === existingId) {
                    return updatedEntry;
                }
                return entry;
            })

            // Write the data to file
            writeStaffData(__dirname, JSON.stringify(updatedStaffData, null, 2));

            // Send the success response message.
            res.json({type: "Success", message: 'Data Upload Successful'}); 
        })
    } catch (err) {
        // Send the error response message.
        res.json({type: "Error", message: `An error occurred while updating the data: ${err.message}.\r\n Please try again and if issue persists contact administrator`});
    }
    
}

export async function generateThermometerRepairRequest(req, res, __dirname) {
    try {
        const jsonData = JSON.stringify(req.body);
        const reqData = JSON.parse(jsonData);
        const name = reqData.name;
        const bmeNumbers = reqData["bme-numbers"];
        
        // Need to validate the bmeNumbers input 
        bmeNumbers.forEach((bme) => {
            if (!isValidBME(bme)) {
                throw new Error(`The BME #: ${bme} is not recognised as a valid BME. Please check the input.`)
            }
        })
                
        // Generate the bme list to input as a parameter
        const arrayLength = bmeNumbers.length;
        const lastIndex = arrayLength - 1;
        const queryParameter = lastIndex === 0 ? `'${bmeNumbers[0]}'` : bmeNumbers.map((bme, index) => {
            return index === 0 ? `('${bme}'` : index === lastIndex ? `'${bme}')` : `'${bme}'`
        }).join(",");
        
        // Get the genius 3 serial numbers
        const bmeSerialLookup = await getGenius3Serial(queryParameter, arrayLength);

        // Declare the serial number and BME arrays
        let returnedBME = [];
        const serialNumbers = [];
        const errorBME = [];  

        // Initialise error indicating a device is not Genius 3.
        let notGenius3Error = false;

        // Check if any returned data is not Genius 3 and set error to true then send an error
        bmeSerialLookup.forEach((entry) => {
            returnedBME.push(entry["BMENO"]);
            serialNumbers.push(entry["Serial_No"]);
            
            // Define available Brand Names for Genius 3 and push to error array if Brand Name is not in options.   
            const brandOptions = ['Genius 3', 'GENIUS 3', '303013'];
            if (!brandOptions.includes(entry["BRAND_NAME"])) {
                notGenius3Error = true;
                errorBME.push(entry["BMENO"])
            }
        }, []);
        
        // If any returned devices are not Genius 3, then throw an error indicating the at fault BME numbers.
        if (notGenius3Error) {
            const errBmeString = errorBME.map((bme) => {
                return `BME #: ${bme}`
            }).join(',');
            throw new Error(`The following ${errorBME.length === 1 ? 'device,' : 'devices,'} ${errBmeString}, ${errorBME.length === 1 ? 'does' : 'do'} not correspond to ${errorBME.length === 1 ? 'a Genius 3 Thermometer' : 'Genius 3 Thermometers'}. Please review the entered data.`)
        }

        // Check the size of the returned data to make sure all bme input returns a serial number. 
        for (const bme in bmeNumbers) {
            if (!returnedBME.includes(bmeNumbers[bme])) {
                throw new Error(`The BME #: ${bmeNumbers[bme]} doesn't exist in the database. Please check the entered data.`);
            }
        }

        // Create data to write to file
        const timestamp = Date.now();
        const newThermometerData = bmeSerialLookup.map((entry) => {
            return {bme: entry.BMENO, serial: entry["Serial_No"], date: timestamp};
        })

        // Read data from file into object
        const thermometerData =  await readThermometerData(__dirname);
        
        let updatedThermometerData;
        // append new data
        if (thermometerData.length === 0) {
            updatedThermometerData= newThermometerData.reduce((acc, entry) => {
                acc.push(entry);
                return acc
            }, [])
        }
        else {
            thermometerData.push(...newThermometerData);
            updatedThermometerData = thermometerData
        }
        
        // Write the serial numbers and name data into the Genius 3 Form Template
        const pdfStr = await populateGenius3RequestTemplate(name, serialNumbers, __dirname);

        // write to file 
        writeThermometerData(__dirname, JSON.stringify(updatedThermometerData, null, 2));        
        
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.contentType("application/pdf");
        res.end(pdfStr);
    } catch (err) {
        // Send the error response message.
        console.log(err);
        res.status(400).json({message: err.message});
    }
}

export async function getThermometerBatch(req, res, __dirname) {
    
    try {
        const jsonData = JSON.stringify(req.body);
        const reqData = JSON.parse(jsonData);

        // Get the BME from the JSON body 
        const bme = reqData.bme;

        // Get the thermometer data
        const allThermometerData = await readThermometerData(__dirname);

        // Get the timestamp from the provided thermometer BME
        const bmeEntry  = allThermometerData.find((entry) => {
            return entry.bme === bme;
        });

        if (bmeEntry === undefined) {
            throw new Error(`The entered BME #: ${bme} is not in the list of inactive thermometers. Please try another BME in the returned batch.`)
        }

        const selectedTimestamp = bmeEntry.date;

        // Get the batch BME numbers with the same timestamp
        const batchBMENumbers = allThermometerData.filter((entry) => {
            return entry.date === selectedTimestamp;
        });

        // Send the stringified batch array as JSON reponse
        res.json(JSON.stringify(batchBMENumbers));
    } catch (err) {
        // Send the error response message.
        console.log(err);
        res.status(400).json({message: err.message});
    }
}

export async function updateThermometerList(req, res, __dirname) {
    try {

        // Parse the request data to get the BME Array.
        const jsonData = JSON.stringify(req.body);
        const reqData = JSON.parse(jsonData);

        // Validate the BME array
        reqData.forEach((bme) => {
            if (!isValidBME(bme)) {
                throw new Error(`The entry BME #: ${bme} is not a recognised BME. Please review the data and contact an administrator if the issue persists.`)
            }
        });

        // Read the current thermometer data from file.
        const currentGenius3Data = await readThermometerData(__dirname);
        
        // Filter the selected BME's in the request data from the current data and stringify the updated data for writing to file.
        const updatedGenius3Data = currentGenius3Data.filter((entry) => {
            return reqData.includes(entry.bme) === false;
        });

        // Write the data to file.
        writeThermometerData(__dirname, JSON.stringify(updatedGenius3Data));

       // Send the success response message.
       res.json({type: "Success", message: 'Thermometer Data Update Successful'}); 


    } catch (err) {
        // Send the error response message.
        console.log(err);
        res.status(400).json({message: err.message});
    }
}

export async function getInactiveThermometers(req, res, __dirname) {
    try {
    // Specify the number of milliseconds in 2 months. Determine the cut-off by subtracting from current time
    const currentTimestamp = Date.now();
    const msIn2Months = 5259600000;

    // Any thermometer with timestamp below cut-off will be returned 
    const cutOff = currentTimestamp - msIn2Months;

    // Get current data and filter out inactive entries.
    const currentGenius3Data = await readThermometerData(__dirname);
    
    const inactiveEntries = currentGenius3Data.filter((entry) => {
        return entry.date <= cutOff;
    });  

    // Send json response.
    res.json(JSON.stringify(inactiveEntries));
    } 
    catch (err) {
        // Send the error response message.
        console.log(err);
        res.status(400).json({message: err.message});
    }  
}

export async function disposeSelectedThermometers(req, res, __dirname) {
    try {
        // Parse the request data to get the BME Array.
        const jsonData = JSON.stringify(req.body);
        const BMENumbers = JSON.parse(jsonData);
       
        // Check the request data are valid BME numbers.
        for (const bme in BMENumbers) {
            if (!isValidBME(BMENumbers[bme])) {
                throw new Error('The selected BME is not a recognised BME Number. Please Contact an administrator to resolve the issue.')
            }
        }

        // Get the genius 3 serial numbers and brand names
        const bmeSerialLookup = await getGenius3Serial(queryParameter, arrayLength);

        // If not genius 3 then push to array so error can be thrown.
        let errorBME = [];
        bmeSerialLookup.forEach((entry) => {
            if (!brandOptions.includes(entry["BRAND_NAME"])) {
                errorBME.push(entry["BMENO"])
            }
        });

        if (errorBME.length > 0) {
            throw new Error(`The following BME Number/s are not recognised as Genius 3 devices; ${errorBME.join(",")}. Please contact an administrator to resolve the issue.`)
        }

        const inputParameter = BMENumbers.join(',');
        console.log(inputParameter);

        //const testData = await disposeGenius3(inputParameter);
        
        // Send the success response message.
        res.json({type: "Success", message: 'Selected Thermometers Disposed Successfully'}); 
    } catch (err) {
       // Send the error response message.
       console.log(err);
       res.status(400).json({message: err.message});
    }
}