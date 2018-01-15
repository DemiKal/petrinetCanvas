<?php
require 'vendor/autoload.php';
 
$username = $_GET["name"];

//new instance of manager
$client = new MongoDB\Client;

// //select database
$db = $client->test;

// //select collection
$graphCollection = $db->graphstest;
$userCollection = $db->Users;

$myObj = new \stdClass();
$myObj->graphs = [];

try {
    $lvls = $graphCollection->find(['name' => "Admin"]);
    $user = $userCollection->findOne(['name' => $username]);
   // $users = $userCollection->find();//One(['name' => $username]);
    
    

    $returnlist = [];
    foreach ($lvls as $c) {
        $returnlist[] = $c;
    }

    $myObj->graphs = $returnlist;
    $myObj->status = "OK";
    $myObj->user = $user;
    
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
