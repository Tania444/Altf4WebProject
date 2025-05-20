<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

session_start();
require_once("db_config.php");

$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

if (!$email || !$password) {
    echo json_encode(["success" => false, "error" => "Tutti i campi sono obbligatori"]);
    exit;
}

$stmt = $conn->prepare("SELECT * FROM utenti WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if ($user && password_verify($password, $user['password'])) {
    $_SESSION['email'] = $user['email'];
    $_SESSION['username'] = $user['username'];
    echo json_encode([
        "success" => true,
        "username" => $user['username'],
        "email" => $user['email'] // 👈 Serve per il profilo
    ]);
} else {
    echo json_encode(["success" => false, "error" => "Credenziali errate"]);
}
?>
