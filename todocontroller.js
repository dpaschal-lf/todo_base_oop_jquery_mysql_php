

class TodoController{
    constructor( appDomElement){
        this.processTodoList = this.processTodoList.bind( this );
        this.goBack = this.goBack.bind( this );
        this.handleItemClick = this.handleItemClick.bind( this );
        this.domElements = {
            container: $(appDomElement),
            centerContainer: null,
            controls: null,
            title: null,
            footer: null,
            backButton: null
        }
        this.currentItem = null;
        this.items = [];
        this.view = 'list';
        this.loadTodoList();
    }
    loadTodoList(){
        var ajaxOptions = {
            'url': './api/gettodoitems.php',
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
            var newItem = new TodoItem( data[todoIndex], this.handleItemClick);
            this.items.push(newItem);
        }
        this.renderCurrentView();
    }
    handleItemClick( item ){
        this.currentItem = item;
        this.view = 'details';
        this.renderCurrentView();
    }
    view_details(){
        this.currentItem.getItemInfo();
        var domElement = this.currentItem.renderDetails();
        return domElement;
    }
    view_list(){
        var domElementArray = [];
        for( var todoIndex = 0; todoIndex < this.items.length; todoIndex++){
            var todoItem = this.items[ todoIndex ];
            domElementArray.push( todoItem.renderList())
        }
        return domElementArray;
    }
    renderCurrentView(){
        var currentViewMethod = 'view_' + this.view;
        this.domElements.centerContainer.empty()
        this.domElements.centerContainer.append( this[currentViewMethod]());        
    }
    goBack(){
        this.view='list';
        this.renderCurrentView();
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
        this.domElements.controls = $("<header>",{
            class: 'header controls',
        });
        this.domElements.backButton = $("<button>",{
            class: 'backButton hidden',
            on: {
                click: this.goBack
            }
        });
        this.domElements.controls.append( this.domElements.backButton );
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