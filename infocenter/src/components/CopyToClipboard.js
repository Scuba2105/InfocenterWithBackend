import { useState } from 'react'
import { serverConfig } from '../server';

// Copy text to clipboard
async function copyTextToClipboard(text) {
  if ('clipboard' in navigator) {
    return await navigator.clipboard.writeText(text);
  } 
  else {
    return document.execCommand('copy', true, text);
  }
}

// onClick handler function for the copy button
function handleCopyClick(copyTextToClipboard, copyText) {
        
  // Asynchronously call copyTextToClipboard
   copyTextToClipboard(copyText)
     .then(() => {
       // If successful, update the isCopied state value
       setIsCopied(true);
       setTimeout(() => {
         setIsCopied(false);
       }, 1500);
     })
     .catch((err) => {
       console.log(err);
     });
}

export function ClipboardCopy({ copyText, identifier }) {
    const [isCopied, setIsCopied] = useState(false);
  
    return (
        <>
            {isCopied ? <span className={`copied-text${identifier}`} >Copied!</span> : <img src={`http://${serverConfig.host}:${serverConfig.port}/images/copy.svg`} alt="copy" style={isCopied ? {opacity: 0} : {opacity: 1}} className={copyText === "N/A" ? "hidden" : `copy-image${identifier}`} onClick={() => handleCopyClick(copyTextToClipboard, copyText)}></img>}
        </>
    );
}