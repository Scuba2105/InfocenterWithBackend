import { useState } from 'react'
import { CopyIcon } from '../svg';

// Copy text to clipboard
async function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    return document.execCommand('copy', true, text);
  }
  else {
    return await navigator.clipboard.writeText(text);
  } 
}

// onClick handler function for the copy button
function handleCopyClick(copyTextToClipboard, copyText, setIsCopied, setHovered) {
        
  // Asynchronously call copyTextToClipboard
   copyTextToClipboard(copyText)
     .then(() => {
       // If successful, update the isCopied state value
       setIsCopied(true);
       setTimeout(() => {
         setIsCopied(false)
         setHovered(false)
       }, 1500);
     })
     .catch((err) => {
       console.log(err);
     });
}

function handleHover(setHovered) {
  setHovered(true);
}

function handleMouseOut(setHovered) {
  setHovered(false);
}

export function ClipboardCopy({ copyText, identifier }) {
    const [isCopied, setIsCopied] = useState(false);
    const [hovered, setHovered] = useState(false);
  
    return (
        <>
            {isCopied ? <span className="copied-text" >Copied!</span> : <CopyIcon color={hovered ? "#5ef8ed" : "#BCE7FD"} size="20px" identifier={copyText === "N/A" ? "hidden" : "copy-image"}  onClick={() => handleCopyClick(copyTextToClipboard, copyText, setIsCopied, setHovered)} onMouseOver={() => handleHover(setHovered)} onMouseOut={() => handleMouseOut(setHovered)} isCopied={isCopied} />}
        </>
    );
}