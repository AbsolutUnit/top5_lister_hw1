import jsTPS_Transaction from "../../common/jsTPS.js"
/**
 * MoveItem_Transaction
 * 
 * This class represents a transaction that works with drag
 * and drop. It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author ?
 */
export default class MoveItem_Transaction extends jsTPS_Transaction {
    constructor(initModel, list, initOld, initNew) {
        super();
        this.list = list;
        this.model = initModel;
        this.oldItemIndex = initOld;
        this.newItemIndex = initNew;
    }

    doTransaction() {
        this.list.moveItem(this.oldItemIndex, this.newItemIndex);
        this.model.update(this.list);
    }
    
    undoTransaction() {
        this.list.moveItem(this.newItemIndex, this.oldItemIndex);
        this.model.update(this.list);
    }
}