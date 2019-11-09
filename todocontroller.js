

class TodoController{
    constructor( appDomElement ){
        this.domElements = {
            container: $(appDomElement),
            title: null,
            footer: null
        }
        this.view = 'list';
    }
    view_list(){
        return ("list");
    }
    render(){
        this.domElements.title = $("<h1>",{
            text: 'TODO APP',
            class: 'main-title'
        })
        this.domElements.centerContainer = $("<div>",{
            class: 'centerContents'
        });
        var currentViewMethod = 'view_' + this.view;
        this.domElements.centerContainer.append( this[currentViewMethod]);
        this.domElements.footer = $("<footer>",{
            class: 'footer',
            text: 'footer'
        });
        this.domElements.container.append( 
            this.domElements.title,
            this.domElements.centerContainer,
            this.domElements.footer
        )
        return this.domElements.container;
    }
}