<?php
require 'vendor/autoload.php';
$name=$_GET["name"];

//new instance of manager
$client = new MongoDB\Client;

// //select database
$db = $client->test;

// //select collection
$collection = $db->graphstest;

$myObj = new \stdClass();
$myObj->graphs = [];

$query = ['name' => $name];

try {
    $result = $collection->find($query);

    $returnlist = [];

    foreach ($result as $c) {
        $returnlist[] = $c;
    }
    $myObj->graphs = $returnlist;
    $myObj->status = "OK";
    //$enc = json_encode($myObj);
    $bson = MongoDB\BSON\fromPHP($myObj);
    echo MongoDB\BSON\toJSON($bson);

 
} catch (MongoCursorException $e) {
    echo `{"status":"NOT OK"}`;
}
 


// foreach ($collection as $doc)
// {
//     $bson = MongoDB\BSON\fromPHP($doc);
//     echo MongoDB\BSON\toJSON($bson);
//     //frontend will have to parse as json
// }
