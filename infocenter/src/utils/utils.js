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
    const res = await fetch("http://localhost:5000/getData", {
            method: "GET", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, *cors, same-origin
            redirect: "follow", // manual, *follow, error
            referrerPolicy: "no-referrer"
    })
    const data = await res.json();
    return data;
}