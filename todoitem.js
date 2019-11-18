
class TodoItem{
    constructor(dataObject, clickCallback){
        this.receiveItemInfo = this.receiveItemInfo.bind( this );
        this.clickCallback = clickCallback;
        this.data = {
            id: dataObject.id,
            title: dataObject.title,
            completed: dataObject.completed,
            description: dataObject.description,
            added: dataObject.added
        }
        this.domElements = {
            list: {
                container: null,
                title: null,
                added: null,
                controlContainer: null,
                completedCheckbox: null,
            },
            details: {
                container: null,
                title: null,
                added: null,
                controlContainer: null,
                completedCheckbox: null,
            }
        }
    }
    updateDomElements(){
        this.domElements.list.title.text( this.data.title);
        this.domElements.list.added.text( this.data.added );
        this.domElements.list.completedCheckbox.attr('checked',this.data.completed );
    }
    renderList(){
        this.domElements.list.container = $("<div>",{
            class: 'todoListItem'
        });
        this.domElements.list.title = $("<div>",{
            class: 'title'
        });
        this.domElements.list.added = $("<div>",{
            class: 'added'
        });
        this.domElements.list.controlContainer = $("<div>",{
            class: 'controlArea'
        });
        this.domElements.list.completedCheckbox = $("<input>",{
            type: 'checkbox'
        });
        this.domElements.list.controlContainer.append(
            this.domElements.list.completedCheckbox
        );
        this.updateDomElements();
        this.domElements.list.container.append(
            this.domElements.list.title,
            this.domElements.list.added,
            this.domElements.list.controlContainer
        );
        return this.domElements.list.container;
    }
/*
            details: {
                container: null,
                title: null,
                added: null,
                controlContainer: null,
                completedCheckbox: null,
            }
*/
    getItemInfo(){
        var ajaxOptions = {
            'url': './api/gettodoitems.php',
            'data': {
                id: this.data.id
            },
            'dataType': 'json',
            'method': 'get',
            'success': this.receiveItemInfo
        }
        $.ajax( ajaxOptions );
    }
    receiveItemInfo( data ){
        this.data.title = data.title;
        this.data.completed = data.completed;
        this.data.description = this.data.description;
        this.data.added = this.data.added;
        this.updateDetails();      
    }
    updateDetails(){
        this.domElements.details.title.text(this.data.title);
        this.domElements.details.added.val(this.data.added);
        this.domElements.details.description.text(this.data.description);
        this.domElements.details.completedCheckbox.attr('checked',this.data.completed );
    }
    renderDetails(){
        var clone = $($("#todoDetails").text());
        this.domElements.details.container = clone;
        this.domElements.details.title = clone.find('.title');
        this.domElements.details.added = clone.find('.added');
        this.domElements.details.controlContainer = clone.find('.controls');
        this.domElements.details.completedCheckbox = clone.find('.completeCheckbox');
        this.updateDetails();
        return this.domElements.details.container;
    }
}