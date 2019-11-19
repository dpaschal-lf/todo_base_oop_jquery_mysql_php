

var todoApp = null;

$(document).ready( startApp );

function startApp(){
    todoApp = new TodoController('#todoApp', {
        shadow: '#modalShadow',
        body: '#modalBody',
        close: '#modalClose',
        content: '#modalContents',
    });
    todoApp.render();
    todoApp.loadTodoList();
    
}