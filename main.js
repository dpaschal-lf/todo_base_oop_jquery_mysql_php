

var todoApp = null;

$(document).ready( startApp );

function startApp(){
    todoApp = new TodoController('#todoApp', '#tododetails');
    todoApp.render();
}