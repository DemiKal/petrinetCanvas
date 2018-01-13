<?php
require 'vendor/autoload.php';
$name=$_GET["name"];
$city=$_GET["city"];
$jsonStringPetrinet = $_GET["graph"];

$jsonGraph= json_decode($jsonPetrinet);


$myObj = new \stdClass();
$myObj->name = $name;
$myObj->city = $city;
$myObj->graph = $$jsonGraph;




$myJSON = json_encode($myObj);



echo $myJSON;



//code for sending json
//new instance of manager
// $client = new MongoDB\Client;

// //select database
// $db = $client->PetrinetDatabase;

// //select collection
// $inventory  = $db->users;

// //find 
// $d = $inventory->find([]);

// foreach ($d as $doc) 
// {
//     $bson = MongoDB\BSON\fromPHP($doc);
//     echo MongoDB\BSON\toJSON($bson);
//     //frontend will have to parse as json
// }
?>