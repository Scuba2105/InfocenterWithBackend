import { getAllTestingTemplateData, writeAllTestingTemplateData } from "../models/testing-templates-models.mjs";
import { Mutex } from "async-mutex";

// Use to prevent race conditions
const testingDataMutex = new Mutex();

// Departments with no sub-locations
const noSubLocationDepts = ["CCU", "Recovery"];

export async function updateTestingProgressData(req, res, next, __dirname) {
    testingDataMutex.runExclusive(async () => {
        try {
            const allTestingData = await getAllTestingTemplateData(__dirname).catch((err) => {
                if (err.type === "FileHandlingError") {
                    throw new FileHandlingError(err.message, err.cause, err.action, err.route);
                }
                else {
                    throw new ParsingError(err.message, err.cause, err.route);
                }
            })

            // Get variables from the request body.
            const hospital = req.body.hospital;
            const department = req.body.department;
            const subLocation = req.body.subLocation;
            const updatedTestingData = req.body.testData;
            const date = new Date();

            // Convert the date object to date string
            const newDateString = date.toLocaleDateString();

            // Mutate the all testing data to update the testing data
            if (subLocation === null) {
                allTestingData[hospital][department]["testData"] = updatedTestingData;
            }
            else {
                allTestingData[hospital][department]["testData"][subLocation] = updatedTestingData;
            }

            // Update the last updated date for the current department
            allTestingData[hospital][department]["lastUpdate"] = newDateString;
            
           // Write the data to file.
           const fileWrittenResult = await writeAllTestingTemplateData(__dirname, JSON.stringify(allTestingData, null, 2)).catch((err) => {
            throw new FileHandlingError(err.message, err.cause, err.action, err.route);
            });

            // Send the response to the client.
            res.json({type: "Success", message: 'Data Upload Successful'});

        } catch (err) {
            // Send the error response message.
            console.log({Route: "Update-Testing-Progress", Error: err.message});
            next(err);
        }
    })
}

export async function resetTestingProgressData(req, res, next, __dirname) {
    testingDataMutex.runExclusive(async () => {
        try {
            const allTestingData = await getAllTestingTemplateData(__dirname).catch((err) => {
                if (err.type === "FileHandlingError") {
                    throw new FileHandlingError(err.message, err.cause, err.action, err.route);
                }
                else {
                    throw new ParsingError(err.message, err.cause, err.route);
                }
            })

            // Get variables from the request body.
            const hospital = req.body.hospital;
            const department = req.body.department;
            const date = new Date();

            // Convert the date object to date string
            const newDateString = date.toLocaleDateString();

            // Loop over each entry in the testing data and reset the testing progress
            const currentDeptData = allTestingData[hospital][department]["testData"];

            // If department has several sub locations loop over each one, else loop over all beds and set to false.
            if (!noSubLocationDepts.includes(department)) {
                for (const [sublocation, testData] of Object.entries(currentDeptData)) {
                    testData.map((bedData) => {
                        for (const [key, value] of Object.entries(bedData)) {
                            if (key !== "bed") {
                                bedData[key] = false;
                            }
                        }
                    })
                }
            }
            else {
                currentDeptData.map((bedData) => {
                    for (const [key, value] of Object.entries(bedData)) {
                        if (key !== "bed") {
                            bedData[key] = false;
                        }
                    }
                })
            }

            // Update the last updated date for the current department
            allTestingData[hospital][department]["lastUpdate"] = newDateString;
            allTestingData[hospital][department]["testData"] = currentDeptData;

           // Write the data to file.
           const fileWrittenResult = await writeAllTestingTemplateData(__dirname, JSON.stringify(allTestingData, null, 2)).catch((err) => {
            throw new FileHandlingError(err.message, err.cause, err.action, err.route);
            });

            // Send the response to the client.
            res.json({type: "Success", message: 'Data Upload Successful'});

        } catch (err) {
            // Send the error response message.
            console.log({Route: "Reset-Testing-Progress", Error: err.message});
            next(err);
        }
    })
}