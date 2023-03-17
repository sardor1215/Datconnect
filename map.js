readLocalStorage("mapCheckBox").then(val => {
    if(val && val.state) {
        setTimeout(() => {
            startMap();
        }, 500)
    }
}).catch(e =>{
    console.log(e)
})
async function changeToGoogle(element) {

    var js = {};
    ss = element.parentElement.parentElement;
    js = {origin: ss.getElementsByClassName('origin')[0].innerText, ...js}
    js = {dest: ss.getElementsByClassName('dest')[0].innerText, ...js}


    const originSearch = js.origin;

    const originText = js.origin;
    const destText = js.dest;
    const _os = originSearch.replace(/ /gim, "+");
    const _ot = originText.replace(/ /gim, "+");
    const _dt = destText.replace(/ /gim, "+");
    const mapLink =
        _os === _ot || !_os
            ? `https://www.google.com/maps/dir/${_ot}/${_dt}`
            : `https://www.google.com/maps/dir/${_os}/${_ot}/${_dt}`;
    element.href = mapLink;

}

async function startMap() {

    const observer = new MutationObserver(async function(mutations) {
        mutations.forEach(async function(mutation) {

            Array.from(mutation.addedNodes).forEach(async function(node) {
                if (node.nodeType === 1) { // Check if node is an element node
                    const elements = node.querySelectorAll('[track-link-category="Trip Miles"]');
                    for (const element of elements) {
                       changeToGoogle(element)
                    }
                }
            });
        });
    });


    observer.observe(document, { childList: true, subtree: true });



}