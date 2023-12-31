import { menuOptions } from '../data.js';
import { AdminIcon, ContactsIcon, StaffIcon, TechnicalIcon, UtilitiesIcon, OnCallIcon, FormsTemplatesIcon } from '../svg.js';
import { useState } from 'react';

const imagelightColor = "#BCE7FD";
const imageDarkColor = "rgb(97, 97, 97)";

function enterMenuIcon(optionID, setHoveredId) {
  setHoveredId(optionID);
}

function leaveMenuIcon(setHoveredId) {
  setHoveredId(null);
}

export function Menu({page, onPageSelect}) {
   
  const [hoveredId, setHoveredId] = useState(null);

  const menuList = menuOptions.map((option) => {
    const titleArray = option.title.split(' ')
    const titleLength = titleArray.length;
    return (
      <div key={option.id} id={option.id} className={option.id === page ? "menu-selected flex-c-col" : "menu-option flex-c-col"} onClick={() => onPageSelect(option.id)} onMouseEnter={() => enterMenuIcon(option.id, setHoveredId)} onMouseLeave={() => leaveMenuIcon(setHoveredId)}>
        {option.id === 'staff' ? <StaffIcon key={option.id} color={option.id === hoveredId || option.id === page ? imagelightColor : imageDarkColor} /> : 
        option.id === 'technical-info' ? <TechnicalIcon key={option.id} color={option.id === hoveredId || option.id === page ? imagelightColor : imageDarkColor} /> :
        option.id === 'contacts' ? <ContactsIcon key={option.id} color={option.id === hoveredId || option.id === page ? imagelightColor : imageDarkColor} /> :
        option.id === 'admin' ? <AdminIcon key={option.id} color={option.id === hoveredId || option.id === page ? imagelightColor : imageDarkColor} /> :
        option.id === 'on-call' ? <OnCallIcon key={option.id} color={option.id === hoveredId || option.id === page ? imagelightColor : imageDarkColor} /> :
        option.id === 'admin' ? <AdminIcon key={option.id} color={option.id === hoveredId || option.id === page ? imagelightColor : imageDarkColor} /> :
        option.id === 'forms-templates' ? <FormsTemplatesIcon key={option.id} color={option.id === hoveredId || option.id === page ? imagelightColor : imageDarkColor} /> :
        <UtilitiesIcon key={option.id} color={option.id === hoveredId || option.id === page ? imagelightColor : imageDarkColor} />
        }
        {titleLength === 1 ? <span className="menu-label">{option.title}</span> : 
        <>
          {titleArray.map((word, index) => {
            return <span key={index} className="menu-label">{word}</span>
          })}
        </>
        }
      </div>
    )
  });

  return (
    <div className="sidenav flex-c-col">
      {menuList}
    </div>
  );
};
