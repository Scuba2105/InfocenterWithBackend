import './App.css';
import { Menu } from './components/Menu';
import { MainArea } from './components/MainArea';
import { useState, useEffect } from 'react';
import { staffData } from "./staff-data";

export default function App() {

    const [dataObject, setDataObject] = useState(null);

    useEffect(() => {
        async function fetchData() {
            let state = false;
            if (!state) {
                const res = await fetch("http://localhost:5000/getData", {
                    method: "GET", // *GET, POST, PUT, DELETE, etc.
                    mode: "cors", // no-cors, *cors, same-origin
                    redirect: "follow", // manual, *follow, error
                    referrerPolicy: "no-referrer"
                })
                const retrievedData = await res.json()
                console.log('Data retrieved!')
                setDataObject(retrievedData);
                setSelectedPageData({page: 'staff', data: retrievedData.staffData})
            }
            return () => {
                state = true
            } 
        } 

        fetchData(); 
    },[]);

    
    const [pageData, setSelectedPageData] = useState({page: 'staff', data: staffData});
    const [selectedEntry, setSelectedEntry] = useState('60146568');
            
    // Update the selected entry on selecting a row
    function onRowClick(e) {
        const row = e.target.parentNode;
        const entryIdentifier = row.children[0].textContent === '-' ? row.children[1].textContent : row.children[0].textContent
        setSelectedEntry(entryIdentifier);
    }

    // Update the page selected when a new page in the menu is selected
    function onPageSelect(e) {
        const element = e.target.classList[0] !== 'menu-option' ? e.target.parentNode.classList[0] !== 'menu-option' ? e.target.parentNode.parentNode: e.target.parentNode : e.target;
        let data;
        let entry;
        if (element.id === 'staff') {
            data = dataObject.staffData;
            entry = "60146568";
        }
        else if (element.id === 'technical-info') {
            data = dataObject.deviceData;
            entry = "MX450"
        }
        else {
            data = null;
        }
        setSelectedPageData({page: element.id, data: data});
        setSelectedEntry(entry);
    }

    return (
        <div className="wrapper">
            <div className="app-icon"></div>
            <div className="header-bar">HNECT Information Center</div>
            <Menu page={pageData.page} onPageSelect={onPageSelect} />
            <MainArea pageData={pageData} selectedEntry={selectedEntry} onRowClick={onRowClick} />
        </div>
    );
}
