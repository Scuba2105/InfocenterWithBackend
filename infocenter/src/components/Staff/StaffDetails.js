import { useProfilePhotoUpdate } from "../StateStore";
import { workshops } from "../../data";
import { serverConfig } from "../../server";
import { EmailIcon, BlankProfile } from "../../svg";
import { StaffInfoEntry } from "./StaffInfoEntry";
import { Laptop, StaffID, OfficePhone, DectPhone, MobilePhone } from "../../svg"

const teamColors = {Management: {background: 'radial-gradient(rgb(246, 193, 194), rgb(217, 95, 97))', 
border: '1px solid rgb(137, 44, 44)', color: 'rgb(137, 44, 44)'}, JHH: {background: 'radial-gradient(rgb(246, 193, 194), rgb(217, 95, 97))', 
border: '1px solid rgb(137, 44, 44)', color: 'rgb(137, 44, 44)'}, Hunter: {background: 'radial-gradient(rgb(193, 246, 222), rgb(49, 204, 150))', 
border: '1px solid rgb(4, 107, 71)', color: 'rgb(4, 107, 71)'}, Tamworth: {background: 'radial-gradient(rgb(153, 214, 247), rgb(33, 112, 191))', 
border: '1px solid rgb(2, 57, 87)', color: 'rgb(2, 57, 87)'}, Mechanical: {background: 'radial-gradient(rgb(217, 126, 247), rgb(166, 66, 199))', 
border: '1px solid rgb(73, 16, 92)', color: 'rgb(73, 16, 92)'}, default: {background: 'radial-gradient(rgb(250, 193, 112), rgb(250, 169, 55))', 
border: '1px solid rgb(163, 98, 3)', color: 'rgb(163, 98, 3)'}} 

function getTextColor(team, teamColors) {
    const colorString = teamColors[team].background.split(' rgb')[1];
    const rgb = colorString.substring(0, colorString.length - 1)
    return `rgb${rgb}`;
}

export function StaffDetails({selectedData, user}) {
    
    const profilePhotoUpdates = useProfilePhotoUpdate((state) => state.profilePhotoUpdates);

    const emailAddress = selectedData.name === "Azmi Refal" ? `mailto:Mohamed${selectedData.name.replace(' ', '.Mohamed')}@health.nsw.gov.au` : `mailto:${selectedData.name.replace(' ', '.').replace(' ', '')}@health.nsw.gov.au`;
    
    return (
        <div className='staff-info'>
            <div className="staff-heading flex-c">
                <div className="staff-logo flex-c">
                    {selectedData.img ? <img key={profilePhotoUpdates * 10} className="logo flex-c" src={`https://${serverConfig.host}:${serverConfig.port}/images/staff/${selectedData.id}.${selectedData.img}`} alt="staff" style={{border: "1px solid black"}}></img> :
                    workshops.includes(selectedData.name) ? <div className="logo flex-c" style={selectedData.team ? teamColors[selectedData.team] : teamColors.default}><img className="phone-image" src={`https://${serverConfig.host}:${serverConfig.port}/images/phone.svg`} alt="phone"></img></div> :
                    <BlankProfile identifier="blank-picture" size="20vh" foregroundColor="#6B7F82" ></BlankProfile>}
                </div>
                <div className="staff-name">
                    <div className="name-update-container flex-c">
                        <p className="name-text">{selectedData.name}</p>
                        {!workshops.includes(selectedData.name) && user !== selectedData.name && <a href={emailAddress} className="email-link flex-c"><EmailIcon size="2.78vh" color="#BCE7FD"></EmailIcon></a>}
                    </div>
                    <p className="position">{selectedData.id !== '-' ? `${selectedData.hospital}, ${selectedData.position}` : "Biomed Location"}</p>
                </div>
            </div>            
            <div className="info-container">
                {selectedData.id !== "-" && <StaffInfoEntry heading="Staff ID" value={selectedData.id} Icon={StaffID} color="#5ef8ed" bColor="main"></StaffInfoEntry>}
                {!workshops.includes(selectedData.name) && <StaffInfoEntry heading="Computer" value={selectedData.hostname} Icon={Laptop} color="#BCE7FD" bColor="alternate"></StaffInfoEntry>}
                <StaffInfoEntry heading="Office Ph." value={selectedData.officePhone} Icon={OfficePhone} color="#5ef8ed" bColor="main"></StaffInfoEntry>
                {!workshops.includes(selectedData.name) && <StaffInfoEntry heading="Dect Ph." value={selectedData.dectPhone} Icon={DectPhone} color="#BCE7FD" bColor="alternate"></StaffInfoEntry>}
                {!workshops.includes(selectedData.name) && <StaffInfoEntry heading="Mobile 1" value={selectedData.workMobile} Icon={MobilePhone} color="#5ef8ed" bColor="main"></StaffInfoEntry>}
                {!workshops.includes(selectedData.name) && <StaffInfoEntry heading="Mobile 2" value={selectedData.personalMobile} Icon={MobilePhone} color="#BCE7FD" bColor="alternate"></StaffInfoEntry>}
            </div>
        </div>
    );
}

