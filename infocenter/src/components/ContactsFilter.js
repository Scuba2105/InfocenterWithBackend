import { SelectInput } from "./SelectInput";
import { useRef } from "react";

export function ContactsFilter({identifier, selectedDepartment, setSelectedDepartment, selectedVendor, pageData, onHospitalChange, onDepartmentChange, setVendor, onVendorChange, setContactPage, setVendorContactPage}) {
    
    const inputsContainer = useRef(null);

    // Filter the data for the select options for hospitals, departments and vendors. 
    let hospitalData, departmentData, vendorNames
    if (identifier === "staff") {
        hospitalData = pageData.reduce((acc, entry) => {
            if (!acc.includes(`${entry.hospital}`)) {
                acc.push(entry.hospital);
            }
            return acc
        }, []).sort()

        departmentData = pageData.reduce((acc, entry) => {
            if (entry.hospital === selectedDepartment.hospital && !acc.includes(`${entry.department}`)) {
                acc.push(entry.department);
            }
            return acc
        }, []).sort()
    }
    else {
        vendorNames = pageData.reduce((acc, entry) => {
            if (!acc.includes(`${entry.vendor}`)) {
                acc.push(entry.vendor);
            } 
            return acc
        }, []).sort()
    }
            
    if (identifier === "staff") {
        return (
            <div ref={inputsContainer} className="contacts-filter-container flex-c">
                <SelectInput type="contacts-hospitals" defaultValue={selectedDepartment.hospital} label="Hospital" optionData={hospitalData} onChange={(e) => onHospitalChange(pageData, setSelectedDepartment, setContactPage, inputsContainer, e)}></SelectInput>
                <SelectInput type="contacts-departments" defaultValue={selectedDepartment.department} label="Department" optionData={departmentData} onChange={(e) => onDepartmentChange(selectedDepartment, setSelectedDepartment, setContactPage, e)}></SelectInput>
            </div>
        );
    }
    else {
        return (
            <div className="contacts-filter-container flex-c">
                <SelectInput type="contacts-hospitals" defaultValue={selectedVendor} label="Vendor" optionData={vendorNames} onChange={(e) => onVendorChange(setVendor, setVendorContactPage, e)}></SelectInput>
            </div>
        )
    }
    
}