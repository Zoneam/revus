chrome.runtime.onInstalled.addListener((()=>{console.log("Extension installed")})),chrome.runtime.onMessage.addListener(((e,n,o)=>{"openPopup"===e.action&&(chrome.action.openPopup(),o({success:!0}))}));