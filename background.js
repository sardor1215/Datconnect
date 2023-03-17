chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {

        if(request?.data) {
            
       
        if(request.data.key === "tokens-store") {
            storeTokens(request);
            defaultEmailTemplate();
        }

        //default-template
        if(request.data.key === "default-template") {
            defaultEmailTemplate();
        }

        if(request.data.key === "store-template") {
            storeTemplate(request.data);
        }


		if(request.data.key === "filterCheckBox") {
			chrome.storage.local.set({"filterCheckBox": {state: request.data.state}});
		}

		if(request.data.key === "emailCheckBox") {
			chrome.storage.local.set({"emailCheckBox": {state: request.data.state}});
		}

		if(request.data.key === "rpmCheckBox") {
			chrome.storage.local.set({"rpmCheckBox": {state: request.data.state}});
		}

		if(request.data.key === "mapCheckBox") {
			chrome.storage.local.set({"mapCheckBox": {state: request.data.state}});
		}
    }
        





    }
);



async function defaultEmailTemplate() {
    const  data = {subject: "Load from {{origin}} to {{dest}}",
    html: `<p>Hello, team!<br><br>Can we get more info pls about the load from {{origin}} to {{dest}} which is available at {{avail}} &nbsp;and what is the best rate?</p>`};
    storeTemplate(data)
    return data;
  }

function storeTokens(request) {
    const {accessToken, refreshToken, email} = request.data;
    chrome.storage.local.set({"tokens": {refreshToken, accessToken, email}});
} 

function storeTemplate(data) {
    chrome.storage.local.set({"emailTemplate": {subject: data.subject, html:data.html}});

    readLocalStorage("multipleTempl").then(value => {
    if(value !== null && value.arr!=null && value.arr.filter(e => e !==null && e.active === true).length === 0) {
            chrome.storage.local.set({"defEmailTemplate": {subject: data.subject, html:data.html}});
        }


        if (value!==null && value.arr!=null && value.arr.filter(e => e !==null && e.active === true).length === 1) {
            const arr = value.arr;
            arr.map(e => {
                if(e.active === true) {
                    e.html = data.html;
                    e.subject = data.subject;
                }
                return e;
            })
            chrome.storage.local.set({"multipleTempl": {arr}})
        }
    })
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










