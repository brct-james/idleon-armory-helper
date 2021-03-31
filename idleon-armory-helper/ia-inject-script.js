var helperSettings = {
    helperLocation: "right",
    width: 30
}

// Handle swapping helper sides
function swapHelperLocation() {
    let body = document.getElementsByTagName("body")[0];
    body.classList.toggle("rowReverse");
}
function setHelperLocation(dir) {
    let containsRowRev = document.getElementsByTagName("body")[0].classList.contains("rowReverse");
    if (dir === "right" && containsRowRev) { //if rowRev then is on left, else on right
        swapHelperLocation();
        helperSettings.helperLocation = "right";
    }
    else if (dir === "left" && !containsRowRev) {
        swapHelperLocation();
        helperSettings.helperLocation = "left";
    }
    saveSettings();
}

window.addEventListener("loadSettings", function(data) {
    let settings = data.detail.settings;
    console.log("[IAInjected] Received loadSettings event: ", settings);
    setHelperWidth(settings.width);
    document.getElementById("helperWidthInput").value = settings.width;
    setHelperLocation(settings.helperLocation);
    console.log("[IAInjected] Completed loadSettings");
});

//Handle setting helper width
function updateHelperWidth() {
    let input = document.getElementById("helperWidthInput");
    setHelperWidth(input.value);
    saveSettings();
}
function setHelperWidth(width) {
    let helper = document.getElementById("idleon-armory-helper");
    let iVal = width + "vw";
    helper.style.width = iVal;
    helper.style.maxWidth = iVal;
    helper.style.minWidth = iVal;
    helperSettings.width = width;
}

function saveSettings() {
    window.dispatchEvent(new CustomEvent("saveSettings", {detail: helperSettings}));
}

// Click on a close button to hide the current list item
var close = document.getElementsByClassName("close");
for (let i = 0; i < close.length; i++) {
    close[i].onclick = function () {
        var div = this.parentElement;
        div.style.display = "none";
    };
}

// Change which tab is active in sidebar
function activate(target) {
    let contentCont = document.getElementById("iah-content");
    let navCont = document.getElementById("iah-nav");
    let targetElem = document.getElementById("iah-" + target);
    let thisButn = document.getElementById("iah-" + target + "-nav");

    Array.from(contentCont.children).map((child) =>
        child.classList.add("hidden")
    );
    targetElem.classList.remove("hidden");
    Array.from(navCont.children).map((child) =>
        child.classList.remove("active")
    );
    thisButn.classList.add("active");
}

// Create a new list item when clicking on the "Add" button
function newElement() {
    var li = document.createElement("li");
    var inputValue = document.getElementById("newTodo").value;
    var t = document.createTextNode(inputValue);
    li.appendChild(t);
    if (inputValue === "") {
        console.log("[IAHelper] No value in todo input");
    } else {
        document.getElementById("iah-todo-list-items").appendChild(li);
    }
    document.getElementById("newTodo").value = "";
    document.getElementById("newTodoDays").value = "0";
    document.getElementById("newTodoHours").value = "0";
    document.getElementById("newTodoMinutes").value = "0";

    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    li.appendChild(span);

    for (i = 0; i < close.length; i++) {
        close[i].onclick = function () {
            var div = this.parentElement;
            div.style.display = "none";
        };
    }
}
