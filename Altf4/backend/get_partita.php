<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Connessione al database MariaDB
$host = 'localhost';
$user = 'root';
$password = ''; // Lascia vuoto se usi XAMPP
$database = 'altf4';

// Connessione
$conn = new mysqli($host, $user, $password, $database);

// Controlla errori di connessione
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Errore di connessione al database']);
    exit();
}

// Query per prendere tutte le partite
$sql = "SELECT team_alt, team_enemy, data, ora, risultato FROM partita ORDER BY data, ora";
$result = $conn->query($sql);

$partite = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $partite[] = [
            'team_alt' => $row['team_alt'],
            'team_enemy' => $row['team_enemy'],
            'data' => $row['data'],
            'ora' => substr($row['ora'], 0, 5), // Solo ore:minuti
            'risultato' => $row['risultato']
        ];
    }
    echo json_encode($partite);
} else {
    echo json_encode([]);
}

$conn->close();
?>