<?php
require 'vendor/autoload.php';
// $myObj = new \stdClass();
// $myObj->name = "John";
// $myObj->age = 30;
// $myObj->city = "New York";

// $myJSON = json_encode($myObj);

// echo $myJSON;



//code for sending json
//new instance of manager
$client = new MongoDB\Client;

//select database
$db = $client->test;

//select collection
$inventory  = $db->inventory;

//find 
$d = $inventory->find([]);

foreach ($d as $doc) 
{
    $bson = MongoDB\BSON\fromPHP($doc);
    echo MongoDB\BSON\toJSON($bson);
    //frontend will have to parse as json
}
?>