import useMediaQueries from "media-queries-in-react" ;
import { useProfilePhotoUpdate } from "./StateStore";
import { workshops } from "../data";
import { serverConfig } from "../server";
import { EmailIcon, BlankProfile } from "../svg";
import { StaffInfoEntry } from "./StaffInfoEntry";

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

function getTextColor(team, teamColors) {
    const colorString = teamColors[team].background.split(' rgb')[1];
    const rgb = colorString.substring(0, colorString.length - 1)
    return `rgb${rgb}`;
}

export function StaffDetails({selectedData, user}) {
    
    const profilePhotoUpdates = useProfilePhotoUpdate((state) => state.profilePhotoUpdates);

    const mediaQueries = useMediaQueries({
        laptop: "(max-width: 1250px)",
        midScreen: "((max-width: 1700px))",
        desktop: "(min-width: 1800px)"
    });

    const emailAddress = selectedData.name === "Azmi Refal" ? `mailto:Mohamed${selectedData.name.replace(' ', '.Mohamed')}@health.nsw.gov.au` : `mailto:${selectedData.name.replace(' ', '.').replace(' ', '')}@health.nsw.gov.au`;
    
    return (
        <div className='staff-info'>
            <div className="staff-heading">
                <div className="staff-logo">
                    {selectedData.img ? <img key={profilePhotoUpdates * 10} className="logo" src={`https://${serverConfig.host}:${serverConfig.port}/images/staff/${selectedData.id}.${selectedData.img}`} alt="staff" style={{border: "1px solid black"}}></img> :
                    workshops.includes(selectedData.name) ? <div className="logo" style={selectedData.team ? teamColors[selectedData.team] : teamColors.default}><img className="phone-image" src={`https://${serverConfig.host}:${serverConfig.port}/images/phone.svg`} alt="phone"></img></div> :
                    <BlankProfile identifier="blank-picture" size="20vh" foregroundColor="#6B7F82" ></BlankProfile>}
                </div>
                <div className="staff-name">
                    <div className="name-update-container">
                        <p className="name-text">{selectedData.name}</p>
                        {!workshops.includes(selectedData.name) && user !== selectedData.name && <a href={emailAddress} className="email-link" style={emailFontSize(selectedData.name, mediaQueries.laptop)}><EmailIcon color="#212936"></EmailIcon></a>}
                    </div>
                    <p className="position">{selectedData.id !== '-' ? `${selectedData.hospital}, ${selectedData.position}` : "Biomed Location"}</p>
                </div>
            </div>            
            <div className="info-container">
                {selectedData.id !== "-" && <StaffInfoEntry entry="id" headerLabel="Staff ID" selectedData={selectedData} headerColor={() => getTextColor(selectedData.team, teamColors)} defaultColor={() => getTextColor("default")}></StaffInfoEntry>}
                {!workshops.includes(selectedData.name) && <StaffInfoEntry entry="hostname" headerLabel="Computer Name" selectedData={selectedData} headerColor={() => getTextColor(selectedData.team, teamColors)} defaultColor={() => getTextColor("default")}></StaffInfoEntry>}
                {<StaffInfoEntry entry="officePhone" headerLabel="Office Phone" selectedData={selectedData} headerColor={() => getTextColor(selectedData.team, teamColors)} defaultColor={() => getTextColor("default")}></StaffInfoEntry>}
                {<StaffInfoEntry entry="dectPhone" headerLabel="Dect Phone" selectedData={selectedData} headerColor={() => getTextColor(selectedData.team, teamColors)} defaultColor={() => getTextColor("default")}></StaffInfoEntry>}
                {<StaffInfoEntry entry="workMobile" headerLabel="Work Mobile" selectedData={selectedData} headerColor={() => getTextColor(selectedData.team, teamColors)} defaultColor={() => getTextColor("default")}></StaffInfoEntry>}
                {<StaffInfoEntry entry="personalMobile" headerLabel="Personal Mobile" selectedData={selectedData} headerColor={() => getTextColor(selectedData.team, teamColors)} defaultColor={() => getTextColor("default")}></StaffInfoEntry>}
            </div>
        </div>
    );
}

