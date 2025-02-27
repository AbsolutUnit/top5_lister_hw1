/**
 * Top5ListView.js
 * 
 * This class deals with the view of our Web application providing services
 * for loading data into our controls and building other UI controls.
 * 
 * @author McKilla Gorilla
 * @author ?
 */
export default class Top5View {
    // REFRESHES ALL THE LISTS IN THE LEFT SIDEBAR
    refreshLists(lists) {
        // GET THE UI CONTROL WE WILL APPEND IT TO
        let listsElement = document.getElementById("sidebar-list");
        listsElement.innerHTML = "";

        for (let i = 0; i < lists.length; i++) {
            let list = lists[i];
            if (list.id !== i){
                list.id = i;
            }
            this.appendListToView(list);
        }
    }

    setController(initController) {
        this.controller = initController;
    }

    // ADDS A LIST TO SELECT FROM IN THE LEFT SIDEBAR
    appendListToView(newList) {
        // MAKE AND ADD THE NODE
        let listId = "top5-list-" + newList.id;

        // MAKE THE CARD DIV
        let card = document.createElement("div");
        card.setAttribute("id", listId);
        card.setAttribute("class", "list-card");
        card.setAttribute("class", "unselected-list-card");

        // MAKE THE TEXT SPAN
        let textSpan = document.createElement("span");
        textSpan.setAttribute("id", "list-card-text-" + newList.id);
        textSpan.setAttribute("class", "list-card-text");
        textSpan.appendChild(document.createTextNode(newList.name));

        // MAKE THE DELETE LIST BUTTON
        let deleteButton = document.createElement("input");
        deleteButton.setAttribute("type", "button");
        deleteButton.setAttribute("id", "delete-list-" + newList.id);
        deleteButton.setAttribute("class", "list-card-button");
        deleteButton.setAttribute("value", "\u2715");

        // PUT EVERYTHING IN THE MOST OUTER DIV
        card.appendChild(textSpan);
        card.appendChild(deleteButton);

        // AND PUT THE NEW CARD INTO THE LISTS DIV
        let listsElement = document.getElementById("sidebar-list");
        listsElement.appendChild(card);

        // SETUP THE HANDLER FOR WHEN SOMEONE MOUSE CLICKS ON OUR LIST
        this.controller.registerListSelectHandlers(newList.id);
    }

    update(list) {
        for (let i = 0; i < 5; i++) {
            let item = document.getElementById("item-" + (i+1));
            item.innerHTML = "";
            item.appendChild(document.createTextNode(list.getItemAt(i)));
        }
    }

    clearWorkspace() {
        // REMOVE THE ITEMS
        for (let i = 0; i < 5; i++) {
            let item = document.getElementById("item-" + (i+1));
            item.innerHTML = "";
        }
    }

    disableButton(id) {
        let button = document.getElementById(id);
        button.classList.add("disabled");
        button.setAttribute("disabled", "true");
    }

    enableButton(id) {
        let button = document.getElementById(id);
        button.classList.remove("disabled");
        button.removeAttribute("disabled");
    }

    highlightList(listId) {
        // HIGHLIGHT THE LIST
        let listCard = document.getElementById("top5-list-" + listId);
        if (listCard.classList.contains("highlighted-list-card")){
            listCard.classList.remove("highlighted-list-card");
        }
        listCard.classList.remove("unselected-list-card");
        listCard.classList.add("selected-list-card");
    }

    unhighlightList(listId) {
        // HIGHLIGHT THE LIST
        let listCard = document.getElementById("top5-list-" + listId);
        listCard.classList.add("unselected-list-card");
        listCard.classList.remove("selected-list-card");
    }

    // hoverhighlightList(listId) {
    //     let list_in_q = document.getElementById("top5-list-" + listId);
    //     if (list_in_q.classList.contains("unselected-list-card")) {
    //         list_in_q.classList.remove("unselected-list-card");
    //         list_in_q.classList.add("highlighted-list-card");
    //     }
    // }

    // unhoverhighlightList(listId) {
    //     let list_in_q = document.getElementById("top5-list-" + listId);
    //     if (list_in_q.classList.contains("highlighted-list-card")) {
    //         list_in_q.classList.remove("highlighted-list-card");
    //         list_in_q.classList.add("unselected-list-card");
    //     }
    // }

    updateToolbarButtons(model) {
        let tps = model.tps;
        if (!tps.hasTransactionToUndo()) {
            this.disableButton("undo-button");
        }
        else {
            this.enableButton("undo-button");
        } 
        if (!tps.hasTransactionToRedo()) {
            this.disableButton("redo-button");
        } else {
            this.enableButton("redo-button");
        }
    }
}