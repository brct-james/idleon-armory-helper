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
    //Force canvas to maintain aspect ratio
    gameContainer.style.height = "auto";
    gameContainer.style.width = "100%";
    //Force canvas to center vertically
    contentContainer.style.display = "flex";
    contentContainer.style.alignItems = "center";
    //Maximize game container
    gameContainer.style.padding = "10px";

    $.get(chrome.runtime.getURL("ia-inject-page.html"), function (data) {
        $($.parseHTML(data)).appendTo("body");
        console.log("[IAHelper] Injected page HTML");
        initializeHTML();
        injectJS();
    });

    console.log("[IAHelper] Registering event listeners");
    window.addEventListener("saveSettings", function(data) {
        let detail = data.detail;
        console.log("[IAHelper] Received saveSettings event: ", detail);
        chrome.storage.sync.set({settings: detail}, function() {
            console.log('[IAHelper] Settings saved successfully');
        });
    });
}

function retrieveSavedSettings() {
    chrome.storage.sync.get(['settings'], function(result) {
        console.log("[IAHelper] Retrieved saved settings: ", result);
        window.dispatchEvent(new CustomEvent("loadSettings", {detail: result}));
    });
}

function injectJS() {
    $.getScript(chrome.runtime.getURL("ia-inject-script.js"), function (data) {
        console.log("[IAHelper] Injected page JS");
        retrieveSavedSettings();
    });
}

function initializeHTML() {
    // Add close spans to each pre-existing LI
    var myNodelist = document.getElementsByTagName("LI");
    for (let i = 0; i < myNodelist.length; i++) {
        var span = document.createElement("SPAN");
        var txt = document.createTextNode("\u00D7");
        span.className = "close";
        span.appendChild(txt);
        myNodelist[i].appendChild(span);
    }

    // Add a "checked" symbol when clicking on a list item
    var list = $("#iah-todo-list-items");
    list.click(function (ev) {
        if (ev.target.tagName === "LI") {
            ev.target.classList.toggle("checked");
        }
    });

    let titleLogo = $('<img class="iah-logo">');
    titleLogo.attr({
        "src": chrome.runtime.getURL("images/iah_shield.png")
    });
    $("#iah-title").prepend(titleLogo);
    // titleLogo.prepend("#iah-title");
}