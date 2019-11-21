<?php

require_once('mysqlconnect.php');

function prepare_statement($query, $params){
    global $db;
    if(strlen($query)===0){
        return false;
    }
    if(!is_array($params)){
        return false;
    }
    if(!is_object($db)){
        return false;
    } 
    $statement = $db->prepare($query);
    if(!$statement){
        throw new Exception('error with prepared statement: '.$query. ' : '.$db->error);
    }
    $paramTypes = '';
    foreach($params AS $value){
        if(is_string($value)){
            $paramTypes .= 's';
        } else if(is_integer($value)){
            $paramTypes .= 'i';
        } else if(is_double($value)){
            $paramTypes .= 'd';
        } else {
            $paramTypes .= 'b';
        }
    }
    array_unshift($params, $paramTypes );
    //warning: wanted 2nd param to be a reference var, but complained when I made it a reference var.  Shut up, warning.  TODO: why?
    @call_user_func_array([$statement, 'bind_param'], $params);
    $statementResult = $statement->execute();
    if(substr($query, 0, 6) === 'SELECT'){
        return $statement->get_result(); 
    }

    return $statement;
}


$query = "SELECT * FROM items WHERE `id`=?";

$statement = mysqli_prepare($db, $query);

$test = [4,2,3];
$types = 's';

//mysqli_stmt_bind_param($statement, 's', $test[0]);

@call_user_func_array([$statement, 'bind_param'], [$types,$test[0]]);

mysqli_execute($statement);

$result = mysqli_stmt_get_result($statement);

$row = mysqli_fetch_assoc($result);

print_r($row);




?>