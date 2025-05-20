<?php
header("Access-Control-Allow-Origin: *");
require_once("db_config.php");
header("Content-Type: application/json");

$username = $_POST['username'] ?? '';
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';
$confirmPassword = $_POST['confirmPassword'] ?? '';

// Controlli di base
if (!$username || !$email) {
  echo json_encode(["success" => false, "error" => "Dati mancanti"]);
  exit;
}

// Validazione email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  echo json_encode(["success" => false, "error" => "Email non valida. Deve contenere una @ e un dominio."]);
  exit;
}

// Validazione username
if (!preg_match('/^[a-zA-Z0-9]{3,10}$/', $username)) {
  echo json_encode(["success" => false, "error" => "Username non valido. Deve essere di 3-10 caratteri e contenere solo lettere o numeri."]);
  exit;
}

// Password update se desiderato
if (!empty($password)) {
  if ($password !== $confirmPassword) {
    echo json_encode(["success" => false, "error" => "Le password non coincidono"]);
    exit;
  }

  $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
  $stmt = $conn->prepare("UPDATE utenti SET username = ?, password = ? WHERE email = ?");
  $stmt->bind_param("sss", $username, $hashedPassword, $email);
} else {
  $stmt = $conn->prepare("UPDATE utenti SET username = ? WHERE email = ?");
  $stmt->bind_param("ss", $username, $email);
}

if ($stmt->execute()) {
  echo json_encode(["success" => true]);
} else {
  echo json_encode(["success" => false, "error" => "Errore aggiornamento"]);
}

$conn->close();
?>
