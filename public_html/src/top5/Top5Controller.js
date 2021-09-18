/**
 * Top5ListController.js
 * 
 * This file provides responses for all user interface interactions.
 * 
 * @author McKilla Gorilla
 * @author ?
 */
export default class Top5Controller {
    constructor() {

    }

    setModel(initModel) {
        this.model = initModel;
        this.initHandlers();
    }

    initHandlers() {
        // SETUP THE TOOLBAR BUTTON HANDLERS
        this.model.toolup();
        this.model.close_disabler();
        document.getElementById("add-list-button").onmousedown = (event) => {
            let newList = this.model.addNewList("Untitled", ["?","?","?","?","?"]);            
            this.model.loadList(newList.id);
            this.model.saveLists();
        }
        document.getElementById("undo-button").onmousedown = (event) => {
            this.model.undo();
        }

        document.getElementById("redo-button").onmousedown = (event) => {
            this.model.redo();
        }
        document.getElementById("close-button").onmousedown = (event) => {
            this.model.unselectAll();
            this.model.workspace_clear();
            this.model.close_disabler();
            this.model.add_enabler();
            document.getElementById("top5-statusbar").innerHTML = "";
        }

        // SETUP THE ITEM HANDLERS
        for (let i = 1; i <= 5; i++) {
            let item = document.getElementById("item-" + i);
            item.setAttribute("draggable", "true")

            // AND FOR TEXT EDITING

            item.ondblclick = (ev) => {
                if (this.model.hasCurrentList()) {
                    // CLEAR THE TEXT
                    item.setAttribute("draggable", "false");
                    item.innerHTML = "";

                    // ADD A TEXT FIELD
                    let textInput = document.createElement("input");
                    textInput.setAttribute("type", "text");
                    textInput.setAttribute("id", "item-text-input-" + i);
                    textInput.setAttribute("value", this.model.currentList.getItemAt(i-1));

                    item.appendChild(textInput);

                    textInput.ondblclick = (event) => {
                        this.ignoreParentClick(event);
                    }
                    textInput.onkeydown = (event) => {
                        if (event.key === 'Enter') {
                            this.model.addChangeItemTransaction(i-1, event.target.value);
                            this.model.toolup();
                            this.model.saveLists();
                            item.setAttribute("draggable", "true");
                        }
                    }
                    textInput.onblur = (event) => {
                        this.model.restoreList();
                        this.model.saveLists();
                        item.setAttribute("draggable", "true");
                    }
                }
            }

            item.ondragover = (ev) => {
                ev.preventDefault();
            }

            item.ondragstart = (ev) => {
                ev.dataTransfer.setData("text", ev.target.id);
            }

            item.ondrop = (ev) => {
                ev.preventDefault();
                let drag_id = ev.dataTransfer.getData("text");
                drag_id = drag_id.substring(drag_id.length - 1);
                drag_id = parseInt(drag_id) - 1;
                let drop_id = ev.target.id;
                drop_id = drop_id.substring(drop_id.length - 1);
                drop_id = parseInt(drop_id) - 1;
                let list_ex = this.model.currentList;
                this.model.addMoveItemTransaction(list_ex, drag_id, drop_id);
                this.model.saveLists();
            }
        }
    }

    registerListSelectHandlers(id) {
        // FOR SELECTING THE LIST
        document.getElementById("top5-list-" + id).onmousedown = (event) => {
            this.model.unselectAll();

            // GET THE SELECTED LIST
            this.model.loadList(id);
            this.model.close_enabler();
            this.model.add_disabler();
            document.getElementById("top5-statusbar").innerHTML = "Top 5 " + this.model.top5Lists[id].getName();
        }
        // FOR DELETING THE LIST
        document.getElementById("delete-list-" + id).onmousedown = (event) => {
            this.ignoreParentClick(event);
            // VERIFY THAT THE USER REALLY WANTS TO DELETE THE LIST
            let modal = document.getElementById("delete-modal");
            this.listToDeleteIndex = id;
            let listName = this.model.getList(id).getName();
            let deleteSpan = document.getElementById("delete-list-span");
            deleteSpan.innerHTML = "";
            deleteSpan.appendChild(document.createTextNode(listName));
            modal.classList.add("is-visible");
            document.getElementById("dialog-confirm-button").onmousedown = (event) => {
                this.model.removeList(id);
                modal.classList.remove("is-visible");
                this.model.refreshList();
                this.model.workspace_clear();
                this.model.saveLists();
                document.getElementById("top5-statusbar").innerHTML = "";
            }
            document.getElementById("dialog-cancel-button").onmousedown = (event) => {
                modal.classList.remove("is-visible");
            }
        }

        let list_name = document.getElementById("top5-list-" + id);

        // list_name.onmouseover = (ev) => {
        //     this.model.highlight_list(id);
        //     // this.view.refreshLists();
        // }

        // list_name.onmouseout = (ev) => {
        //     this.model.unhighlight_list(id);
        // }


        
        list_name.ondblclick = (ev) => {
            list_name.innerHTML = "";
            let textInput = document.createElement("input");
            textInput.setAttribute("type", "text");
            textInput.setAttribute("id", "top5-list-text-input-" + id);
            textInput.setAttribute("value", this.model.getList(id).getName());

            list_name.appendChild(textInput);
            
            textInput.ondblclick = (event) => {
                this.ignoreParentClick(event);
            }
            textInput.onkeydown = (event) => {
                if (event.key === 'Enter') {
                    this.model.getList(id).setName(event.target.value);
                    this.model.sortLists();
                    this.model.saveLists();
                    let iddd = this.model.getListid(event.target.value);
                    this.model.loadList(iddd);
                    this.model.close_enabler();
                    this.model.add_disabler();
                    document.getElementById("top5-statusbar").innerHTML = "Top 5 " + this.model.top5Lists[iddd].getName();

                }
            }
            textInput.onblur = (event) => {
                this.model.sortLists();
                this.model.saveLists();
                document.getElementById("top5-statusbar").innerHTML = "Top 5 " + this.model.top5Lists[id].getName();
            }
        }

    }

    ignoreParentClick(event) {
        event.cancelBubble = true;
        if (event.stopPropagation) event.stopPropagation();
    }
}