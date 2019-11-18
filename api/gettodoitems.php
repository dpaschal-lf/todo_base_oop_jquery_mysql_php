<?php
require_once('functions.php');
set_exception_handler('handleExceptions');
require_once('mysqlconnect.php');
require_once('validateuser.php');

$userID = validateUser();

$fields = '`title`, `added`, `id`, `completed`';
$id = false;
$subQuery = '';
if(!empty($_GET['id'])){
    if(!is_numeric($_GET['id'])){
        throw new Exception('id must be a number');
    }
    $id = intval($_GET['id']);
    if($id<1){
        throw new Exception('id must be greater than 0');
    }
    $fields .= ',`description`';
    $subQuery = 'WHERE `id`='.$id;
} 

$query = "SELECT $fields FROM `items` $subQuery WHERE `userID`=0 OR `userID` = $userID";

$result = mysqli_query($db, $query);

if(!$result){
    throw new Exception('query failed: '.mysqli_error($db));
}

if($id){
    if(mysqli_num_rows($result)===0){
        throw new Exception('invalid ID ' . $id);
    }
    $data = mysqli_fetch_assoc($result);
} else {
    $data = [];

    while($row = mysqli_fetch_assoc($result)){
        $data[] = $row;
    }
}

print( json_encode( $data ));


?>