<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
session_start();
require_once("db_config.php");

$email = $_POST['email'] ?? '';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["success" => false, "error" => "Email non valida. Assicurati che contenga una '@' e un dominio corretto come '.com' o '.it'."]);
  exit;
}

$username = $_POST['username'] ?? '';
if (!preg_match('/^[a-zA-Z0-9]{3,12}$/', $username)) {
    echo json_encode(["success" => false, "error" => "Username non valido. Deve essere di 3-12 caratteri e contenere solo lettere o numeri."]);
    exit;
}
// Verifica se username già registrato
$checkStmt = $conn->prepare("SELECT email FROM utenti WHERE username = ?");
$checkStmt->bind_param("s", $username);
$checkStmt->execute();
$checkResult = $checkStmt->get_result();

if ($checkResult->num_rows > 0) {
    echo json_encode(["success" => false, "error" => "Username già in uso, scegline un altro."]);
    exit;
}


$password = $_POST['password'] ?? '';

if (!$email || !$username || !$password) {
    echo json_encode(["success" => false, "error" => "Tutti i campi sono obbligatori"]);
    exit;
}

$hashed = password_hash($password, PASSWORD_DEFAULT);

$stmt = $conn->prepare("INSERT INTO utenti (email, username, password) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $email, $username, $hashed);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => "Email già registrata o errore DB"]);
}
?>
