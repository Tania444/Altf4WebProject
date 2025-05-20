<?php
$host = "localhost";
$user = "root"; // o il tuo utente
$password = "123456"; // o la tua password
$dbname = "altf4";

$conn = new mysqli($host, $user, '', $dbname);

if ($conn->connect_error) {
    die("Connessione fallita: " . $conn->connect_error);
}
?>
