<?php

if(!function_exists('handleExceptions')){
    function handleExceptions( $error ){
        http_response_code(500);
        print( json_encode( ['error'=> $error->getMessage()] ));
    }
}

?>