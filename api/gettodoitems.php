<?php
require_once('functions.php');
set_exception_handler('handleExceptions');
require_once('mysqlconnect.php');

$fields = '`title`, `added`, `id`, `completed`';
$id = false;
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

$query = "SELECT $fields FROM `items` $subQuery";

$result = mysqli_query($db, $query);

if(!$result){
    throw new Exception('query failed: '.mysqli_error($db));
}

if($id){
    $data = mysqli_fetch_assoc($result);
} else {
    $data = [];

    while($row = mysqli_fetch_assoc($result)){
        $data[] = $row;
    }
}

print( json_encode( $data ));


?>