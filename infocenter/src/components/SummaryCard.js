import { TechnicalLinks } from "./TechnicalInfo/TechnicalLinks";
import { StaffDetails } from "./Staff/StaffDetails";
import { useUser, useDevice } from "./StateStore";
import { LinkModal } from "./TechnicalInfo/LinkModal";
import { ModalSkeleton } from "./ModalSkeleton";
import { useState } from "react"
import { AddEditStaff } from "./Staff/AddEditStaff";
import { EditIcon, VendorArrow } from "../svg";
import { Tooltip } from "./Tooltip";
import { MainButton } from "./MainButton";
import { workshops } from "../data";
import { delayFunctionInitiation } from "../utils/utils";

function getClassName(page) {
    if (page === 'staff') {
        return 'display-area staff-display'
    }
    else if (page === 'technical-info') {
        return 'display-area equipment-display'
    }
}

function onLinkClick(e, selectedData, setModalVisible) {
    const option = e.currentTarget.classList[1];
    if (selectedData[option] !== "") {
        setModalVisible({visible: true, type: option});
    }
}

// Closes the modal skeleton
function closeModal(setModalVisible) {
    setModalVisible({visible: false, type: null});
}

// Functions for opening and closing the staff add/edit form
function openAddUpdateForm(setAddUpdateFormVisible) {
    delayFunctionInitiation(() => {
        setAddUpdateFormVisible(true);
    })
}

function closeAddUpdateForm(setAddUpdateFormVisible) {
    setAddUpdateFormVisible(false);
}

// Functions for opening and closing equipment update form
function showDeviceUpdate(setUpdateFormVisible) {
    delayFunctionInitiation(() => {
        setUpdateFormVisible(true);
    })
}

function closeUpdate(setUpdateFormVisible) {
    setUpdateFormVisible(false)
}

function renderContactsPage(setPage, setVendor, setCurrentDevice, currentModel, currentVendor) {
    setPage('contacts');
    setVendor(currentVendor);
    setCurrentDevice(currentModel);
}

function ButtonComponent({onMouseOver, onClick, onMouseOut, imageColor="#BCE7FD"}) {
    return (
        <MainButton buttonSize="40px" Image={EditIcon} imageColor="#D4FB7C" onClick={onClick} onMouseOver={onMouseOver} onMouseOut={onMouseOut}/>
    )
}

export function SummaryCard({page, setPage, pageData, selectedEntry, setVendor, queryClient, showMessage, closeDialog}) {
    
    const [modalVisible, setModalVisible] = useState(false);
    const [addUpdateFormVisible, setAddUpdateFormVisible] = useState(false);
    const [updateFormVisible, setUpdateFormVisible] = useState(false);
        
    const currentDataSet = pageData;

    const selectedData = currentDataSet.find((entry) => {
        return entry.model === selectedEntry || entry.id === selectedEntry || entry.name === selectedEntry;
    });
    
    // Get user state from Zustand state
    const currentUser = useUser((state) => state.userCredentials);
    const staffEditPermissions = (currentUser.permissions === "admin" || currentUser.user === selectedData.name)
    const equipmentEditPermissions = currentUser.permissions === "admin";
    
    // Get the state setter for selected device from Zustand state
    const setCurrentDevice = useDevice((state) => state.setDevice);
    
    return (
        <div className="display-area-container flex-c-col">
            <div className={getClassName(page)}>
                <div className={page === "staff" && (workshops.includes(selectedData.name) || !staffEditPermissions) ? "summary-card-header-center flex-c" : "summary-card-header flex-c"}>
                    {(page === "staff" && !workshops.includes(selectedData.name) && staffEditPermissions) && <div id="summary-header-aligner"></div>}
                    {page === "technical-info" && <div id="summary-header-aligner"></div>}
                    <h2>{page === 'staff' ? "Employee Summary" : page === "technical-info" ? "Equipment Summary" : "Department Contacts"}</h2>
                    {!workshops.includes(selectedData.name) && (staffEditPermissions || currentUser.user === selectedData.name) && page === "staff" && <Tooltip content="Edit Employee" xPos="-19px" yPos="-45px" btnTranslateX="-20px" ButtonComponent={ButtonComponent} onClick={() => openAddUpdateForm(setAddUpdateFormVisible)} btnColor="#D4FB7C" />}
                    {page === "technical-info" && <Tooltip content={equipmentEditPermissions ? "Edit Device" : "Send Request"} xPos={equipmentEditPermissions ? "-12px" : "-16px"} yPos="-45px" btnTranslateX="-20px" ButtonComponent={ButtonComponent} onClick={() => showDeviceUpdate(setUpdateFormVisible)} btnColor="#D4FB7C" />}
                </div>
                {page === 'staff' && <StaffDetails key={selectedData.name} selectedData={selectedData} user={currentUser.staffId} />}                    
                {page === 'technical-info' && <TechnicalLinks key={selectedData.model} selectedData={selectedData} page={page} currentUser={currentUser} equipmentEditPermissions={equipmentEditPermissions} updateFormVisible={updateFormVisible} setUpdateFormVisible={setUpdateFormVisible} closeUpdate={closeUpdate} onLinkClick={(e) => onLinkClick(e, selectedData, setModalVisible)} queryClient={queryClient} showMessage={showMessage} closeDialog={closeDialog}/>}
                {page === "technical-info" && selectedData.vendor && <div className="vendor-link flex-c">
                    <button className="vendor-button flex-c form-btn-transition" onClick={() => renderContactsPage(setPage, setVendor, setCurrentDevice, selectedData.model, selectedData.vendor)}>View Vendor Contacts <VendorArrow size="2.31vh" color="white"></VendorArrow></button> 
                </div>}
                {addUpdateFormVisible && page === 'staff' && 
                    <ModalSkeleton selectedData={selectedData} closeModal={() => closeAddUpdateForm(setAddUpdateFormVisible)} type="update" page={page}>
                        <AddEditStaff type="update" page={page} selectedData={selectedData} queryClient={queryClient} showMessage={showMessage} closeDialog={closeDialog} closeAddModal={() => closeAddUpdateForm(setAddUpdateFormVisible)}/>
                    </ModalSkeleton>}
                {modalVisible.visible && page === 'technical-info' && 
                    <ModalSkeleton selectedData={selectedData} closeModal={() => closeModal(setModalVisible)} type={modalVisible.type} page={page}>
                        <LinkModal selectedData={selectedData} modalType={modalVisible.type} queryClient={queryClient} showMessage={showMessage} closeDialog={closeDialog} /> 
                    </ModalSkeleton>}
            </div>
        </div>
    )
}
