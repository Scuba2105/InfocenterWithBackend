import { menuOptions } from '../data.js';
import { AdminIcon, ContactsIcon, StaffIcon, TechnicalIcon, UtilitiesIcon } from '../svg.js';
import { useState } from 'react';

const imagelightColor = "#FF8C61";
const imageDarkColor = "rgb(128, 128, 129)";

export function Menu({page, onPageSelect}) {
   
  const [hoveredId, setHoveredId] = useState(null);

  function enterMenuIcon(optionID) {
    setHoveredId(optionID);
  }

  function leaveMenuIcon(e) {
    setHoveredId(null);
  }

  const menuList = menuOptions.map((option) => {
    const titleArray = option.title.split(' ')
    const titleLength = titleArray.length;
    return (
      <div key={option.id} id={option.id} className={option.id === page ? "menu-selected" : "menu-option"} onClick={() => onPageSelect(option.id)} onMouseEnter={() => enterMenuIcon(option.id)} onMouseLeave={leaveMenuIcon}>
        {option.id === 'staff' ? <StaffIcon key={option.id} color={option.id === hoveredId || option.id === page ? imagelightColor : imageDarkColor} /> : 
        option.id === 'technical-info' ? <TechnicalIcon key={option.id} color={option.id === hoveredId || option.id === page ? imagelightColor : imageDarkColor} /> :
        option.id === 'contacts' ? <ContactsIcon key={option.id} color={option.id === hoveredId || option.id === page ? imagelightColor : imageDarkColor} /> :
        option.id === 'admin' ? <AdminIcon key={option.id} color={option.id === hoveredId || option.id === page ? imagelightColor : imageDarkColor} /> :
        <UtilitiesIcon key={option.id} color={option.id === hoveredId || option.id === page ? imagelightColor : imageDarkColor} />
        }
        {titleLength === 1 ? <span>{option.title}</span> : 
        <>
          {titleArray.map((word, index) => {
            return <span key={index} className="menu-description">{word}</span>
          })}
        </>
        }
      </div>
    )
  });

  return (
    <div className="sidenav">
      {menuList}
    </div>
  );
};
