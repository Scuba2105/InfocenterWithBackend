import { TechnicalLinks } from "./TechnicalLinks";
import { StaffDetails } from "./StaffDetails";
import { LinkModal } from "./LinkModal";
import { ModalSkeleton } from "./ModalSkeleton";
import { useState } from "react"
import useMediaQueries from "media-queries-in-react" 
import { AddEditStaff } from "./AddEditStaff";

export function SummaryCard({page, pageData, selectedEntry, queryClient, showMessage, closeDialog}) {
    const mediaQueries = useMediaQueries({
        laptop: "(max-width: 1250px)",
        desktop: "(min-width: 1800px)"
    });
    

    function getClassName(page) {
        if (page === 'staff' && mediaQueries.laptop === true) {
            return 'display-area staff-display-laptop'
        }
        else if (page === 'staff' && mediaQueries.desktop === true) {
            return 'display-area staff-display-desktop'
        }
        else if (page === 'technical-info' && mediaQueries.laptop === true) {
            return 'display-area equipment-display-laptop'
        }
        else {
            return 'display-area equipment-display-desktop'
        }
    }


    const [modalVisible, setModalVisible] = useState(false);
    const [addUpdateFormVisible, setAddUpdateFormVisible] = useState(false);
    const currentDataSet = pageData;

    const selectedData = currentDataSet.find((entry) => {
        return entry.model === selectedEntry || entry.id === selectedEntry || entry.name === selectedEntry;
    });
    
    function onLinkClick(e) {
        const option = e.currentTarget.classList[1];
        if (selectedData[option] !== "") {
            setModalVisible({visible: true, type: option});
        }
    }

    function closeModal() {
        setModalVisible({visible: false, type: null});
    }

    function openAddUpdateForm() {
        setAddUpdateFormVisible(true);
    }

    function closeAddUpdateForm() {
        setAddUpdateFormVisible(false);
    }
    
    return (
        <div className={getClassName(page)}>
                <h2>{page === 'staff' ? "Employee Summary" : "Equipment Summary"}</h2>
                {page === 'staff' && <StaffDetails key={selectedData.name} selectedData={selectedData} openAddUpdateForm={openAddUpdateForm} />}                    
                {page === 'technical-info' && <TechnicalLinks key={selectedData.model} selectedData={selectedData} page={page} onLinkClick={onLinkClick} queryClient={queryClient} showMessage={showMessage} closeDialog={closeDialog}/>}
                {addUpdateFormVisible && page === 'staff' && 
                    <ModalSkeleton selectedData={selectedData} closeModal={closeAddUpdateForm} type="update" page={page}>
                        <AddEditStaff type="update" page={page} selectedData={selectedData} queryClient={queryClient} showMessage={showMessage} closeDialog={closeDialog} closeAddModal={closeAddUpdateForm} />
                    </ModalSkeleton>}
                {modalVisible.visible && page === 'technical-info' && 
                    <ModalSkeleton selectedData={selectedData} closeModal={closeModal} type={modalVisible.type} page={page}>
                        <LinkModal selectedData={selectedData} modalType={modalVisible.type} />
                    </ModalSkeleton>}
        </div>    
    );
}