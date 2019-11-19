
class TodoItem{
    constructor(dataObject, clickCallback, tokenReceivedCallback){
        this.receiveItemInfo = this.receiveItemInfo.bind( this );
        this.handleClick = this.handleClick.bind( this );
        this.itemUpdated = this.itemUpdated.bind( this );
        this.toggleUpdateStatus = this.toggleUpdateStatus.bind( this );
        this.saveChanges = this.saveChanges.bind ( this );
        this.cancelChanges = this.cancelChanges.bind ( this );
        this.updateListStatus = this.updateListStatus.bind( this );
        this.clickCallback = clickCallback;
        this.receivedTokenCallback = tokenReceivedCallback;
        this.editableElements = [];
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
                updateControls: null,
                saveButton: null,
                cancelButton: null
            }
        }
        this.detailsRendered = false;
    }
    handleClick( ){
        this.clickCallback( this );
    }
    updateDomElements(){
        this.domElements.list.title.text( this.data.title);
        this.domElements.list.added.text( this.data.added );
        if(this.data.completed==='completed'){
            this.domElements.list.completedCheckbox.prop('checked', true);
        }
    }
    renderList(){
        this.domElements.list.container = $("<div>",{
            class: 'todoListItem',
            on: {
                click: this.handleClick
            }
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
            type: 'checkbox',
            on: {
                click: this.updateListStatus
            }
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
    updateItemInfo( updateData ){
        updateData.id = this.data.id;
        var ajaxOptions = {
            'url': './api/puttodoitems.php',
            'data': updateData,
            'headers': {
                'token': localStorage.getItem('userToken')
            },
            'dataType': 'json',
            'method': 'post',
            'success': this.itemUpdated
        }
        $.ajax( ajaxOptions );        
    }
    itemUpdated( data ){
        this.cancelChanges();
        this.getItemInfo();
    }
    getItemInfo(){
        var ajaxOptions = {
            'url': './api/gettodoitems.php',
            'data': {
                id: this.data.id
            },
            'headers': {
                'token': localStorage.getItem('userToken')
            },
            'dataType': 'json',
            'method': 'get',
            'success': this.receiveItemInfo
        }
        $.ajax( ajaxOptions );
    }
    receiveItemInfo( data, status, request ){
        if(request.getResponseHeader('userToken')){
            this.tokenReceivedCallback(request.getResponseHeader('userToken') );
        }
        this.data.title = data.title;
        this.data.completed = data.completed;
        this.data.description = data.description;
        this.data.added = data.added;
        this.updateDomElements()
        this.updateDetails();      
    }
    updateDetails(){
        if(!this.detailsRendered){
            return; //we haven't displayed an item detail data set yet
        }
        this.domElements.details.title.text(this.data.title);
        var dateAdded = new Date( this.data.added );
        this.domElements.details.added[0].valueAsNumber = dateAdded.getTime();
        this.domElements.details.description.text(this.data.description);
        this.domElements.details.completedCheckbox.prop('checked', this.data.completed==='completed');       
    }
    displaySaveCancelInterface(){
        this.domElements.updateControls.removeClass('hidden');
    }
    hideSaveCancelInterface(){
        if(!this.detailsRendered){
            return; //we haven't displayed an item detail data set yet
        }
        this.domElements.updateControls.addClass('hidden');
    }
    toggleUpdateStatus( event ){
        $(event.target).addClass('editable').attr('contentEditable',true);
        this.displaySaveCancelInterface();
    }
    cancelChanges( ){
        this.updateDetails();
        this.hideSaveCancelInterface();
        for(var elementIndex = 0; elementIndex < this.editableElements.length; elementIndex++){
            this.editableElements[elementIndex].removeClass('editable');
        }
    }
    getElementContents( element ){
        switch( element.prop('nodeName')){
            case 'INPUT':
                if(element.attr('type')==='checkbox'){
                    if(element.is(':checked')){
                        return element.val();
                    } else {
                        return '';
                    }
                }
            case 'TEXTAREA':
                return element.val();
            default:
                return element.text();
        }
    }
    updateListStatus(event){
        event.stopPropagation();
        var element = this.domElements.list.completedCheckbox;
        var value = null;
        if( element.is(':checked') ){
            value = 'completed';
        } else {
            value = 'active';
        }
        this.updateItemInfo( { completed : value });
    }
    saveChanges(){
        var changedData = {};
        var updateCount = 0;
        for( var elementIndex = 0; elementIndex < this.editableElements.length; elementIndex++){
            var targetElement = this.editableElements[elementIndex];
            var name = targetElement.attr('name');
            var value = this.getElementContents(targetElement);
            if(name==='completed' ){
                if(value){
                    value = 'completed';
                } else {
                    value = 'active';
                }
            } 
            if(  value !== this.data[name]){
                changedData[name] = value;
                updateCount++;
            }
        }
        if(updateCount){
            this.updateItemInfo( changedData );
        }
    }
    renderDetails(){
        var clone = $($("#todoDetails").text());
        clone.find('.updatable').on('click',this.toggleUpdateStatus);
        this.domElements.details.container = clone;
        this.domElements.updateControls = clone.find('.updateControls');
        this.domElements.saveButton = clone.find('.updateControls .saveButton');
        this.domElements.saveButton.click( this.saveChanges );
        this.domElements.cancelButton = clone.find('.updateControls .cancelButton');
        this.domElements.cancelButton.click( this.cancelChanges );
        this.domElements.details.title = clone.find('.title');
        this.domElements.details.added = clone.find('.added');
        this.domElements.details.description = clone.find('.description');
        this.domElements.details.controlContainer = clone.find('.controls');
        this.domElements.details.completedCheckbox = clone.find('.completeCheckbox');
        for( var elementKey in this.domElements.details ){
            if($(this.domElements.details[elementKey]).hasClass('updatable')){
                this.editableElements.push( this.domElements.details[elementKey] );
            }
        }
        this.updateDetails();
        this.detailsRendered = true;
        return this.domElements.details.container;
    }
}