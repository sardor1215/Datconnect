readLocalStorage("rpmCheckBox").then(val => {
    if(val && val.state) {
        setTimeout(() => {
            observe();
            startRpm();
        }, 500)
    }
}).catch(e =>{
    console.log(e)
})




async function rpmAdding(child) {
    const ss = child;
    let js = {};
    js = {do: ss.getElementsByClassName('do')[0].innerText, ...js}
    js = {trip: ss.getElementsByClassName('trip')[0].innerText, ...js}
    js = {rate: ss.getElementsByClassName('rate')[0].innerText, ...js}
    js.rate = js.rate.replace("$","").replace(",","");
    js.trip = js.trip.replace(",", "");



    const td = document.createElement("td");
    td.className = "rpm";
    td.textContent = "-"

    if (js.rate !== '-') {
        const rate = Number(js.rate);
        const trip = Number(js.trip);
        const dho = Number(js.do);
        const sum = Number(rate / (trip + dho)).toFixed(1)
        td.textContent = isNaN(sum) ? '-' : "$" + sum;
    }



    const bf = child.getElementsByClassName("bookItNow")[0];
    child.insertBefore(td, bf);



}

async function rpmCalc(elem) {

    const id = elem.parentElement.getElementsByClassName("resultSummary")[0].id;

    const ss = elem.parentElement.getElementsByClassName("resultSummary")[0];
    let js = {};
    js = {do: ss.getElementsByClassName('do')[0].innerText, ...js}
    js = {trip: ss.getElementsByClassName('trip')[0].innerText, ...js}
    js = {rate: ss.getElementsByClassName('rate')[0].innerText, ...js}
    js.do = Number(js.do.replace(",", ""));
    js.trip = Number(js.trip.replace(",", ""));
    js.allMiles = js.do + js.trip;

    if(js.rate === '—') {
        js.rate = 0;
        js.rpm = 0;
        js.rpmDhp = 0;
    } else
        {
            js.rate = Number(js.rate.replace("$", "").replace(",", ""));
            js.rpm = Number(js.rate / js.trip).toFixed(2);
            js.rpmDhp =  Number(js.rate / js.allMiles).toFixed(2);
    }




    const fch = elem.getElementsByTagName("td")[0];
    fch.setAttribute('colspan', "16");

    const td = document.createElement("td");
    td.setAttribute('colspan', "5");
    td.style.padding = "0px";
    td.style.boxSizing = "border-box";
    td.innerHTML = `
    <div class="datconnectCalcContainer datconnectRateChangeHandled" id="calcContainer-${id}" data-dho="12" data-trip="749">
            <div class="datconnectRow">
              <span class="datconnectCol" style="margin:0 auto;">
                <span class="datconnectLabelSpan">Rate</span>
                <span class="flex-1 datconnectInputUnit" data-char="">
                <input type="number" id="datconnectRate-${id}" value="${js.rate}" min="1" data-id="${id}" data-char="$" class="datconnectCalcInput" data-calc="RATE" style="width: 90px;">
                </span>
              </span>
            </div>
            <div class="datconnectRow">
              <span class="datconnectCol">
                <span class="datconnectLabelSpan">All miles</span>
                <span class="flex-1 datconnectInputUnit static" data-char="" title="Miles including deadhead ">
                  <input type="number" id="datconnectTrip-${id}" value="${js.allMiles}" min="0" data-id="${id}" data-char="Mi" class="datconnectCalcInput">
                </span>
              </span>
              <span class="datconnectCol">
                <span class="datconnectLabelSpan">RPM</span>
                <span class="flex-1 datconnectInputUnit static" data-char="$">
                  <input disabled type="number" id="datconnectRpm-${id}" value="${js.rpm}" step="0.01" min="0.01" data-id="LS4ZdaAY" data-char="$" class="datconnectCalcInput" data-calc="RPM">
                </span>
              </span>
              <span class="datconnectCol">
                <span class="datconnectLabelSpan">RPM+DH</span>
                <span class="flex-1 datconnectInputUnit static" data-char="$" title=" RPM including deadhead ">
                  <input disabled type="number" step="0.01" min="0.01" id="datconnectCalcRpmDho-${id}" data-id="${id}" data-char="Mi" value="${js.rpmDhp}" class="flex-1 datconnectCalcInput" data-calc="RPMPlus">
                </span>
              </span>
            </div>
        </div>
    `

    elem.appendChild(td);

    document.getElementById("datconnectRate-"+id).addEventListener("input", function () {
        const rate = document.getElementById("datconnectRate-"+id).value;
        document.getElementById("datconnectRpm-"+id).value = (rate / js.trip).toFixed(2);
        document.getElementById("datconnectCalcRpmDho-"+id).value= (rate / js.allMiles).toFixed(2);
    });


}

async function observe() {
    const observer = new MutationObserver(async (mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === "childList") {
                if (mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(async (node) => {
                        if (node.tagName === "TBODY") {
                            const child = node.getElementsByClassName("resultSummary")[0];
                            if(child) {
                                rpmAdding(child)
                            }
                        }

                        if(node.tagName === "TR") {
                           const tds = node.getElementsByTagName("td")
                            for(const td of tds) {
                                if(td.colSpan === 20) {
                                    td.setAttribute('colspan', "21");
                                }

                            }
                            if(node.className.includes("resultDetails")) {
                                    rpmCalc(node);
                            }

                        }

                    });
                }
            }
        }
    });


    observer.observe(document, { childList: true, subtree: true });
}

function startRpm(){
    const ss = document.getElementsByClassName("searchResultsTable");
    if(ss.length === 0  || !ss[0].getElementsByClassName("invisible")) {
        setTimeout(() => {
            startRpm();
        }, 500)
        return;
    }
    const headersTable = $(".searchResultsTable").find(".columnHeaders");
    $(".searchResultsTable")
        .find(".invisible")
        .find(".bookItNow")
        .before('<th class="rpm-head ng-scope">RPM</th>');
    headersTable.find(".rate").after(`<th class="rpm" title="rpm">
                                            <a class="sortField">
                                                <ng-transclude>
                                                    <span class="ng-scope">RPM</span>
                                                </ng-transclude>
                                                <i class="sort"></i>
                                            </a>
                                        </th>`);


}


function waitForElm(selector, element = document.body) {
    return new Promise(resolve => {
        if (element.querySelector(selector)) {
            return resolve(element.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (element.querySelector(selector)) {
                resolve(element.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(element, {
            childList: true,
            subtree: true
        });
    });
}
