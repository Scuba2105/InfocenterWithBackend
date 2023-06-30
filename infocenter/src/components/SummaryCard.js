import { TechnicalLinks } from "./TechnicalLinks";
import { StaffDetails } from "./StaffDetails";
import { ConfigModal } from "./ConfigModal";
import { useState } from "react"
import useMediaQueries from "media-queries-in-react" 

export function SummaryCard({page, pageData, selectedEntry, updatePageData}) {
    const mediaQueries = useMediaQueries({
        laptop: "(max-width: 1250px)",
        desktop: "(min-width: 1800px)"
    });
    console.log(pageData)
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
    const currentDataSet = pageData;

    const selectedData = currentDataSet.find((entry) => {
        return entry.model === selectedEntry || entry.id === selectedEntry || entry.name === selectedEntry;
    });

    function onConfigClick(e) {
        if (selectedData.config !== "") {
            setModalVisible(true);
        }
    }

    function closeConfig() {
        setModalVisible(false);
    }
    
    return (
        <div className={getClassName(page)}>
                <h2>{page === 'staff' ? "Employee Summary" : "Equipment Summary"}</h2>
                {page === 'staff' && <StaffDetails key={selectedData.name} selectedData={selectedData} />}                    
                {page === 'technical-info' && <TechnicalLinks key={selectedData.model} selectedData={selectedData} onConfigClick={onConfigClick} updatePageData={updatePageData}/>}
                {modalVisible && page === 'technical-info' && <ConfigModal selectedData={selectedData} closeConfig={closeConfig} />}
        </div>    
    );
}