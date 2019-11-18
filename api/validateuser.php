<?php
if(!function_exists('createKey')){
    function createKey($length=40){
        $str = '';
        $characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
        $charactersLength = strlen($characters);
        while( $length > 0){
            $charIndex = rand(0,$charactersLength-1);
            $char = $characters[$charIndex];
            $str .= $char;
            $length--;
        }
        return $str;
    }
}
if(!function_exists('validateUser')){
    function validateUser(){
        global $db;
        $headers = getallheaders();
        if(empty($headers['token'])){
            $token = createKey();
            $query = "INSERT INTO `users` SET `key`= '$token', `added`=NOW()";
            $result = mysqli_query($db, $query);
            if(!$result){
                throw new Exception('error creating user: '.mysqli_error($db));
            }
            $id = mysqli_insert_id($db);
            header('userToken: ' . $token);
        } else {
            $token = $headers['token'];
            $query = 'SELECT `id` FROM `users` WHERE `key` = ?';
            $statement = mysqli_prepare($db, $query);
            if(!$statement){
                throw new Exception('error processing statemnt');
            }
            mysqli_bind_param($statement, 's',$token);
            $result = mysqli_stmt_execute($statement);
            if(!$result){
                throw new Exception('error fetching data for user');
            }
            if(mysqli_num_rows($result)===0){
                throw new Exception('token not valid');
            }
            $id= mysqli_fetch_assoc($result)['id'];
        }
        return $id;
    }
}


?>