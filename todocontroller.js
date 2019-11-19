

class TodoController{
    constructor( appDomElement, modalDomElements){
        this.processTodoList = this.processTodoList.bind( this );
        this.goBack = this.goBack.bind( this );
        this.handleItemClick = this.handleItemClick.bind( this );
        this.storeUserToken = this.storeUserToken.bind( this );
        this.handleSuccessfulCreateItem = this.handleSuccessfulCreateItem.bind( this );
        this.hideModal = this.hideModal.bind( this );
        this.goCreate = this.goCreate.bind( this );
        this.domElements = {
            container: $(appDomElement),
            modalShadow: $(modalDomElements.shadow),
            modalBody: $(modalDomElements.body),
            modalClose: $(modalDomElements.close),
            modalContent: $(modalDomElements.content),
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
    createTodoItem(title, description){
        var ajaxOptions = {
            'url': './api/posttodoitems.php',
            'dataType': 'json',
            'method': 'post',
            'data': {
                'title': title,
                'description': description
            },
            'headers': {
                'token': localStorage.getItem('userToken')
            },
            'success': this.handleSuccessfulCreateItem,
        }
        $.ajax( ajaxOptions );        
    }
    handleSuccessfulCreateItem(){
        this.view = 'list';
        this.renderCurrentView();
        this.loadTodoList();
    }
    getUserToken(){
        return localStorage.getItem('userToken');
    }
    storeUserToken( token ){
        localStorage.userToken = token;
    }
    processTodoList( data, status, request ){
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
    displayModal( content ){
        this.domElements.modalShadow.removeClass('hidden');
        this.domElements.modalClose.off('click').click( this.hideModal );
        this.domElements.modalContent.html( content );
    }
    hideModal(){
        this.domElements.modalShadow.addClass('hidden');
    }
    view_create(){
        var clone = $($('#todoDetails').text());
        var editableFields = ['.title', '.description'];
        var removedFields = ['.added','.controls'];
        editableFields.forEach( field => clone.find(field).attr('contentEditable','editabe').addClass('editable'));
        removedFields.forEach( field => clone.find(field).remove());
        return clone;
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
    goCreate(){
        this.view = 'create';
        this.renderCurrentView();
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
        this.domElements.createButton = $("<button>",{
            class: 'createButton',
            text: '+',
            on: {
                click: this.goCreate
            }
        })
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