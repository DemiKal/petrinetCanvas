<?php
require 'vendor/autoload.php';
$name=$_GET["name"];
$city=$_GET["city"];
$jsonStringPetrinet = $_GET["graph"];

$jsonGraph= json_decode($jsonStringPetrinet);


$myObj = new \stdClass();
$myObj->name = $name;
$myObj->city = $city;
$myObj->graph = $jsonGraph;




$myJSON = json_encode($myObj);



//echo $myJSON;



//code for sending json
//new instance of manager
$client = new MongoDB\Client;

// //select database
$db = $client->test;

// //select collection
$collection = $db->graphstest;
//$result = $collection->insert($jsonGraph);
//var_dump($result);
// //find 
//$d = $inventory->find([]);
echo $collection.count();
// foreach ($collection as $doc) 
// {
//     $bson = MongoDB\BSON\fromPHP($doc);
//     echo MongoDB\BSON\toJSON($bson);
//     //frontend will have to parse as json
// }
?>