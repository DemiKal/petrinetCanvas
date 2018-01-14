<?php
require 'vendor/autoload.php';

$name = $_POST['name'];
$title = $_POST['title'];
$graph = $_POST['graph'];

//new instance of manager
$client = new MongoDB\Client;

// //select database
$db = $client->test;

// //select collection
$collection = $db->graphstest;

$myObj = new \stdClass();
$myObj->name = $name;
$myObj->title = $title;
$myObj->graph = $graph;

try{
    $result = $collection->insertOne($myObj);
    $resp = new \stdClass();
    $resp->status = 'success'; 
    $resp->message  = $result; 
    
    echo(json_encode($resp));
    //echo "Upload succesful!";
     
}
catch (MongoCursorException $e) {
    echo "error message: ".$e->getMessage()."\n";
    echo "error code: ".$e->getCode()."\n";
    $response_array['status'] = 'error';  
}

//var_dump($result);

//var_dump($result);
// //find 
//$d = $inventory->find([]);
//echo $collection->count();

// foreach ($collection as $doc) 
// {
//     $bson = MongoDB\BSON\fromPHP($doc);
//     echo MongoDB\BSON\toJSON($bson);
//     //frontend will have to parse as json
// }
?>