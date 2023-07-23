import useMediaQueries from "media-queries-in-react" ;
import { workshops } from "../data";
import { serverConfig } from "../server";

const teamColors = {Management: {background: 'radial-gradient(rgb(246, 193, 194), rgb(217, 95, 97))', 
border: '1px solid rgb(137, 44, 44)', color: 'rgb(137, 44, 44)'}, JHH: {background: 'radial-gradient(rgb(246, 193, 194), rgb(217, 95, 97))', 
border: '1px solid rgb(137, 44, 44)', color: 'rgb(137, 44, 44)'}, Hunter: {background: 'radial-gradient(rgb(193, 246, 222), rgb(49, 204, 150))', 
border: '1px solid rgb(4, 107, 71)', color: 'rgb(4, 107, 71)'}, Tamworth: {background: 'radial-gradient(rgb(153, 214, 247), rgb(33, 112, 191))', 
border: '1px solid rgb(2, 57, 87)', color: 'rgb(2, 57, 87)'}, Mechanical: {background: 'radial-gradient(rgb(217, 126, 247), rgb(166, 66, 199))', 
border: '1px solid rgb(73, 16, 92)', color: 'rgb(73, 16, 92)'}, default: {background: 'radial-gradient(rgb(250, 193, 112), rgb(250, 169, 55))', 
border: '1px solid rgb(163, 98, 3)', color: 'rgb(163, 98, 3)'}} 

export function StaffDetails({selectedData, openAddUpdateForm}) {
    
    const mediaQueries = useMediaQueries({
        laptop: "(max-width: 1250px)",
        desktop: "(min-width: 1800px)"
    });

    const emailAddress = selectedData.name === "Azmi Refal" ? `mailto:Mohamed${selectedData.name.replace(' ', '.Mohamed')}@health.nsw.gov.au` : `mailto:${selectedData.name.replace(' ', '.').replace(' ', '-')}@health.nsw.gov.au`;

    function getTextColor(team) {
        const colorString = teamColors[team].background.split(' rgb')[1];
        const rgb = colorString.substring(0, colorString.length - 1)
        return `rgb${rgb}`;
    }

    return (
        <div className={mediaQueries.laptop === true ? 'staff-info-laptop' : 'staff-info-desktop'}>
            <div className={mediaQueries.laptop === true ? "staff-heading-laptop" : "staff-heading-desktop"}>
                <div className={mediaQueries.laptop === true ? "staff-logo-laptop" : "staff-logo-desktop"}>
                    {selectedData.img ? <img className={mediaQueries.laptop === true ? "logo-laptop" : "logo-desktop"} src={`http://${serverConfig.host}:${serverConfig.port}/images/staff/${selectedData.id}.${selectedData.img}`} alt="staff" style={{border: "1px solid black"}}></img> :
                    workshops.includes(selectedData.name) ? <div className={mediaQueries.laptop ? "logo-laptop" : "logo-desktop"} style={selectedData.team ? teamColors[selectedData.team] : teamColors.default}><img className={mediaQueries.laptop ? "phone-image-laptop" : "phone-image-desktop"} src={`http://${serverConfig.host}:${serverConfig.port}/images/phone.svg`} alt="phone"></img></div> :
                    <img className={mediaQueries.laptop === true ? "logo-laptop" : "logo-desktop"} src={`http://${serverConfig.host}:${serverConfig.port}/images/staff/blank-profile.png`} alt="staff" style={{border: "1px solid black"}}></img>}
                </div>
                <div className={mediaQueries.laptop ? "staff-name-laptop" : "staff-name-desktop"}>
                    <div className="name-update-container">
                        <p className={mediaQueries.laptop ? "name-text-laptop" : "name-text-desktop"}>{selectedData.name}</p>
                        {!workshops.includes(selectedData.name) && <div className={mediaQueries.laptop ? "staff-edit-btn-laptop" : "staff-edit-btn-desktop"} onClick={openAddUpdateForm}><img id="edit-image" src={`http://${serverConfig.host}:${serverConfig.port}/images/edit.svg`} alt="edit"></img>Update</div>}
                    </div>
                    <p className={mediaQueries.laptop === true ? "position-laptop" : "position-desktop"} style={selectedData.id !== '-' ? {color: getTextColor(selectedData.team)} : {color: getTextColor("default")}}>{selectedData.id !== '-' ? `${selectedData.hospital}, ${selectedData.position}` : "Biomed Location"}</p>
                </div>
            </div>            
            <div className={mediaQueries.laptop ? "info-container-laptop" : "info-container-desktop"}>
                {selectedData.id !== "-" && <div className="info-entry-container"><h5 style={selectedData.id !== '-' ? {backgroundColor: getTextColor(selectedData.team)} : {backgroundColor: getTextColor("default")}}>Staff ID</h5><span>{selectedData.id}</span></div>}
                {!workshops.includes(selectedData.name) && <div className="info-entry-container"><h5 style={selectedData.id !== '-' ? {backgroundColor: getTextColor(selectedData.team)} : {backgroundColor: getTextColor("default")}}>Email Address</h5><a href={emailAddress} className="email-link" style={selectedData.name === "Azmi Refal" ? {fontSize: "9px"}: {fontSize: "12px"}}>{emailAddress.replace("mailto:",'')}</a></div>}
                {<div className="info-entry-container"><h5 style={selectedData.id !== '-' ? {backgroundColor: getTextColor(selectedData.team)} : {backgroundColor: getTextColor("default")}}>Office Phone</h5><span>{selectedData.officePhone === "" ? "-" : selectedData.officePhone}</span></div>}
                {<div className="info-entry-container"><h5 style={selectedData.id !== '-' ? {backgroundColor: getTextColor(selectedData.team)} : {backgroundColor: getTextColor("default")}} >Dect Phone</h5><span>{selectedData.dectPhone === '' ? "-" : selectedData.dectPhone}</span></div>}
                {<div className="info-entry-container"><h5 style={selectedData.id !== '-' ? {backgroundColor: getTextColor(selectedData.team)} : {backgroundColor: getTextColor("default")}} >Work Mobile</h5><span>{selectedData.workMobile === '' ? "-" : selectedData.workMobile}</span></div>}
                {<div className="info-entry-container"><h5 style={selectedData.id !== '-' ? {backgroundColor: getTextColor(selectedData.team)} : {backgroundColor: getTextColor("default")}} >Personal Mobile</h5><span>{selectedData.personalMobile === '' ? "-" : selectedData.personalMobile}</span></div>}
            </div>
        </div>
    );
}

