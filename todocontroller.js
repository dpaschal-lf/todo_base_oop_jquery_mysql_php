

class TodoController{
    constructor( appDomElement ){
        this.processTodoList = this.processTodoList.bind( this );
        this.domElements = {
            container: $(appDomElement),
            title: null,
            footer: null
        }
        this.items = [];
        this.view = 'list';
        this.loadTodoList();
    }
    loadTodoList(){
        var ajaxOptions = {
            'url': './data/todoread.json',
            'dataType': 'json',
            'method': 'get',
            'success': this.processTodoList
        }
        $.ajax( ajaxOptions );
    }
    processTodoList( data ){
        this.items = [];
        this.domElements.centerContainer.empty();
        for( var todoIndex = 0; todoIndex < data.length; todoIndex++){
            var newItem = new TodoItem( data[todoIndex]);
            this.items.push(newItem);
            var todoItemDom = newItem.renderList();
            this.domElements.centerContainer.append(todoItemDom);
        }
    }
    view_list(){
        return ("list");
    }
    renderCurrentView(){
        var currentViewMethod = 'view_' + this.view;
        this.domElements.centerContainer.append( this[currentViewMethod]);        
    }
    render(){
        this.domElements.title = $("<h1>",{
            text: 'TODO APP',
            class: 'mainTitle'
        })
        this.domElements.centerContainer = $("<div>",{
            class: 'centerContents'
        });
        this.renderCurrentView();
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