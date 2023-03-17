function getQueryByName(name) {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get(name);
}

function storeTokens() {
    
    const accessToken = getQueryByName("accessToken");
    const refreshToken = getQueryByName("refreshToken");
    const email = getQueryByName("email");
    if(accessToken && refreshToken) {
        chrome.runtime.sendMessage({data: {
            key: "tokens-store",
            accessToken: accessToken,
            refreshToken: refreshToken,
                email: email
        }});
    }
}



storeTokens();
try{
    document.getElementById("saveEmailTemplateButton").addEventListener("click", chromeStoreSave);
}
catch(err){

    }


function chromeStoreSave() {
    console.log('11')
    const subject = document.getElementById("chEmailSubject").value;
    const emailBody = document.getElementById("chEmailBody").innerHTML;

    console.log(subject);
    console.log(emailBody);
    if(subject!== "" && emailBody!=="") {
        chrome.runtime.sendMessage({data: {
            key: "store-template",
            subject: subject,
            html: emailBody
        }});
    }

 
}




