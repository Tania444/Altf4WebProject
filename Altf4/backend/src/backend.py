"""
ALT+F4 - Backend di gestione partite

Effettua la connessione a MariaDB e popola il database 'altf4' usando il file data.tsv.
Include funzioni per inserire team e visualizzare tutte le partite registrate nel database.

Funzioni disponibili:
- inserisci_team(nome_team): Inserisce un team nel database se non è già presente
- stampa_partite(): Stampa tutte le partite registrate nel database

"""

import csv
import mariadb
import sys

#da eliminare solo per verificare in quale cartella mi trovo
import os
print("Sto cercando in:", os.getcwd())
print("File nella cartella:")
print(os.listdir())

# Configurazione connessione al database
try:
    conn = mariadb.connect(
        user="root",
        password="123456",
        host="localhost",
        port=3306,
        database="altf4"
    )
except mariadb.Error as e:
    print(f"Errore nella connessione al database: {e}")
    sys.exit(1)

cursor = conn.cursor()

# Funzione: inserisce un team solo se non esiste
def inserisci_team(nome_team):
    try:
        cursor.execute("INSERT IGNORE INTO team (nome) VALUES (?)", (nome_team,))
        print(f"Team '{nome_team}' inserito (o già presente)")
    except mariadb.Error as e:
        print(f"Errore nell'inserimento del team '{nome_team}': {e}")

# Funzione: stampa tutte le partite registrate
def stampa_partite():
    try:
        conn2 = mariadb.connect(
            user="root",
            password="123456",
            host="localhost",
            port=3306,
            database="altf4"
        )
        cursor2 = conn2.cursor()

        cursor2.execute("""
            SELECT team_alt, team_enemy, data, ora, risultato
            FROM partita
            ORDER BY data, ora
        """)

        partite = cursor2.fetchall()

        print("\nPartite registrate:\n")
        for p in partite:
            team_alt, team_enemy, data, ora, risultato = p
            risultato = risultato or "-"
            print(f"{data} {ora} — {team_alt} vs {team_enemy} → {risultato}")

        cursor2.close()
        conn2.close()

    except mariadb.Error as e:
        print(f"Errore durante la connessione o la query: {e}")

# Popolamento database da file TSV
def importa_partite_da_tsv(percorso_file='data.tsv'):
    print("\nImportazione partite da TSV in corso...\n")
    try:
        with open(percorso_file, 'r', encoding='utf-8') as file_tsv:
            lettore = csv.reader(file_tsv, delimiter='\t')
            next(lettore)  # Salta intestazione

            for riga in lettore:
                if len(riga) != 5:
                    print(f"Riga malformata: {riga}")
                    continue

                team_alt, team_enemy, data_partita, ora_partita, risultato = riga

                # Conversione data da gg/mm/aaaa a aaaa-mm-gg
                try:
                    giorno, mese, anno = data_partita.strip().split('/')
                    data_partita = f"{anno}-{mese.zfill(2)}-{giorno.zfill(2)}"
                except ValueError:
                    print(f"Formato data non valido: {data_partita}")
                    continue

                inserisci_team(team_alt.strip())
                inserisci_team(team_enemy.strip())

                try:
                    cursor.execute("""
                        INSERT INTO partita (team_alt, team_enemy, data, ora, risultato)
                        VALUES (?, ?, ?, ?, ?)
                    """, (team_alt.strip(), team_enemy.strip(), data_partita, ora_partita.strip(), risultato.strip() or None))
                    print(f"Partita inserita: {team_alt} vs {team_enemy} ({data_partita})")
                except mariadb.Error as e:
                    print(f"Errore inserimento partita: {e}")

        conn.commit()
        print("\nImportazione completata\n")

    except FileNotFoundError:
        print("Il file data.tsv non è stato trovato.")
    except Exception as e:
        print(f"Errore durante la lettura del file: {e}")

# Esegui automaticamente il popolamento solo se il file viene eseguito direttamente
if __name__ == "__main__":
    importa_partite_da_tsv()
    stampa_partite()
    cursor.close()
    conn.close()
