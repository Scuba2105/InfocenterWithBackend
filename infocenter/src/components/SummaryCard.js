import { TechnicalLinks } from "./TechnicalLinks";
import { StaffDetails } from "./StaffDetails";
import { ConfigModal } from "./ConfigModal";
import { useState } from "react"

const staffStyles = {display: 'grid', gridTemplateColumns: '1fr', gridTemplateRows: '15% 1fr',
height: '88%', maxHeight: '550px'};

const equipmentStyles = {display: 'grid', gridTemplateColumns: '1fr', gridTemplateRows: '15% 180px 1fr',
height: '88%',maxHeight: '650px'};

export function SummaryCard({pageData, selectedEntry}) {
    
    const [modalVisible, setModalVisible] = useState(false);
    const page = pageData.page;
    const currentDataSet = pageData.data;

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
        <div className="display-area" style={page === 'staff' ? staffStyles : equipmentStyles }>
                <h2>{page === 'staff' ? "Employee Summary" : "Equipment Summary"}</h2>
                {page === 'staff' && <StaffDetails key={selectedData.name} selectedData={selectedData} />}                    
                {page === 'technical-info' && <TechnicalLinks key={selectedData.model} selectedData={selectedData} onConfigClick={onConfigClick} />}
                {modalVisible && page === 'technical-info' && <ConfigModal selectedData={selectedData} closeConfig={closeConfig} />}
        </div>    
    );
}