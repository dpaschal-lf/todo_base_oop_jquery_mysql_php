<?php
require_once('functions.php');
set_exception_handler('handleExceptions');
require_once('mysqlconnect.php');
require_once('validateuser.php');

$userID = validateUser();

if(empty($_POST['id'])){
    throw new Exception('todo item id must be supplied');
}
$id = intval($_POST['id']);

$query = "DELETE FROM `items` WHERE `id`=$id AND `userID`=$userID";

$result = mysqli_query($db, $query);

if(!$result){
    throw new Exception('unable to delete id '.$id . ' : ' . mysqli_error($db));
}

if(mysqli_affected_rows($db)===0){
    throw new Exception('unable to update data '. mysqli_error($db));
}

print( json_encode( ['success'=>true] ));


?>