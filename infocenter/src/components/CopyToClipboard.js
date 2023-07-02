import { useState } from 'react'

export function ClipboardCopy({ copyText, identifier }) {
    const [isCopied, setIsCopied] = useState(false);
  
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
    function handleCopyClick() {
        
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
  
    return (
        <>
            {isCopied ? <span className={`copied-text${identifier}`} >Copied!</span> : <img src={`http://localhost:5000/images/copy.svg`} alt="copy" style={isCopied ? {opacity: 0} : {opacity: 1}} className={`copy-image${identifier}`} onClick={handleCopyClick}></img>}
        </>
    );
}