import { getAllTestingTemplateData, writeAllTestingTemplateData } from "../models/testing-templates-models.mjs";
import { Mutex } from "async-mutex";

// Use to prevent race conditions
const testingDataMutex = new Mutex();

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

            // Mutate the all testing data to update the testing data
            if (subLocation === null) {
                allTestingData[hospital][department] = updatedTestingData;
            }
            else {
                allTestingData[hospital][department][subLocation] = updatedTestingData;
            }
            
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