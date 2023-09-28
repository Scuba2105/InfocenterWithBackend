import useMediaQueries from "media-queries-in-react" ;
import { useProfilePhotoUpdate } from "./StateStore";
import { workshops } from "../data";
import { serverConfig } from "../server";
import { EmailIcon, BlankProfile } from "../svg";

const teamColors = {Management: {background: 'radial-gradient(rgb(246, 193, 194), rgb(217, 95, 97))', 
border: '1px solid rgb(137, 44, 44)', color: 'rgb(137, 44, 44)'}, JHH: {background: 'radial-gradient(rgb(246, 193, 194), rgb(217, 95, 97))', 
border: '1px solid rgb(137, 44, 44)', color: 'rgb(137, 44, 44)'}, Hunter: {background: 'radial-gradient(rgb(193, 246, 222), rgb(49, 204, 150))', 
border: '1px solid rgb(4, 107, 71)', color: 'rgb(4, 107, 71)'}, Tamworth: {background: 'radial-gradient(rgb(153, 214, 247), rgb(33, 112, 191))', 
border: '1px solid rgb(2, 57, 87)', color: 'rgb(2, 57, 87)'}, Mechanical: {background: 'radial-gradient(rgb(217, 126, 247), rgb(166, 66, 199))', 
border: '1px solid rgb(73, 16, 92)', color: 'rgb(73, 16, 92)'}, default: {background: 'radial-gradient(rgb(250, 193, 112), rgb(250, 169, 55))', 
border: '1px solid rgb(163, 98, 3)', color: 'rgb(163, 98, 3)'}} 

function emailFontSize(name, laptop) {
    if (name === "Azmi Refal" && laptop) {
        return {fontSize: "9px", border: '1px solid black'}
    }
    if (name !== "Azmi Refal" && laptop) {
        return {fontSize: "12px", border: '1px solid black'}
    }
    if (name === "Azmi Refal" && !laptop) {
        return {fontSize: "12px", border: '1px solid black'}
    }
    if (name !== "Azmi Refal" && !laptop) {
        return {fontSize: "16px", border: '1px solid black'}
    }
} 

function getTextColor(team) {
    const colorString = teamColors[team].background.split(' rgb')[1];
    const rgb = colorString.substring(0, colorString.length - 1)
    return `rgb${rgb}`;
}

export function StaffDetails({selectedData, user}) {
    
    const profilePhotoUpdates = useProfilePhotoUpdate((state) => state.profilePhotoUpdates);

    const mediaQueries = useMediaQueries({
        laptop: "(max-width: 1250px)",
        desktop: "(min-width: 1800px)"
    });

    const emailAddress = selectedData.name === "Azmi Refal" ? `mailto:Mohamed${selectedData.name.replace(' ', '.Mohamed')}@health.nsw.gov.au` : `mailto:${selectedData.name.replace(' ', '.').replace(' ', '')}@health.nsw.gov.au`;
    
    return (
        <div className={mediaQueries.laptop === true ? 'staff-info-laptop' : 'staff-info-desktop'}>
            <div className={mediaQueries.laptop === true ? "staff-heading-laptop" : "staff-heading-desktop"}>
                <div className={mediaQueries.laptop === true ? "staff-logo-laptop" : "staff-logo-desktop"}>
                    {selectedData.img ? <img key={profilePhotoUpdates * 10} className={mediaQueries.laptop === true ? "logo-laptop" : "logo-desktop"} src={`http://${serverConfig.host}:${serverConfig.port}/images/staff/${selectedData.id}.${selectedData.img}`} alt="staff" style={{border: "1px solid black"}}></img> :
                    workshops.includes(selectedData.name) ? <div className={mediaQueries.laptop ? "logo-laptop" : "logo-desktop"} style={selectedData.team ? teamColors[selectedData.team] : teamColors.default}><img className={mediaQueries.laptop ? "phone-image-laptop" : "phone-image-desktop"} src={`http://${serverConfig.host}:${serverConfig.port}/images/phone.svg`} alt="phone"></img></div> :
                    <BlankProfile identifier={mediaQueries.laptop === true ? "blank-picture-laptop" : "blank-picture-desktop"} size={mediaQueries.laptop ? "120px" : "200px"} foregroundColor="#6B7F82" ></BlankProfile>}
                </div>
                <div className={mediaQueries.laptop ? "staff-name-laptop" : "staff-name-desktop"}>
                    <div className="name-update-container">
                        <p className={mediaQueries.laptop ? "name-text-laptop" : "name-text-desktop"}>{selectedData.name}</p>
                        {!workshops.includes(selectedData.name) && user !== selectedData.name && <a href={emailAddress} className="email-link" style={emailFontSize(selectedData.name, mediaQueries.laptop)}><EmailIcon color="#212936"></EmailIcon></a>}
                    </div>
                    <p className={mediaQueries.laptop === true ? "position-laptop" : "position-desktop"}>{selectedData.id !== '-' ? `${selectedData.hospital}, ${selectedData.position}` : "Biomed Location"}</p>
                </div>
            </div>            
            <div className={mediaQueries.laptop ? "info-container-laptop" : "info-container-desktop"}>
                {selectedData.id !== "-" && <div className="info-entry-container"><h5 style={selectedData.id !== '-' ? {backgroundColor: getTextColor(selectedData.team), border: '1px solid black'} : {backgroundColor: getTextColor("default"), border: '1px solid black'}}>Staff ID</h5><span style={{border: '1px solid black'}}>{selectedData.id}</span></div>}
                {!workshops.includes(selectedData.name) && <div className="info-entry-container"><h5 style={selectedData.hostname !== '-' ? {backgroundColor: getTextColor(selectedData.team), border: '1px solid black'} : {backgroundColor: getTextColor("default"), border: '1px solid black'}}>Computer Name</h5><span style={{border: '1px solid black'}}>{selectedData.hostname === "" ? "-" : selectedData.hostname}</span></div>}
                {<div className="info-entry-container"><h5 style={selectedData.id !== '-' ? {backgroundColor: getTextColor(selectedData.team), border: '1px solid black'} : {backgroundColor: getTextColor("default"), border: '1px solid black'}}>Office Phone</h5><span style={{border: '1px solid black'}}>{selectedData.officePhone === "" ? "-" : selectedData.officePhone}</span></div>}
                {<div className="info-entry-container"><h5 style={selectedData.id !== '-' ? {backgroundColor: getTextColor(selectedData.team), border: '1px solid black'} : {backgroundColor: getTextColor("default"), border: '1px solid black'}} >Dect Phone</h5><span style={{border: '1px solid black'}}>{selectedData.dectPhone === '' ? "-" : selectedData.dectPhone}</span></div>}
                {<div className="info-entry-container"><h5 style={selectedData.id !== '-' ? {backgroundColor: getTextColor(selectedData.team), border: '1px solid black'} : {backgroundColor: getTextColor("default"), border: '1px solid black'}} >Work Mobile</h5><span style={{border: '1px solid black'}}>{selectedData.workMobile === '' ? "-" : selectedData.workMobile}</span></div>}
                {<div className="info-entry-container"><h5 style={selectedData.id !== '-' ? {backgroundColor: getTextColor(selectedData.team), border: '1px solid black'} : {backgroundColor: getTextColor("default"), border: '1px solid black'}} >Personal Mobile</h5><span style={{border: '1px solid black'}}>{selectedData.personalMobile === '' ? "-" : selectedData.personalMobile}</span></div>}
            </div>
        </div>
    );
}

