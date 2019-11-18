

class TodoController{
    constructor( appDomElement){
        this.processTodoList = this.processTodoList.bind( this );
        this.goBack = this.goBack.bind( this );
        this.handleItemClick = this.handleItemClick.bind( this );
        this.storeUserToken = this.storeUserToken.bind( this );
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
    }
    loadTodoList(){
        var ajaxOptions = {
            'url': './api/gettodoitems.php',
            'dataType': 'json',
            'method': 'get',
            'headers': {
                'token': localStorage.getItem('userToken')
            },
            'success': this.processTodoList,
        }
        $.ajax( ajaxOptions );
    }
    getUserToken(){
        return localStorage.getItem('userToken');
    }
    storeUserToken( token ){
        localStorage.userToken = token;
    }
    processTodoList( data, status, request ){
        debugger;
        if(request.getResponseHeader('userToken')){
            this.storeUserToken(request.getResponseHeader('userToken') );
        }
        this.items = [];
        this.domElements.centerContainer.empty();
        for( var todoIndex = 0; todoIndex < data.length; todoIndex++){
            var newItem = new TodoItem( data[todoIndex], this.handleItemClick, this.storeUserToken);
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
        this.domElements.backButton.removeClass('hidden');
        this.currentItem.getItemInfo();
        var domElement = this.currentItem.renderDetails();
        return domElement;
    }
    view_list(){
        this.domElements.backButton.addClass('hidden');
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

        this.domElements.controls = $("<header>",{
            class: 'header controls',
        });
        this.domElements.backButton = $("<button>",{
            class: 'backButton hidden',
            text: 'back',
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
            this.domElements.controls,
            this.domElements.centerContainer,
            this.domElements.footer
        )
        this.renderCurrentView();
        return this.domElements.container;
    }
}