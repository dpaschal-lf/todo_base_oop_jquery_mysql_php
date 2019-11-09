
class TodoItem{
    constructor(dataObject){
        this.data = {};
        // for( var key in dataObject){
        //     this.data[key] = dataObject[key];
        // }
        this.data = {
            id: dataObject.id,
            title: dataObject.title,
            completed: dataObject.completed,
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

            }
        }
    }
    updateDomElements(){
        this.domElements.list.title.text( this.data.title);
        this.domElements.list.added.text( this.data.added );
        this.domElements.list.completedCheckbox.attr('checked',this.data.completed )
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
    renderDetails(){

    }
}