var helperSettings = {
    helperLocation: "right",
    width: 30,
};
var taskList = [];
const defaultTaskList = [
    {
        text: "Daily Guild GP Tasks",
        checked: false,
    },
    {
        text: "Task Board (W1, W2)",
        checked: false,
    },
    {
        text: "Spend Alchemy Liquids",
        checked: false,
    },
    {
        text: "Post Office Orders",
        checked: false,
    },
    {
        text: "Collect AFK Gains, Refill Food, Quick Deposit Anvil, etc.",
        checked: false,
    },
    {
        text:
            "Buy Talent Reset Shards, Silver Antique, Town Teleports, etc. from all 4 shops",
        checked: false,
    },
    {
        text: "Kill Boops, Dr Defecaus",
        checked: false,
    },
    {
        text: "Collect Boss Keys & Arena Tickets (W1, W2)",
        checked: false,
    },
    {
        text: "Weekly Guild Tasks",
        checked: false,
    },
    {
        text: "Baba Yaga",
        checked: false,
    },
];

function uncheckAll() {
    let childrens = document.querySelectorAll("li.checked");
    console.log(childrens);
    childrens.forEach(elem => elem.classList.remove("checked"));
    taskList = taskList.map(elem => { elem.checked = false; return elem; });
    saveTasks();
}

// Handle swapping helper sides
function swapHelperLocation() {
    let body = document.getElementsByTagName("body")[0];
    body.classList.toggle("rowReverse");
}
function setHelperLocation(dir) {
    let containsRowRev = document
        .getElementsByTagName("body")[0]
        .classList.contains("rowReverse");
    if (dir === "right" && containsRowRev) {
        //if rowRev then is on left, else on right
        swapHelperLocation();
        helperSettings.helperLocation = "right";
    } else if (dir === "left" && !containsRowRev) {
        swapHelperLocation();
        helperSettings.helperLocation = "left";
    }
    saveSettings();
}

window.addEventListener("loadSettings", function (data) {
    let settings = data.detail.settings;
    console.log("[IAInjected] Received loadSettings event: ", settings);
    if (settings && Object.keys(settings).length > 0) {
        setHelperWidth(settings.width);
        document.getElementById("helperWidthInput").value = settings.width;
        setHelperLocation(settings.helperLocation);
        console.log("[IAInjected] Completed loadSettings");
    } else {
        console.log(
            "[IAInjected] Settings object empty, using default settings."
        );
    }
});

window.addEventListener("loadTasks", function (data) {
    let tasks = data.detail.tasks;
    console.log("[IAInjected] Received loadTasks event: ", tasks);
    if (tasks && Object.keys(tasks).length > 0) {
        console.log(
            "[IAInjected] Populating taskList with received tasks object"
        );
        taskList = tasks;
        populateTasks();
    } else {
        // Tasks empty, use default
        console.log(
            "[IAInjected] Tasks object empty, populating taskList with defaultTaskList instead"
        );
        taskList = defaultTaskList;
        populateTasks();
    }
});

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function populateTasks() {
    let list = document.getElementById("iah-todo-list-items");
    removeAllChildNodes(list);
    taskList.map((task) => {
        let newTask = document.createElement("li");
        newTask.appendChild(document.createTextNode(task.text));
        if (task.checked) {
            newTask.classList.add("checked");
        }
        list.appendChild(newTask);
        createCloseSpans(newTask);
    });
    console.log("[IAInjected] Finished populating tasks");
}

function saveTasks() {
    window.dispatchEvent(new CustomEvent("saveTasks", { detail: taskList }));
}

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
    window.dispatchEvent(
        new CustomEvent("saveSettings", { detail: helperSettings })
    );
}

// Click on a close button to hide the current list item
function setCloseOnclicks() {
    for (let i = 0; i < close.length; i++) {
        close[i].onclick = function () {
            var div = this.parentElement;
            div.style.display = "none";
            let liText = div.childNodes[0].textContent;
            taskList = taskList.filter((element) => {
                return element.text !== liText;
            });
            saveTasks();
        };
    }
}
var close = document.getElementsByClassName("close");
setCloseOnclicks();

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
    // document.getElementById("newTodoDays").value = "0";
    // document.getElementById("newTodoHours").value = "0";
    // document.getElementById("newTodoMinutes").value = "0";

    createCloseSpans(li);

    taskList.push({
        text: inputValue,
        checked: false
    });
    saveTasks();
}

function createCloseSpans(li) {
    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    li.appendChild(span);

    setCloseOnclicks();
}

function forceClearStorage() {
    window.dispatchEvent(new CustomEvent("clearStorage", { detail: true }));
}

// Add a "checked" symbol when clicking on a list item
var list = document.getElementById("iah-todo-list-items");
list.onclick = function (ev) {
    if (ev.target.tagName === "LI") {
        ev.target.classList.toggle("checked");
        // Save checked status
        let liText = ev.target.childNodes[0].textContent;
        taskList = taskList.map(element => {
            if (element.text == liText) {
                element.checked = element.checked ? false : true;
            }
            return element;
        });
        saveTasks();
    }
};

// let liText = div.childNodes[0].textContent;
// taskList = taskList.filter((element) => {
//    return element.text !== liText;
// });
// saveTasks();