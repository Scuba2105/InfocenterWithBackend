import { SelectInput } from "./SelectInput";
import { useRef } from "react";

export function ContactsFilter({identifier, selectedDepartment, selectedVendor, pageData, onHospitalChange, onDepartmentChange, onVendorChange, setContactPage, setVendorContactPage}) {
    
    const inputsContainer = useRef(null);

    // Filter the data for the select options for hospitals, departments and vendors. 
    let hospitalData, departmentData, vendorNames
    if (identifier === "staff") {
        hospitalData = pageData.reduce((acc, entry) => {
            if (!acc.includes(`${entry.hospital}`)) {
                acc.push(entry.hospital);
            }
            return acc
        }, [])

        departmentData = pageData.reduce((acc, entry) => {
            if (entry.hospital === selectedDepartment.hospital && !acc.includes(`${entry.department}`)) {
                acc.push(entry.department);
            }
            return acc
        }, [])
    }
    else {
        vendorNames = pageData.reduce((acc, entry) => {
            if (!acc.includes(`${entry.vendor}`)) {
                acc.push(entry.vendor);
            } 
            return acc
        }, [])
    }
            
    if (identifier === "staff") {
        return (
            <div ref={inputsContainer} className="contacts-filter-container">
                <SelectInput type="contacts-hospitals" defaultValue={selectedDepartment.hospital} label="Hospital" optionData={hospitalData} onChange={(e) => onHospitalChange(pageData, setContactPage, inputsContainer, e)}></SelectInput>
                <SelectInput type="contacts-departments" defaultValue={selectedDepartment.department} label="Department" optionData={departmentData} onChange={(e) => onDepartmentChange(setContactPage, e)}></SelectInput>
            </div>
        );
    }
    else {
        return (
            <div className="contacts-filter-container">
                <SelectInput type="contacts-hospitals" defaultValue={selectedVendor} label="Vendor" optionData={vendorNames} onChange={(e) => onVendorChange(setVendorContactPage, e)}></SelectInput>
            </div>
        )
    }
    
}