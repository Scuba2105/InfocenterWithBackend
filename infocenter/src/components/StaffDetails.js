import useMediaQueries from "media-queries-in-react" ;

const workshops = ['Armidale BME', 'B.E.E.R.', 'Biomed Powerfail', 'ICU Workshop', 
    'New Maitland Storage', 'New Maitland Workshop', 'Tea Room', 'Triage'];

const teamColors = {Management: {background: 'radial-gradient(rgb(246, 193, 194), rgb(217, 95, 97))', 
border: '1px solid rgb(137, 44, 44)', color: 'rgb(137, 44, 44)'}, JHH: {background: 'radial-gradient(rgb(246, 193, 194), rgb(217, 95, 97))', 
border: '1px solid rgb(137, 44, 44)', color: 'rgb(137, 44, 44)'}, Hunter: {background: 'radial-gradient(rgb(193, 246, 222), rgb(49, 204, 150))', 
border: '1px solid rgb(4, 107, 71)', color: 'rgb(4, 107, 71)'}, Tamworth: {background: 'radial-gradient(rgb(153, 214, 247), rgb(33, 112, 191))', 
border: '1px solid rgb(2, 57, 87)', color: 'rgb(2, 57, 87)'}, Mechanical: {background: 'radial-gradient(rgb(217, 126, 247), rgb(166, 66, 199))', 
border: '1px solid rgb(73, 16, 92)', color: 'rgb(73, 16, 92)'}, default: {background: 'radial-gradient(rgb(250, 193, 112), rgb(250, 169, 55))', 
border: '1px solid rgb(163, 98, 3)', color: 'rgb(163, 98, 3)'}} 

export function StaffDetails({selectedData}) {
    
    const mediaQueries = useMediaQueries({
        laptop: "(max-width: 1250px)",
        desktop: "(min-width: 1800px)"
    });

    function getTextColor(team) {
        const colorString = teamColors[team].background.split(' rgb')[1];
        const rgb = colorString.substring(0, colorString.length - 1)
        return `rgb${rgb}`;

    }

    function getInitials(name, laptop) {
        console.log(name);
        if (!workshops.includes(name)) {
            const nameArray = name.split(' ');
            const initials = name === 'Mitchell Pacey' ? 'MJP' : name === 'Tome Tomev' ? 'TTT' : nameArray.map((word) => {
                return word[0];
            }).join('');
            return(initials);        
        }
        return (
            <img className={laptop === true ? "phone-image-laptop" : "phone-image-desktop"} src={`http://localhost:5000/images/phone.svg`} alt="phone"></img>
        );
    }
    
    return (
        <div className={mediaQueries.laptop === true ? 'staff-info-laptop' : 'staff-info-desktop'}>
            <div className={mediaQueries.laptop === true ? "staff-heading-laptop" : "staff-heading-desktop"}>
                <div className={mediaQueries.laptop === true ? "staff-logo-laptop" : "staff-logo-desktop"}>
                    <div className={mediaQueries.laptop === true ? "logo-laptop" : "logo-desktop"} style={selectedData.team ? teamColors[selectedData.team] : teamColors.default}>{getInitials(selectedData.name, mediaQueries.laptop)}</div>
                </div>
                <div className="staff-name">
                    <p className={mediaQueries.laptop === true ? "name-text-laptop" : "name-text-desktop"}>{selectedData.name}</p>
                    <p className={mediaQueries.laptop === true ? "position-laptop" : "position-desktop"} style={selectedData.id !== '-' ? {color: getTextColor(selectedData.team)} : {color: getTextColor("default")}}>{selectedData.id !== '-' ? `${selectedData.hospital}, ${selectedData.position}` : "Biomed Location"}</p>
                </div>
            </div>            
            <div className={mediaQueries.laptop ? "info-container-laptop" : "info-container-desktop"}>
                {selectedData.id !== "-" && <p>Staff ID: <span>{selectedData.id}</span></p>}
                {<p>Office Phone: <span>{selectedData.officePhone === "" ? "-" : selectedData.officePhone}</span></p>}
                {<p>Dect Phone: <span>{selectedData.dectPhone === '' ? "-" : selectedData.dectPhone}</span></p>}
                {<p>Work Mobile: <span>{selectedData.workMobile === '' ? "-" : selectedData.workMobile}</span></p>}
                {<p>Personal Mobile: <span>{selectedData.personalMobile === '' ? "-" : selectedData.personalMobile}</span></p>}
            </div>
        </div>
    );
}

