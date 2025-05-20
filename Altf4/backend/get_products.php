<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require_once("db_config.php");

$sql = "SELECT * FROM products";
$result = $conn->query($sql);

$products = [];

while ($row = $result->fetch_assoc()) {
    $row['images'] = json_decode($row['images']); // Decodifica JSON da DB
    $row['sizes'] = json_decode($row['sizes']);
    $products[] = $row;
}

echo json_encode($products);
$conn->close();
?>
