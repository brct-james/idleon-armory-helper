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
