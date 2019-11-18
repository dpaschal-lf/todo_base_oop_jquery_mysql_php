<?php
require_once('functions.php');
set_exception_handler('handleExceptions');
require_once('mysqlconnect.php');
require_once('validateuser.php');

$userID = validateUser();
$requiredField = ['title','description'];
foreach($requiredField as $field){
    if(empty($_POST[$field])){
        throw new Exception("$field cannot be empty");
    }
}

$query = 'INSERT INTO `items` SET `title`=?, `description`=?, `added`=NOW(), `completed`="active", `userID`=?';

$statement = prepare_statement($query, [$_POST['title'], $_POST['description'], $userID]);

if(mysqli_affected_rows($db)===0){
    throw new Exception('unable to insert data '. mysqli_error($db));
}

print( json_encode( ['success'=>true] ));


?>