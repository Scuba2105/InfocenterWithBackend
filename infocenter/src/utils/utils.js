export function capitaliseFirstLetters(input) {
    const words = input.split(' ');
    const formattedWords = words.map((word) => {
        return word === 'MPS' ? word : word[0].toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
    return formattedWords
}

export function generateDataPages(queryData, entriesPerPage) {
    let pageCount = 0;
    const paginatedData = queryData.reduce((acc, curr, index) => {
        const remainder = index % entriesPerPage;
        
        if (remainder === 0 && index !== 0) {
            pageCount++
            acc.push([]);
        }
        
        acc[pageCount].push(curr)
        return acc;
    }, [[]]);
    return paginatedData;
}

export async function fetchData() {
    try {
        const res = await fetch("http://localhost:5000/getData", {
                method: "GET", // *GET, POST, PUT, DELETE, etc.
                mode: "cors", // no-cors, *cors, same-origin
                redirect: "follow", // manual, *follow, error
                referrerPolicy: "no-referrer"
        })
        
        const data = await res.json();
        return data;
    }
    catch (err) {
        throw new Error(err.message);
    }
}

export function sortMandatoryFields(changedMandatoryFields) {
    // Check if mandatory fields exist in array
    const locationChanged = changedMandatoryFields.includes("Location");
    const positionChanged = changedMandatoryFields.includes("Position");
    const officeChanged = changedMandatoryFields.includes("Office Phone");

    // Push them to the new array in the correct order
    const sortedFields = [];
    if (locationChanged) {
        sortedFields.push("Location");
    }
    if (positionChanged) {
        sortedFields.push("Position");
    }
    if (officeChanged) {
        sortedFields.push("Office Phone");
    }

    return sortedFields;
}

export function getOrdinalNumber(number) {
    const lastNumber = number.split("").slice(-1)[0];
    if (lastNumber === '1') {
        return `${number}st`
    } 
    else if (lastNumber === '2') {
        return `${number}nd`
    } 
    else if (lastNumber === '3') {
        return `${number}rd`
    } 
    else {
        return `${number}th`
    }
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};