import express from 'express';
import cors from 'cors';
import fs from 'fs';
import mariadb from 'mariadb';
import path from 'path';
import { fileURLToPath } from 'url';

// Risolvi __dirname in ambiente ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurazione del server Express
const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));  // Permette richieste da React

// Configurazione del pool di connessioni a MariaDB
const pool = mariadb.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '123456',
  database: 'altf4',
  connectionLimit: 5,
});

// Funzione per resettare le tabelle e popolare il database da data.tsv all'avvio
async function initDb() {
  let conn;
  try {
    conn = await pool.getConnection();

    // Drop e ricreazione delle tabelle
    await conn.query('DROP TABLE IF EXISTS partita');
    await conn.query('DROP TABLE IF EXISTS team');
    await conn.query(`
      CREATE TABLE team (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL UNIQUE
      )
    `);
    await conn.query(`
      CREATE TABLE partita (
        id INT AUTO_INCREMENT PRIMARY KEY,
        team_alt VARCHAR(255) NOT NULL,
        team_enemy VARCHAR(255) NOT NULL,
        data DATE NOT NULL,
        ora TIME NOT NULL,
        risultato VARCHAR(50),
        FOREIGN KEY (team_alt) REFERENCES team(nome),
        FOREIGN KEY (team_enemy) REFERENCES team(nome)
      )
    `);
    console.log('Tabelle team e partita resettate');

    // Lettura e popolamento da data.tsv (file nella cartella superiore a src/)
    const dataPath = path.join(__dirname, '..', 'data.tsv');
    const file = fs.readFileSync(dataPath, 'utf-8');
    const lines = file.trim().split('\n');
    lines.shift(); // rimuove intestazione

    for (const line of lines) {
      const [team_alt, team_enemy, dataPartita, oraPartita, risultatoRaw] = line.split('\t');
      const [gg, mm, aaaa] = dataPartita.split('/');
      const dataISO = `${aaaa}-${mm.padStart(2, '0')}-${gg.padStart(2, '0')}`;

      // Inserimento dei team
      await conn.query('INSERT IGNORE INTO team(nome) VALUES(?)', [team_alt]);
      await conn.query('INSERT IGNORE INTO team(nome) VALUES(?)', [team_enemy]);

      // Inserimento della partita
      await conn.query(
        `INSERT INTO partita (team_alt, team_enemy, data, ora, risultato)
         VALUES (?, ?, ?, ?, ?)`,
        [team_alt, team_enemy, dataISO, oraPartita, risultatoRaw || null]
      );
    }
    console.log('Database popolato da data.tsv');
  } catch (err) {
    console.error("Errore durante l'inizializzazione del DB:", err);
  } finally {
    if (conn) conn.release();
  }
}

// Endpoint per restituire le partite
app.get('/partite', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      `SELECT team_alt, team_enemy, data, ora, risultato
       FROM partita
       ORDER BY data, ora`
    );

    const result = rows.map(r => ({
      team_alt: r.team_alt,
      team_enemy: r.team_enemy,
      data: r.data.toISOString().slice(0, 10),
      ora: r.ora.slice(0, 5),
      risultato: r.risultato
    }));

    res.json(result);
  } catch (err) {
    console.error('Errore in /partite:', err);
    res.status(500).json({ errore: err.message });
  } finally {
    if (conn) conn.release();
  }
});

// Avvio del server
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
  initDb();
});
