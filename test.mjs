import { getAllDeviceData } from "./models/device-models.mjs"
import fs from 'fs';
import path from 'path';

const __dirname = path.dirname(".");

async function getConfigTypes() {
    const deviceData = await getAllDeviceData(__dirname);
    const configData = deviceData.map((entry) => {
        return entry.passwords;
    })

    const passwordTypes = [];

    configData.forEach((entry) => {
        if (entry !== "") {
            entry.forEach((password) => {
                if (!passwordTypes.includes(password.type)) {
                    passwordTypes.push(password.type)
                }
            })
        }
    });

    console.log(passwordTypes)
}

getConfigTypes();
