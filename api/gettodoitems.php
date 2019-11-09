<?php

require_once('mysqlconnect.php');

$query = 'SELECT `title`, `added`, `id`, `completed` FROM `items`';

$result = mysqli_query($db, $query);

if(!$result){
    print('query failed: '.mysqli_error($db));
    exit();
}

$data = [];

while($row = mysqli_fetch_assoc($result)){
    $data[] = $row;
}

print( json_encode( $data ));


?>