<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require_once("db_config.php");

if (!isset($_GET['id'])) {
    echo json_encode(["error" => "ID mancante"]);
    exit;
}

$id = intval($_GET['id']);
$stmt = $conn->prepare("SELECT * FROM products WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    echo json_encode($row);
} else {
    echo json_encode(["error" => "Prodotto non trovato"]);
}

$conn->close();
?>
