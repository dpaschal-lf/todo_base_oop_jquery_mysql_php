

var todoApp = null;

$(document).ready( startApp );

function startApp(){
    todoApp = new TodoController('#todoApp', {
        modalShadow: '#modalShadow',
        modalBody: '#modalBody',
        modalClose: '#modalClose',
        modalContent: '#modalContent',
    });
    todoApp.render();
    todoApp.loadTodoList();
    
}