import { getOnCallData, writeOnCallData } from "../models/on-call-models.mjs";

export async function updateOnCallData(req, res, __dirname) {
    const onCallData = await getOnCallData(__dirname);
    if (req.params.operation === "edit") {
        // Get the new data from the request and create the new date objects.
        const newData = req.body;
        const startDate = new Date(newData.startDate);
        const endDate = new Date(newData.endDate);

        // Add the timestamps to the object.
        newData.startDate = startDate.getTime();
        newData.endDate = endDate.getTime();

        // Add the new data to the existing on call data.
        onCallData.push(newData);
        
        // Write the data to file.
        writeOnCallData(__dirname, JSON.stringify(onCallData, null, 2));

        // Send the response to the client.
        res.json({type: "Success", message: 'Data Upload Successful'});
    }
    else if (req.params.operation === "confirm") {

    }
}