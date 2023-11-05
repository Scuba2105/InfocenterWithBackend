import { TechnicalLinks } from "./TechnicalInfo/TechnicalLinks";
import { StaffDetails } from "./Staff/StaffDetails";
import { useUser, useDevice } from "./StateStore";
import { LinkModal } from "./TechnicalInfo/LinkModal";
import { ModalSkeleton } from "./ModalSkeleton";
import { useState } from "react"
import { AddEditStaff } from "./Staff/AddEditStaff";
import { EditIcon, VendorArrow } from "../svg";
import { workshops } from "../data";

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
    setAddUpdateFormVisible(true);
}

function closeAddUpdateForm(setAddUpdateFormVisible) {
    setAddUpdateFormVisible(false);
}

// Functions for opening and closing equipment update form
function showDeviceUpdate(setUpdateFormVisible) {
    setUpdateFormVisible(true);
}

function closeUpdate(setUpdateFormVisible) {
    setUpdateFormVisible(false)
}

function renderContactsPage(setPage, setVendor, setCurrentDevice, currentModel, currentVendor) {
    setPage('contacts');
    setVendor(currentVendor);
    setCurrentDevice(currentModel);
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
                <div className={(workshops.includes(selectedData.name) || !staffEditPermissions) ? "summary-card-header-center flex-c" : "summary-card-header flex-c"}>
                    {!workshops.includes(selectedData.name) && staffEditPermissions && <div id="summary-header-aligner"></div>}
                    <h2>{page === 'staff' ? "Employee Summary" : page === "technical-info" ? "Equipment Summary" : "Department Contacts"}</h2>
                    {!workshops.includes(selectedData.name) && (staffEditPermissions || currentUser.user === selectedData.name) && page === "staff" && <div className="staff-edit-btn flex-c" onClick={() => openAddUpdateForm(setAddUpdateFormVisible)}><EditIcon color="rgb(5, 234, 146)"></EditIcon></div>}
                    {equipmentEditPermissions && page === "technical-info" && <div className="device-edit-button flex-c" onClick={() => showDeviceUpdate(setUpdateFormVisible)}><EditIcon color="rgb(5, 234, 146)"></EditIcon></div>}
                </div>
                {page === 'staff' && <StaffDetails key={selectedData.name} selectedData={selectedData} user={currentUser.staffId} />}                    
                {page === 'technical-info' && <TechnicalLinks key={selectedData.model} selectedData={selectedData} page={page} updateFormVisible={updateFormVisible} setUpdateFormVisible={setUpdateFormVisible} closeUpdate={closeUpdate} onLinkClick={(e) => onLinkClick(e, selectedData, setModalVisible)} queryClient={queryClient} showMessage={showMessage} closeDialog={closeDialog}/>}
                {page === "technical-info" && selectedData.vendor && <div className="vendor-link flex-c">
                    <button className="vendor-button flex-c" onClick={() => renderContactsPage(setPage, setVendor, setCurrentDevice, selectedData.model, selectedData.vendor)}>View Vendor Contacts <VendorArrow size="2.31vh" color="white"></VendorArrow></button> 
                </div>}
                {addUpdateFormVisible && page === 'staff' && 
                    <ModalSkeleton selectedData={selectedData} closeModal={() => closeAddUpdateForm(setAddUpdateFormVisible)} type="update" page={page}>
                        <AddEditStaff type="update" page={page} selectedData={selectedData} queryClient={queryClient} showMessage={showMessage} closeDialog={closeDialog} closeAddModal={() => closeAddUpdateForm(setAddUpdateFormVisible)} />
                    </ModalSkeleton>}
                {modalVisible.visible && page === 'technical-info' && 
                    <ModalSkeleton selectedData={selectedData} closeModal={() => closeModal(setModalVisible)} type={modalVisible.type} page={page}>
                        <LinkModal selectedData={selectedData} modalType={modalVisible.type} />
                    </ModalSkeleton>}
            </div> 
        </div>
    );
}