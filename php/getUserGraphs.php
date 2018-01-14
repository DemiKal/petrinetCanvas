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
$myObj->author = $name;
$myObj->graph = $jsonGraph;

//$result = $collection->insert($jsonGraph);
//var_dump($result);
// //find 
//$d = $inventory->find([]);
echo $collection->count();

// foreach ($collection as $doc) 
// {
//     $bson = MongoDB\BSON\fromPHP($doc);
//     echo MongoDB\BSON\toJSON($bson);
//     //frontend will have to parse as json
// }
?>