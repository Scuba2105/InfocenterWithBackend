import { TechnicalLinks } from "./TechnicalLinks";
import { StaffDetails } from "./StaffDetails";
import { useUser } from "./StateStore";
import { LinkModal } from "./LinkModal";
import { ModalSkeleton } from "./ModalSkeleton";
import { useState } from "react"
import useMediaQueries from "media-queries-in-react" 
import { AddEditStaff } from "./AddEditStaff";
import { EditIcon } from "../svg";
import { workshops } from "../data";
import { serverConfig } from "../server";

function getClassName(page, mediaQueries) {
    if (page === 'staff' && mediaQueries.laptop === true) {
        return 'display-area-laptop staff-display-laptop'
    }
    else if (page === 'staff' && mediaQueries.desktop === true) {
        return 'display-area-desktop staff-display-desktop'
    }
    else if (page === 'technical-info' && mediaQueries.laptop === true) {
        return 'display-area-laptop equipment-display-laptop'
    }
    else if (page === 'technical-info' && mediaQueries.desktop === true) {
        return 'display-area-desktop equipment-display-desktop'
    }
    else if (page === 'contacts' && mediaQueries.laptop === true) {
        return 'display-area-laptop staff-display-laptop'
    }
    else {
        return 'display-area-desktop staff-display-desktop'
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

export function SummaryCard({page, pageData, selectedEntry, queryClient, showMessage, closeDialog}) {
    const mediaQueries = useMediaQueries({
        laptop: "(max-width: 1250px)",
        desktop: "(min-width: 1800px)"
    });

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

    return (
        <div className={getClassName(page, mediaQueries)}>
            <div className={(workshops.includes(selectedData.name) || !staffEditPermissions) ? "summary-card-header-center" : "summary-card-header"}>
                {!workshops.includes(selectedData.name) && staffEditPermissions && <div id="summary-header-aligner"></div>}
                <h2>{page === 'staff' ? "Employee Summary" : page === "technical-info" ? "Equipment Summary" : "Department Contacts"}</h2>
                {!workshops.includes(selectedData.name) && (staffEditPermissions || currentUser.user === selectedData.name) && page === "staff" && <div className={mediaQueries.laptop ? "staff-edit-btn-laptop" : "staff-edit-btn-desktop"} onClick={() => openAddUpdateForm(setAddUpdateFormVisible)}><EditIcon color="#212936"></EditIcon></div>}
                {equipmentEditPermissions && page === "technical-info" && <div className="device-edit-button" onClick={() => showDeviceUpdate(setUpdateFormVisible)}><EditIcon color="#212936"></EditIcon></div>}
            </div>                
            {page === 'staff' && <StaffDetails key={selectedData.name} selectedData={selectedData} user={currentUser.user} />}                    
            {page === 'technical-info' && <TechnicalLinks key={selectedData.model} selectedData={selectedData} page={page} updateFormVisible={updateFormVisible} setUpdateFormVisible={setUpdateFormVisible} closeUpdate={closeUpdate} onLinkClick={(e) => onLinkClick(e, selectedData, setModalVisible)} queryClient={queryClient} showMessage={showMessage} closeDialog={closeDialog}/>}
            {addUpdateFormVisible && page === 'staff' && 
                <ModalSkeleton selectedData={selectedData} closeModal={() => closeAddUpdateForm(setAddUpdateFormVisible)} type="update" page={page}>
                    <AddEditStaff type="update" page={page} selectedData={selectedData} queryClient={queryClient} showMessage={showMessage} closeDialog={closeDialog} closeAddModal={() => closeAddUpdateForm(setAddUpdateFormVisible)} />
                </ModalSkeleton>}
            {modalVisible.visible && page === 'technical-info' && 
                <ModalSkeleton selectedData={selectedData} closeModal={() => closeModal(setModalVisible)} type={modalVisible.type} page={page}>
                    <LinkModal selectedData={selectedData} modalType={modalVisible.type} />
                </ModalSkeleton>}
        </div>    
    );
}