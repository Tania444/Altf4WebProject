<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
$slug = $_GET['slug'] ?? '';

$conn = new mysqli("localhost", "root", "", "altf4"); // cambia DB se necessario

if ($conn->connect_error) {
  http_response_code(500);
  echo json_encode(["error" => "Database connection failed"]);
  exit();
}

$stmt = $conn->prepare("SELECT * FROM games WHERE slug = ?");
$stmt->bind_param("s", $slug);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
  $row['membri'] = json_decode($row['membri']);
  echo json_encode($row);
} else {
  http_response_code(404);
  echo json_encode(["error" => "Game not found"]);
}

$conn->close();
?>
