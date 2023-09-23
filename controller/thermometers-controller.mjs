import { writeThermometerData, readThermometerData } from '../utils/utils.mjs';
import { populateGenius3RequestTemplate } from '../file-handling/repair-request.mjs';
import { getGenius3Serial, disposeGenius3 } from '../models/models.mjs';
import { isValidBME, brandOptions } from '../utils/utils.mjs';

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