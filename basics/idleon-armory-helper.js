$(runHelper);

function runHelper() {
    console.log("[IAHelper] Chrome Ready");
    //Set game container padding to 10px to maximize the game screen
    let gameContainer = document.getElementById("content-container-inner");
    let contentContainer = document.getElementById("content-container");
    //check for located containers (required to not activate on non-game pages on the same domain, as this way new updates are automatically captured including alpha pages)
    if (gameContainer === null || contentContainer === null) {
        //if no containers found, not on a valid game page so quit
        console.log(
            "[IAHelper] One or more of ['#content-container-inner', '#content-container'] were not found, IAHelper quitting"
        );
        return;
    }
    //else actually run
    console.log("[IAHelper] Initializing");
    gameContainer.style.padding = "10px";

    $.get(chrome.runtime.getURL("ia-inject-page.html"), function (data) {
        $($.parseHTML(data)).appendTo("body");
        console.log("[IAHelper] Injected page HTML");
        initializeHTML();
        injectJS();
    });
}

function injectJS() {
    $.getScript(chrome.runtime.getURL('ia-inject-script.js'), function (data) {
        console.log("[IAHelper] Injected page JS");
    })
}

function initializeHTML() {
    var myNodelist = document.getElementsByTagName("LI");
    var i;
    for (i = 0; i < myNodelist.length; i++) {
        var span = document.createElement("SPAN");
        var txt = document.createTextNode("\u00D7");
        span.className = "close";
        span.appendChild(txt);
        myNodelist[i].appendChild(span);
    }

    // Click on a close button to hide the current list item
    var close = document.getElementsByClassName("close");
    var i;
    for (i = 0; i < close.length; i++) {
        close[i].onclick = function () {
            var div = this.parentElement;
            div.style.display = "none";
        };
    }

    // Add a "checked" symbol when clicking on a list item
    var list = document.getElementById("iah-todo-list-items");
    list.click(function (ev) {
        if (ev.target.tagName === "LI") {
            ev.target.classList.toggle("checked");
        }
    });
}