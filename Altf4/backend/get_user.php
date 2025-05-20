<?php
header("Access-Control-Allow-Origin: *"); //sintonizzo gli indirizzi

require_once("db_config.php");

header("Content-Type: application/json");

// Verifica se l'email è presente nella richiesta POST
if (!isset($_POST['email']) || empty(trim($_POST['email']))) {
    echo json_encode(["error" => "Email non fornita"]);
    exit;
}

$email = trim($_POST['email']);

// Prepara la query
$stmt = $conn->prepare("SELECT username, email FROM utenti WHERE email = ?");
if (!$stmt) {
    echo json_encode(["error" => "Errore nella preparazione della query"]);
    exit;
}

$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

// Verifica se l'utente esiste
if ($user = $result->fetch_assoc()) {
    echo json_encode($user);
} else {
    echo json_encode(["error" => "Utente non trovato"]);
}

$stmt->close();
$conn->close();
?>
