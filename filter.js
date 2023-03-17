readLocalStorage("filterCheckBox").then(val => {
    if(val && val.state) {
        setTimeout(() => {
            startFilter();
        }, 500)
    }
}).catch(e =>{
    console.log(e)
})
let dataDat = {};

async function startFilter() {
    const searchList = document.getElementById("searchList");
    if(!searchList) {
        setTimeout(() => {
            startFilter();
        }, 500)
        return;
    }

    const searchListTable = document.getElementsByClassName("searchListTable")[0];
    searchListTable.addEventListener("click",function () {
        reset();
    });

    const searchResults = document.getElementById("searchResults");
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === "childList") {
                if (mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.tagName === "TBODY" && !dataDat[node.id]) {
                            const child = node.getElementsByClassName("resultSummary")[0];
                            dataDat[child.id] = getJsss(node);
                            check(child.id);
                        }
                    });
                }
            }
        });
    });

    observer.observe(searchResults, {
        childList: true,
        subtree: true,
    });



    const filterContainer = document.createElement("div");
    filterContainer.className = "datconnectFilter";
    filterContainer.style.position = "absolute";
    filterContainer.style.right = "0px";


    let maxMiles = document.createElement("input");
    maxMiles.setAttribute("type", "text");
    maxMiles.id = "maxMilesID";
    maxMiles.setAttribute("placeholder", "Maximum Miles");
    maxMiles.addEventListener("input", function (e) {
        datFilterApply();
    })
    filterContainer.appendChild(maxMiles);

    let minMiles = document.createElement("input");
    minMiles.setAttribute("type", "text");
    minMiles.setAttribute("placeholder", "Minimum Miles");
    minMiles.id = "minMilesID";
    minMiles.addEventListener("input", function (e) {
        datFilterApply();
    })
    filterContainer.appendChild(minMiles);

    let minRate = document.createElement("input");
    minRate.id = "minRateID";
    minRate.setAttribute("type", "number");
    minRate.setAttribute("step", "0.01");
    minRate.setAttribute("placeholder", "Minimum Rate (800)");
    minRate.addEventListener("input", function (e) {
        datFilterApply();
    })
    filterContainer.appendChild(minRate);

    let minRPM = document.createElement("input");
    minRPM.id = "minRpmID";
    minRPM.setAttribute("type", "number");
    minRPM.setAttribute("step", "0.01");
    minRPM.setAttribute("placeholder", "Minimum RPM (2.3)");
    minRPM.addEventListener("input", function (e) {
        datFilterApply();
    })
    filterContainer.appendChild(minRPM);


    let ignoreState = document.createElement("input");
    ignoreState.id = "ignoreFilterId"
    ignoreState.setAttribute("type", "text");
    ignoreState.setAttribute("placeholder", "Ignore State (AK,NY)");
    ignoreState.addEventListener("input", function (e) {
        datFilterApply();
    })
    filterContainer.appendChild(ignoreState);



    let resetButton = document.createElement("button");
    resetButton.innerHTML = "Reset";
    resetButton.addEventListener("click", function (){
      reset();
    })
    filterContainer.appendChild(resetButton);








    searchList.insertBefore(filterContainer, searchList.firstChild);


}

async function reset(){
    try {
        document.getElementById("ignoreFilterId").value = "";
        document.getElementById("maxMilesID").value = "";
        document.getElementById("minMilesID").value = "";
        document.getElementById("minRateID").value = "";
        document.getElementById("minRpmID").value = "";
        datFilterApply();
        dataDat = {};
    } catch (e) {

    }

}

async function datFilterApply() {

    const rows = document.getElementsByClassName("resultItem")
    console.log(rows.length)


    for(const row of rows) {

        const child = row.getElementsByClassName("resultSummary")[0];
        const id = child.id;
        if(!dataDat[id])
            dataDat[id] = getJsss(row);
        check(id)
    }


}



async function check(id) {

    if(ignoreFstate(id) && minimumRpm(id) && minimumRate(id)
        && minimumMiles(id) && maximumMiles(id)) {
        document.getElementById(id).style.visibility = "visible";
    } else {
        document.getElementById(id).style.visibility = "collapse";
    }

}
function maximumMiles(id) {
    const js = dataDat[id];
    const maxMiles = document.getElementById("maxMilesID").value;
    if(maxMiles!=="" && Number(maxMiles) > 0 ) {
        if(js.trip && js.trip!=="-" && Number(js.trip.replace(",","")) <= maxMiles) {
            return true;
        } else {
            return false;
        }
    }
    return true;
}

function minimumMiles(id) {
    const js = dataDat[id];
    const minMiles = document.getElementById("minMilesID").value;
    if(minMiles!=="" && Number(minMiles) > 0 ) {
        if(js.trip && js.trip!=="-" && Number(js.trip.replace(",","")) >= minMiles) {
            return true;
        } else {
            return false;
        }
    }
    return true;
}

function minimumRate(id) {
    const js = dataDat[id];
    const minRate = document.getElementById("minRateID").value;
    if(minRate!=="" && Number(minRate) > 0 ) {
        if(js.rate && js.rate!=="-" && Number(js.rate.replace("$", "").replace(",", "")) >= minRate) {
            return true;
        } else {
            return false;
        }
    }
    return true;
}

function minimumRpm(id) {
    const js = dataDat[id];
    const minRpmF = document.getElementById("minRpmID").value;
    if(minRpmF!=="" && Number(minRpmF) > 0 ) {
        if(js.rate && js.rate!=="-" && Number(js.trip.replace(",","")) > 0) {
            const rpm = Number(js.rate.replace("$", "").replace(",", "")) / (Number(js.trip.replace(",","")) + Number(js.do.replace(",", "")) );
            return !(rpm < minRpmF || isNaN(rpm));
        } else {
            return false;
        }
    } else {
       return true;
    }

}

function ignoreFstate(id){
    const ignoreState = document.getElementById("ignoreFilterId").value;
    const js = dataDat[id];
    if(js.dest) {
        const st = js.dest.split(',')[1].replace(/[^a-zA-Z]/g, "")
            .toUpperCase();

        return !ignoreState.toUpperCase().includes(st);
    }
    return true;

}

function getJsss(row){
    var js = {};
    ss = row;
    js = {age: ss.getElementsByClassName('age')[0].innerText, ...js}
    js = {avail: ss.getElementsByClassName('avail')[0].innerText, ...js}
    js = {truck: ss.getElementsByClassName('truck')[0].innerText, ...js}
    js = {fp: ss.getElementsByClassName('fp')[0].innerText, ...js}
    js = {do: ss.getElementsByClassName('do')[0].innerText, ...js}
    js = {trip: ss.getElementsByClassName('trip')[0].innerText, ...js}
    js = {origin: ss.getElementsByClassName('origin')[0].innerText, ...js}
    js = {dest: ss.getElementsByClassName('dest')[0].innerText, ...js}
    //js = {email: email, ...js}
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
    return js;
}
