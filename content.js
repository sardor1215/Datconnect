let templateEmail = {subject: "", html: ""}
let accessToken = "";
let refreshToken = "";
let emailPr = "";
const readLocalStorage = async (key) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([key], function (result) {
      if (result[key] === undefined) {
        resolve(null);
      } else {
        resolve(result[key]);
      }
    });
  });
};
readLocalStorage("emailTemplate").then(val => {
  templateEmail = val;
}).catch(err => {
  console.log(err)
});

readLocalStorage("tokens").then(val => {
  if(val) {
    accessToken = val.accessToken;
    refreshToken = val.refreshToken;
    emailPr = val.email;
  }

});


document.addEventListener("visibilitychange", function() {
  if (document.visibilityState === "visible") {
    readLocalStorage("emailTemplate").then(val => {
      templateEmail = val;
    }).catch(err => {
      console.log(err)
    });
    readLocalStorage("tokens").then(val => {
      if(val) {
        accessToken = val.accessToken;
        refreshToken = val.refreshToken;
        emailPr = val.email;
      }
    });
  }
});

readLocalStorage("emailCheckBox").then(val => {
  if(!val || val.state) {
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(processNode);
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }
}).catch(e =>{
  console.log(e)
})

const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}/g;

const createButton = function(email, elem) {

  const container = document.createElement("div");
  container.className = "datconnect-actions";

  const copyButton = document.createElement("button");
  copyButton.className ="copyButton";
  copyButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!-- Font Awesome Pro 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) --><path d="M320 448v40c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24V120c0-13.255 10.745-24 24-24h72v296c0 30.879 25.121 56 56 56h168zm0-344V0H152c-13.255 0-24 10.745-24 24v368c0 13.255 10.745 24 24 24h272c13.255 0 24-10.745 24-24V128H344c-13.2 0-24-10.8-24-24zm120.971-31.029L375.029 7.029A24 24 0 0 0 358.059 0H352v96h96v-6.059a24 24 0 0 0-7.029-16.97z"/></svg>`;
  copyButton.onclick = (event) => {
    navigator.clipboard.writeText(email).then(() => {
      copyButton.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!-- Font Awesome Pro 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) --><path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"/></svg>`;
      setTimeout(() => {
        copyButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!-- Font Awesome Pro 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) --><path d="M320 448v40c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24V120c0-13.255 10.745-24 24-24h72v296c0 30.879 25.121 56 56 56h168zm0-344V0H152c-13.255 0-24 10.745-24 24v368c0 13.255 10.745 24 24 24h272c13.255 0 24-10.745 24-24V128H344c-13.2 0-24-10.8-24-24zm120.971-31.029L375.029 7.029A24 24 0 0 0 358.059 0H352v96h96v-6.059a24 24 0 0 0-7.029-16.97z"/></svg>`;
      }, 1000);
    })
  }


  const sendButton = document.createElement("button");
  sendButton.className ="sendButtonEmail";
  sendButton.title = "Send Email"
  sendButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!-- Font Awesome Pro 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) --><path d="M502.3 190.8c3.9-3.1 9.7-.2 9.7 4.7V400c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V195.6c0-5 5.7-7.8 9.7-4.7 22.4 17.4 52.1 39.5 154.1 113.6 21.1 15.4 56.7 47.8 92.2 47.6 35.7.3 72-32.8 92.3-47.6 102-74.1 131.6-96.3 154-113.7zM256 320c23.2.4 56.6-29.2 73.4-41.4 132.7-96.3 142.8-104.7 173.4-128.7 5.8-4.5 9.2-11.5 9.2-18.9v-19c0-26.5-21.5-48-48-48H48C21.5 64 0 85.5 0 112v19c0 7.4 3.4 14.3 9.2 18.9 30.6 23.9 40.7 32.4 173.4 128.7 16.8 12.2 50.2 41.8 73.4 41.4z"/></svg>`;

  sendButton.onclick = (event) => {
    clickSendButton(event, elem, email, sendButton);
  }
  container.style.display = "none";

  container.append(copyButton)
  container.append(sendButton);

  if(elem.className === "trackLink") {
    elem.parentElement.parentElement.parentElement.addEventListener("mouseover", function () {
      const bts = elem.parentElement.getElementsByClassName("datconnect-actions");
        if(bts.length > 0) {
          bts[0].style.display = "block";
          try {
            bts[1].style.display = "block";
          } catch (e) {

          }
        }
    })

    elem.parentElement.parentElement.parentElement.addEventListener("mouseout", function () {
      const bts = elem.parentElement.getElementsByClassName("datconnect-actions");
      if(bts.length > 0) {
        const buttons = bts[0].getElementsByClassName("sendButtonEmail");
        if(buttons[0].title!=="loading")
        {
          bts[0].style.display = "none";
          try {
            bts[1].style.display = "none";
          } catch (e) {

          }
        }
      }
    })
  } else {
    elem.parentElement.parentElement.addEventListener("mouseover", function () {
      const bts = elem.parentElement.getElementsByClassName("datconnect-actions");

      if(!elem.parentElement.parentElement.parentElement.className.includes("iscanceledmatch"))
        if(bts.length > 0) {
          bts[0].style.display = "block";
          try {
            bts[1].style.display = "block";
          } catch (e) {

          }
        }
    })
    elem.parentElement.parentElement.addEventListener("mouseout", function () {
      const bts = elem.parentElement.getElementsByClassName("datconnect-actions");
      if(bts.length > 0) {
        const buttons = bts[0].getElementsByClassName("sendButtonEmail");
        if(buttons[0].title!=="loading")
        {
          bts[0].style.display = "none";
          try {
            bts[1].style.display = "none";
          } catch (e) {

          }
        }
      }
    })
  }






  return container;
};

const processTextNode = function(textNode) {
  let match;
  while ((match = emailRegex.exec(textNode.textContent)) !== null) {
    if (!textNode.parentNode.querySelector("button")) {
      const br = document.createElement('br');

      textNode.parentNode.parentElement.style.position = "relative";


      textNode.parentNode.parentElement.insertBefore(createButton(match[0],textNode.parentNode), textNode.parentNode);

    }
  }
};

const processNode = function(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    processTextNode(node);
  } else {
    const textNodes = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);
    while (textNodes.nextNode()) {
      processTextNode(textNodes.currentNode);
    }
  }
};


function clickSendButton(event, elem, email, button) {
  event.preventDefault();
  if(elem.className === 'trackLink') {
    sendEmail(elem.parentElement.parentElement, email, button);
  } else {
    sendEmail(elem.parentElement.parentElement.parentElement.parentElement, email, button);
  }


}


async function sendEmail(tagData, email, button) {

  button.innerHTML = `<svg class="datconnect-loading" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!-- Font Awesome Pro 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) --><path d="M304 48c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48 48 21.49 48 48zm-48 368c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zm208-208c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zM96 256c0-26.51-21.49-48-48-48S0 229.49 0 256s21.49 48 48 48 48-21.49 48-48zm12.922 99.078c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.491-48-48-48zm294.156 0c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.49-48-48-48zM108.922 60.922c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.491-48-48-48z"/></svg>`;
  button.title = 'loading';

  const els = button.parentElement.parentElement.getElementsByClassName("datconnect-actions");

  const data = await chrome.storage.local.get("tokens");

  if(data.tokens && data.tokens.accessToken && data.tokens.refreshToken) {
    await new Promise(r => setTimeout(r, 2000));
    var js = {};
    ss = tagData;
    js = {age: ss.getElementsByClassName('age')[0].innerText, ...js}
    js = {avail: ss.getElementsByClassName('avail')[0].innerText, ...js}
    js = {truck: ss.getElementsByClassName('truck')[0].innerText, ...js}
    js = {fp: ss.getElementsByClassName('fp')[0].innerText, ...js}
    js = {do: ss.getElementsByClassName('do')[0].innerText, ...js}
    js = {origin: ss.getElementsByClassName('origin')[0].innerText, ...js}
    js = {dest: ss.getElementsByClassName('dest')[0].innerText, ...js}
    js = {email: email, ...js}
    js = {rate: ss.getElementsByClassName('rate')[0].innerText, ...js}

    try {
      js = {ref: ss.getElementsByClassName('refId')[0].innerText, ...js}
    } catch (e) {
      try {
        js = {ref: ss.parentElement.getElementsByClassName('refId')[0].innerText, ...js}
      } catch (e1) {
        js = {ref: "", ...js}
      }
    }


    console.log(js)
    const readySubject = templateEmail.subject
        .replace("{{age}}", js.age)
        .replace("{{avail}}", js.avail)
        .replace("{{truck}}", js.truck)
        .replace("{{fp}}", js.fp)
        .replace("{{do}}", js.do)
        .replace("{{origin}}", js.origin)
        .replace("{{dest}}", js.dest)
        .replace("{{email}}", js.email)
        .replace("{{rate}}", js.rate)
        .replace("{{ref}}", js.ref);

    const readyBody = templateEmail.html
        .replace("{{age}}", js.age)
        .replace("{{avail}}", js.avail)
        .replace("{{truck}}", js.truck)
        .replace("{{fp}}", js.fp)
        .replace("{{do}}", js.do)
        .replace("{{origin}}", js.origin)
        .replace("{{dest}}", js.dest)
        .replace("{{email}}", js.email)
        .replace("{{rate}}", js.rate)
        .replace("{{ref}}", js.ref);

   const toEmail = js.email;

    console.log(readySubject, readyBody, toEmail)
    const status = await sendEmailApi(toEmail, readySubject, readyBody);
    if(status === 201) {
      button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!-- Font Awesome Pro 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) --><path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"/></svg>`
      button.title = "Sent"
      setTimeout(()=> {
        els[0].style.display="none";
        try {
          els[1].style.display="none";
        } catch (e) {

        }
      }, 1000);
    } else if(status === 401) {
      button.innerHTML = 'unauthorized';
      button.style.backgroundColor = '#8B0000';
      els[0].style.display="none";
      button.title =  'unathorized';
      try {
        els[1].style.display="none";
      } catch (e) {

      }

      window.open('https://datconnect.carrierify.com/auth-intro', "_blank");
    }
    else if(status === 409) {
      button.innerHTML = 'verify';
      button.style.backgroundColor = '#8B0000';
      els[0].style.display="none";
      button.title =  'unathorized';
      try {
        els[1].style.display="none";
      } catch (e) {

      }

      window.open('https://datconnect.carrierify.com/auth-verify', "_blank");
    }
    else if(status === 501) {
      button.innerHTML = 'recharge';
      button.style.backgroundColor = '#8B0000';
      button.title = 'recharge'
      els[0].style.display="none";
      try {
        els[1].style.display="none";
      } catch (e) {

      }

      try {
        chrome.runtime.sendMessage({data: {
            key: "filterCheckBox",
            state:  false
          }});

        chrome.runtime.sendMessage({data: {
            key: "rpmCheckBox",
            state:  false
          }});

        chrome.runtime.sendMessage({data: {
            key: "mapCheckBox",
            state:  false
          }});
      } catch (e) {

      }
      window.open('https://datconnect.carrierify.com/pricing?email='+emailPr, "_blank");

    }

    else {
      button.innerHTML = 'error';
      button.style.backgroundColor = '#8B0000';
      button.title = 'error'
      els[0].style.display="none";
      try {
        els[1].style.display="none";
      } catch (e) {

      }
    }





  } else {
    button.innerHTML = 'unauthorized';
    button.title = 'unauthorized'
    button.style.backgroundColor = '#8B0000';
    els[0].style.display="none";
    try {
      els[1].style.display="none";
    } catch (e) {

    }
    window.open('https://datconnect.carrierify.com/auth-intro', "_blank");
  }


}


async function sendEmailApi(to, subject, html) {

  let activeEmail = await readLocalStorage("activeEmail");

  let resp = await fetch("https://api.carrierify.com/email/send",
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({to, subject, html, fromEmail: activeEmail})
      });

  if(resp.status === 401)  {
    const resp2 = await fetch("https://api.carrierify.com/auth/refresh?refreshToken=" + refreshToken,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        });


    if(resp2 === 200) {
      accessToken = resp2.accessToken;
      refreshToken = resp2.refreshToken;
      chrome.runtime.sendMessage({data: {
          key: "tokens-store",
          accessToken: accessToken,
          refreshToken: refreshToken
        }});

      resp = await fetch("https://api.carrierify.com/email/send",
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({to, subject, html})
          });
    } else {
      return 401;
    }

  }

  return resp.status;
}
