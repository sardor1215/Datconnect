Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}
let accessToken;
let refreshToken;
let emails = 0;
let email;
let templateEmail;
const features = [];
var rand = function() {
return Math.random().toString(36).substr(2); // remove `0.`
};

var token = function() {
return rand() + rand() + "-" + rand() + rand() + "-" + rand() + rand(); // to make it longer
};

function handleSignInClick() {

    const extensionToken = token();

    chrome.storage.local.set({"extensionToken": extensionToken});
    
    window.open('https://datconnect.carrierify.com/auth?extensionToken='+extensionToken, "_blank");

}
document.getElementById("clickSigIn").addEventListener('click',handleSignInClick)
document.getElementById("logout").addEventListener('click', logout);
document.getElementById("emailSend").addEventListener('submit', emailSendTestBtn);

document.getElementById("emailEdit2").addEventListener("click", emailEdit);

document.getElementById("filterCheckBox").addEventListener("change", filterCheckBoxChange);
document.getElementById("emailCheckBox").addEventListener("change", emailCheckBoxChange);
document.getElementById("rpmCheckBox").addEventListener("change", rpmCheckBoxChange);
document.getElementById("mapCheckBox").addEventListener("change", mapCheckBoxChange);
document.getElementById("signclink").addEventListener("click", signLink)
document.getElementById("emailLinkButton").addEventListener("click", sendLink);
document.getElementById("accounts-tab").addEventListener("click", accountsFetch);
document.getElementById("createAccountBtn").addEventListener("click", createAccount);

document.getElementById("clickAddSigIn").addEventListener('click',handleAddingAccountSignInClick)
document.getElementById("smtpConnect").addEventListener("click", addSmtpAccount);

async function addSmtpAccount(){
    const smtpEmail = document.getElementById("smtpEmail").value;
    const smtpPass = document.getElementById("smtpPass").value;
    const smtpHost = document.getElementById("smtpHost").value;
    const smtpPort = document.getElementById("smtpPort").value;
    document.getElementById("waitCreateAccount").hidden = false;
    document.getElementById("addNewAccountBox").hidden = true;

    try {
        fetch("https://api.carrierify.com/account",
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    type: 'SMTP',
                    email: smtpEmail,
                    smtpServerHost: smtpHost,
                    smtpServerPort: smtpPort,
                    smtpEncryptionMethod: 'STARTTSL',
                    smtpPassword: smtpPass,
                })
            }).then(value => {
            if (value.status ===201) {
                document.getElementById("waitCreateAccount").hidden = true;
                document.getElementById("addNewAccountBox").hidden = true;
                document.getElementById("accountList").hidden = false;
            } else {
                document.getElementById("waitCreateAccount").hidden = true;
                document.getElementById("addNewAccountBox").hidden = false;
                alert("Seems username or password incorrect!!")
            }
        })
    } catch (e) {
        document.getElementById("waitCreateAccount").hidden = true;
        document.getElementById("addNewAccountBox").hidden = false;
        alert("Seems username or password incorrect!!")
    }





}


function handleAddingAccountSignInClick() {



    window.open('https://api.carrierify.com/account/google?accessToken='+accessToken, "_blank");

}

function createAccount(rr = true) {
    if(!features.includes("multipleAccounts") && rr){
        return
    }
    document.getElementById("accountList").hidden = true;
    document.getElementById("addNewAccountBox").hidden = false;
}


function accountsFetch() {

    document.getElementById("waitCreateAccount").hidden = true;
    document.getElementById("addNewAccountBox").hidden = true;
    document.getElementById("accountList").hidden = false;



    fetch("https://api.carrierify.com/account",
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
        }).then(async resp => {
            const data = await resp.json()
        addAccounts(data)

    })
}






async function addAccounts(accounts) {
    if(!features.includes("multipleAccounts")){
        accounts = accounts.filter(e => e.email === email);
    }


    let activeEmail = await readLocalStorage("activeEmail");
    if(!activeEmail && !accounts.map(e => e.email).includes(activeEmail)){
        chrome.storage.local.set({"activeEmail": email})
        activeEmail = email;
    }


    let sum = '';
    let ff = false;
    for(const account of accounts) {
        if(!ff) {
            ff = account.verified && account.email === activeEmail;
        }

        const li = `<li class="list-group-item pt-2">
                                            <input  id="accountId-${account.id}" class="form-check-input me-1" type="radio" name="listAccount" value="">
                                            <label id="accountLabel" class="form-check-label" for="accountId-${account.id}">${account.email}</label>
                                              <a id="del-${account.id}" hidden style="margin-left: 4px"  class="float-end">
                                            <svg width="15px" height="15px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!-- Font Awesome Pro 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) --><path d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z"/></svg>
                                        </a>
                                            ${account.verified ? '<a class="float-end btn btn-sm btn-outline-success">verified</a>' :
            '<a id="verify-' + account.id +'" class="float-end btn btn-sm btn-warning">Verify</a>'}
                                            
                                     

                                        </li>`;

        sum+=li;
    }

    document.getElementById("accountsBox").innerHTML = sum;

    for(const account of accounts) {
        console.log(activeEmail)
        document.getElementById("accountId-"+account.id).checked = (account.email === activeEmail && account.verified) || (!ff && account.verified);
        document.getElementById("accountId-"+account.id).disabled = !account.verified;

        if(!accounts.filter(e => e.email && e.verified === true).includes(activeEmail))
        if(account.verified && !ff) {
            chrome.storage.local.set({"activeEmail": email})
        }

        if(!account.verified) {
            document.getElementById("verify-"+account.id).addEventListener("click", function () {

                document.getElementById("smtpEmail").value = account.email;
                createAccount(false)
            })
        }
        if(account.email !== email && account.email !== activeEmail) {
            document.getElementById("del-"+account.id).hidden = false;
            document.getElementById("del-"+account.id).addEventListener("click", function () {
                fetch("https://api.carrierify.com/account?accountId="+account.id, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    }
                }).then(value => {
                    value.json().then(d => addAccounts(d))
                })
            })
        }

        document.getElementById("accountId-"+account.id).addEventListener("click", function () {
            if(document.getElementById("accountId-"+account.id).checked) {
                chrome.storage.local.set({"activeEmail": account.email})
                document.getElementById("del-"+account.id).hidden = true;
            }
        })


    }



}

function sendLink(e) {
    e.preventDefault()
    document.getElementById("login").hidden = true;
    document.getElementById("signlinkview").hidden = true;
    document.getElementById("loader").hidden = false;
    const value = document.getElementById("emailLink").value;
    fetch("https://api.carrierify.com/auth/tokenLink", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
       },
        body: JSON.stringify({email: value}),
    })

    setTimeout(function (){

        document.getElementById("loader").hidden = true;
        document.getElementById("checkInbox").hidden = false;
    }, 1000)
}

function signLink(e) {
    e.preventDefault();

    document.getElementById("login").hidden = true;
    document.getElementById("signlinkview").hidden = false;

}



function filterCheckBoxChange(event) {
    chrome.runtime.sendMessage({data: {
            key: "filterCheckBox",
            state:  event.target.checked
        }});
}
function emailCheckBoxChange(event) {
    chrome.runtime.sendMessage({data: {
            key: "emailCheckBox",
            state:  event.target.checked
        }});
}

function rpmCheckBoxChange(event) {
    chrome.runtime.sendMessage({data: {
            key: "rpmCheckBox",
            state:  event.target.checked
        }});
}

function mapCheckBoxChange(event) {
    chrome.runtime.sendMessage({data: {
            key: "mapCheckBox",
            state:  event.target.checked
        }});
}


async function emailEdit() {
    templateEmail = await getEmailTemplate();
  const url = "https://datconnect.carrierify.com/email-editor?subject=" + b64EncodeUnicode(templateEmail.subject)
   + "&html=" + b64EncodeUnicode(templateEmail.html);
   window.open(url, "_blank");
}

load();
function load() {
  chrome.storage.local.get(['tokens'], function(result) {
    const tokens = result.tokens;
    if(!tokens)
     {
      logout();
       }
    else if(tokens.accessToken && tokens.refreshToken) {
       accessToken = tokens.accessToken;
       refreshToken = tokens.refreshToken;
      fetch("https://api.carrierify.com/users/me", 
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        }).then(resp => {
          if(resp.status === 200) {
            resp.json().then(data => {
              email = data.email;

                document.getElementById("pricingId").href="https://datconnect.carrierify.com/pricing?email="+email;
              emails = data.emails;
              features.slice(0, features.length);
              features.push(...data.features);
            console.log(features)
                console.log(data)
              authenticatedView()
            }).catch(err => {
              console.log(err);
            });
          } else if(resp.status === 401){
  
            fetch("https://api.carrierify.com/auth/refresh?refreshToken=" + refreshToken, 
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
              },
            }).then(val => {
              if(val.status === 200) {
                val.json().then(data => {
                  email = data.email;
                  emails = data.emails;
                  accessToken = data.accessToken;
                  refreshToken = data.refreshToken;
                    features.slice(0, features.length);
                    features.push(...data.features);
                  chrome.runtime.sendMessage({data: {
                    key: "tokens-store",
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                          features: features
                }});
                  authenticatedView()
                }).catch(err => {
                  console.log(err);
                });
              } else if(resp.status === 401){
                  logout();
  
              }
            })
  
  
              console.log('aaaa')
          }
         
        }).catch(err => {
          console.log(err)
        })
    }
  });
}

function b64EncodeUnicode(str) {
  return Base64.encodeURI(str);
}

async function templateAdded(event) {
    const intext = document.getElementById("templateInput").value;
    console.log(intext);
    readLocalStorage("multipleTempl").then(value => {
        const obj = {
            id: token(),
            title: intext, html: 'ex body ' + intext, subject: 'ex subject ' + intext,
            active: true};

        document.getElementById("emailSubject").textContent = obj.subject
        document.getElementById("emailHtml").innerHTML = obj.html;

        console.log(value)

        if(value === null) {
            chrome.storage.local.set( {
                "multipleTempl": {arr: [
                , obj
            ]}
            });

        } else {
            const list = value.arr.filter(t => t !== null);
            list.map(e => {e.active = false; return e});
            list.push(obj);
            chrome.storage.local.set({"multipleTempl": {arr: list}})
        }

        chrome.runtime.sendMessage({data: {
                key: "store-template",
                subject:   obj.subject,
                html: obj.html
            }});

      getEmailTemplate().then(val => {
          templateEmail = val;
      });
    })
    document.getElementById("createTemplateBtn").disabled = false;

}

async function addFormTemplate() {
    document.getElementById("createTemplateBtn").disabled = true;
    const form = '' +
        '                                    <li class="list-group-item">\n' +
        '                                        <input class="form-check-input me-1" type="radio" name="listGroupRadio" value="">\n' +
        '                                        <label class="form-check-label" for="firstRadio"></label>\n' +
        '                                        <form style="display: grid" >\n' +
        '                                            <input required id="templateInput" class="form-control-sm" type="text" placeholder="Name of template">\n' +
        '                                            <button id="saveTempl"  type="submit" class="mt-2 float-end btn btn-success btn-sm position-relative">\n' +
        '                                                Save\n' +
        '                                            </button>\n' +
        '                                        </form>\n' +
        '                                    </li>\n' +
        '';

    const div = document.createElement("ul");
    div.className = "list-group";

    div.innerHTML = form;


    const container = document.getElementById("multipleTemplate");
    container.append(div)
    document.getElementById("saveTempl")
        .addEventListener("click", templateAdded);

}

async function defTemplate() {

    console.log('44')
    readLocalStorage("multipleTempl").then(value => {
        const arr = value.arr;
        arr.map(e => {
            e.active = false;
            const del = document.getElementById("del"+e.id);
            del.hidden = e.active;
            return e;
        })
         chrome.storage.local.set({"multipleTempl": {arr}})

        readLocalStorage("defEmailTemplate").then(val => {
            document.getElementById("emailSubject").textContent = val.subject
            document.getElementById("emailHtml").innerHTML = val.html;
            chrome.runtime.sendMessage({data: {
                    key: "store-template",
                    subject:   val.subject,
                    html: val.html
                }});
        })
    })

    templateEmail = await getEmailTemplate();

}

async function removeTempl(id) {
    console.log(id)

    readLocalStorage("multipleTempl").then(value => {
        if (value === null || value.arr == null)
            return;


        const arr = value.arr.filter(e => e.id !== id);
        chrome.storage.local.set({"multipleTempl": {arr}})

        document.getElementById("ul"+id).remove();


    });



}
async function multiplesTemplates() {
    document.getElementById("multipleTemplateBox").hidden = false;
    const btn = document.getElementById("createTemplateBtn");
    btn.addEventListener("click", addFormTemplate);
    document.getElementById("defaultTemplID").addEventListener("click", defTemplate)

    readLocalStorage("multipleTempl").then(value => {
        console.log(value)
        if(value===null)
            return;

        const arr = value.arr.filter( r => r!==null);

        arr.forEach(e => {
            const ppp = `
                                    <li class="list-group-item">
                                        <input class="form-check-input me-1" type="radio" name="listGroupRadio"  value=""
                                        id='${e.id}'
                                        > 
                                        <label class="form-check-label" for="firstRadio">${e.title}</label>
                                        <a id="del${e.id}" hidden class="float-end">
                                            <svg width="15px" height="15px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!-- Font Awesome Pro 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) --><path d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z"/></svg>
                                        </a>
                                        
                                    </li>
                              `;


            if(document.getElementById(e.id)) {
                return;
            }


            const div = document.createElement("ul");
            div.id = 'ul'+e.id;
            div.className = "list-group";
            div.innerHTML = ppp;

            document.getElementById("multipleTemplate")
                .append(div);
            const li = document.getElementById(e.id);

            li.addEventListener("click", event => radioClick(event, e.id));
            li.checked = e.active;

            const del = document.getElementById("del"+e.id);
            del.hidden = e.active;
            del.addEventListener("click", function () {
                removeTempl(e.id)
            });


        })

    })


}

async function radioClick(event, id) {
    console.log('344')
   readLocalStorage("multipleTempl").then(value => {
       const arr = value.arr;
       arr.map(e => {
           e.active = e.id === id;

               const del = document.getElementById("del"+e.id);
               del.hidden = e.active;

           return e;
       })
       chrome.storage.local.set({"multipleTempl": {arr}})

        const elem = arr.filter(e => e.id === id)[0];

       document.getElementById("emailSubject").textContent = elem.subject
       document.getElementById("emailHtml").innerHTML = elem.html;
       chrome.runtime.sendMessage({data: {
               key: "store-template",
               subject:  elem.subject,
               html: elem.html
           }});
   })
    templateEmail = await getEmailTemplate();
}


async function authenticatedView() {

  templateEmail = await getEmailTemplate();
  document.getElementById("emailSubject").textContent = templateEmail.subject
  document.getElementById("emailHtml").innerHTML = templateEmail.html;

  document.getElementById("loader").hidden = true;
  document.getElementById("login").hidden = true;
  document.getElementById("authenticated").hidden = false;
  document.getElementById("emailField").textContent = email;
  document.getElementById("emailsField").textContent = emails;
  document.getElementById("emailInput").placeholder = email;


  initFeatures();
  if(features.includes("multipleTempl")) {
      multiplesTemplates()
  }
}

async function initFeatures() {
    const state = await readLocalStorage("emailCheckBox");
    if(state) {
        document.getElementById("emailCheckBox").checked = state.state;
    } else {
        chrome.runtime.sendMessage({data: {
                key: "emailCheckBox",
                state:  true
            }});

        document.getElementById("emailCheckBox").checked = true;
    }

    if (features.includes("email")) {
        document.getElementById("emailsField").textContent = "unlimited"
    }



    if(features.includes("filters")) {
        document.getElementById("filterCheckBox").disabled = false;
        const state = await readLocalStorage("filterCheckBox");
        if(state) {
            document.getElementById("filterCheckBox").checked = state.state;
        }
    } else {
        chrome.runtime.sendMessage({data: {
                key: "filterCheckBox",
                state:  false
            }});
    }

    if(features.includes("rpm")) {
        document.getElementById("rpmCheckBox").disabled = false;
        const state = await readLocalStorage("rpmCheckBox");
        if(state) {
            document.getElementById("rpmCheckBox").checked = state.state;
        }
    } else {
        chrome.runtime.sendMessage({data: {
                key: "rpmCheckBox",
                state:  false
            }});
    }

    if(features.includes("map")) {
        document.getElementById("mapCheckBox").disabled = false;
        const state = await readLocalStorage("mapCheckBox");
        if(state) {
            document.getElementById("mapCheckBox").checked = state.state;
        }
    } else {
        chrome.runtime.sendMessage({data: {
                key: "mapCheckBox",
                state:  false
            }});
    }
}

async function signInView() {
  document.getElementById("loader").hidden = true;
  document.getElementById("login").hidden = false;
  document.getElementById("authenticated").hidden = true;
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
  
}
async function loadingView() {
  document.getElementById("loader").hidden = false;
  document.getElementById("login").hidden = true;
  document.getElementById("authenticated").hidden = true;
}

async function getEmailTemplate() {
  
   let template = await readLocalStorage("emailTemplate");
   if(!template){
        await chrome.runtime.sendMessage({data: {
                      key: "default-template"}});
        template = await readLocalStorage("emailTemplate");
   }
   return template;
}




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






async function logout(){
  accessToken = null;
  refreshToken = null;
  chrome.storage.local.remove(["tokens","extensionToken","activeEmail"]);
  signInView();
}


async function emailSendTestBtn(event) {
  event.preventDefault();
    templateEmail = await getEmailTemplate();
  loadingView();
  let toEmail = document.getElementById("emailInput").value;
  if(toEmail === "")
    toEmail = email;
  /// bind test data
  await sendEmail(toEmail, replaceVals(templateEmail.subject), replaceVals(templateEmail.html));
  load();
}

function replaceVals(str){
  return str.replace("{{origin}}", "Leitchfield, KY")
      .replace("{{dest}}", "Salt Lake City, UT")
      .replace("{{ref}}", "288751P")
      .replace("{{age}}", "00:14")
      .replace("{{avail}}", "01/24")
      .replace("{{truck}}", "V")
      .replace("{{fp}}", "R")
      .replace("{{do}}", "118" )
      .replace("{{email}}", "crteam@fwf.com")
      .replace("{{rate}}", "$4,000.00")
}



async function sendEmail(to, subject, html) {
    const activeEmail = await readLocalStorage("activeEmail");
  const resp = await fetch("https://api.carrierify.com/email/send", 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({to, subject, html, fromEmail: activeEmail})
      }); 
}

async function defaultEmailTemplate() {
    const  data = {subject: "Load from {{origin}} to {{dest}}",
        html: `<p>Hello, team!<br><br>Can we get more info pls about the load from Leitchfield, KY to Salt Lake City, UT which is available at 01/24 &nbsp;and what is the best rate?</p><p>&nbsp;</p><p>Email send via DATconnect,</p><p>if you want change click <a href="https://datconnect.carrierify.com/email-editor?subject=TG9hZCBmcm9tIHt7b3JpZ2lufX0gdG8ge3tkZXN0fX0&amp;html=PHA-SGVsbG8sIHRlYW0hPGJyPjxicj5DYW4gd2UgZ2V0IG1vcmUgaW5mbyBwbHMgYWJvdXQgdGhlIGxvYWQgZnJvbSB7e29yaWdpbn19IHRvIHt7ZGVzdH19IHdoaWNoIGlzIGF2YWlsYWJsZSBhdCB7e2F2YWlsfX0gJm5ic3A7YW5kIHdoYXQgaXMgdGhlIGJlc3QgcmF0ZT88YnI-PGJyPk1DOiAwMDAwMDxicj5EaXNwYXRjaCBUZWFtIGF0Jm5ic3A7PHN0cm9uZz5DYXJyaWVyaWZ5PC9zdHJvbmc-PGJyPkFsZXggRGFuaWVsPGJyPk51bWJlcjogKzEyMzQ1Njc4OTAxMjM8L3A-">here</a></p><p>&nbsp;</p><p>powered by <a href="https://datconnect.carrierify.com/">DATconnect</a><br><br>&nbsp;</p>`};
    chrome.storage.local.set({"emailTemplate": data});
    return data;
}