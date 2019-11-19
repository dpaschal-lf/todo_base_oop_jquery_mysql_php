<?php
require_once('functions.php');
set_exception_handler('handleExceptions');
require_once('mysqlconnect.php');
require_once('validateuser.php');

$userID = validateUser();

if(empty($_POST['id'])){
    throw new Exception('todo item id must be supplied');
}
$possibleField = ['title','description','completed'];
$occuringCount = 0;
$updateFields = '';
$updateValues = [];
foreach($possibleField as $field){
    if(!empty($_POST[$field])){
        $occuringCount++;
        $updateFields .= "{$field}=?,";
        $updateValues[] = $_POST[$field];
    }
}
if($occuringCount === 0){
    throw new Exception('must include one of the following fields: '. implode(', ', $possibleField));
}
$updateFields = substr($updateFields, 0, -1);
$query = "UPDATE `items` SET {$updateFields} WHERE id=?";
$updateValues[] = $_POST['id'];

$statement = prepare_statement($query, $updateValues );

if(mysqli_affected_rows($db)===0){
    throw new Exception('unable to update data '. mysqli_error($db));
}

print( json_encode( ['success'=>true] ));


?>