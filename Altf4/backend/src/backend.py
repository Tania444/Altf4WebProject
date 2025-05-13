"""
Documentazione dell'app ALT+F4
----------------------------------
!!! ATTENZIONE !!! 
PER USARE QUESTO SCRIPT DOVETE INSTALLARE MariaDB, vi metto il link cosi tutti usiamo lo stesso,

https://dlm.mariadb.com/4257323/MariaDB/mariadb-11.4.6/winx64-packages/mariadb-11.4.6-winx64.msi

durante l'installazione inserite la password quando ve la chiede e metteteci 123456, non vi dovrebbe
far impostare l'username se siete da windows, comunque lasciate root.
Creare le cartelle come vi mandero in foto che almeno ce le abbiamo tutti uguali, non mi va di setuppare
il git hub se no avremmo gia' risolto il problema
Per ora l'ho testata e funziona, se non runna state facendo qualcosa di sbagliato, chiedete a chat,
particolare attenzione al file data.tsv, che vi allego su discord, perche' deve stare all'interno della
cartella backend
!!!FINE ATTENZIONE!!!

backend.py
effettua la connessione a Mariadb
popola il database altf4 da data.tsv gestendo errori
funzioni:-inserisci team -inserisce team nel database se non presente
         -stampa partite -stampa tutte le partite all'interno del database utile per vedere se il database e' stato popolato correttamente

         
P.S fatemi sapere se vi piace la documentazione scritta cosi', da quel che ho capito il bro ci fa caso a come la scriviamo
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
import csv
import mariadb
import sys

# Configurazione della connessione
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

# Funzione per inserire un team se non esiste
def inserisci_team(nome_team):
    try:
        cursor.execute("INSERT IGNORE INTO team (nome) VALUES (?)", (nome_team,))
    except mariadb.Error as e:
        print(f"Errore nell'inserimento del team {nome_team}: {e}")

def stampa_partite():
    try:
        conn = mariadb.connect(
            user="root",
            password="123456",
            host="localhost",
            port=3306,
            database="altf4"
        )
        cursor = conn.cursor()

        cursor.execute("""
            SELECT team_alt, team_enemy, data, ora, risultato
            FROM partita
            ORDER BY data, ora
        """)

        partite = cursor.fetchall()

        print("\nPartite registrate:\n")
        for p in partite:
            team_alt, team_enemy, data, ora, risultato = p
            risultato = risultato or "—"
            print(f"{data} {ora} — {team_alt} vs {team_enemy} → {risultato}")

        cursor.close()
        conn.close()

    except mariadb.Error as e:
        print(f"Errore durante la connessione o la query: {e}")


# Lettura del file TSV e inserimento dei dati
with open('data.tsv', 'r', encoding='utf-8') as file_tsv:
    lettore = csv.reader(file_tsv, delimiter='\t')
    next(lettore)  # salta intestazione

    for riga in lettore:
        if len(riga) != 5:
            print(f"Riga malformata: {riga}")
            continue

        team_alt, team_enemy, data_partita, ora_partita, risultato = riga

        # Converti la data da gg/mm/aaaa a aaaa-mm-gg
        try:
            giorno, mese, anno = data_partita.strip().split('/')
            data_partita = f"{anno}-{mese}-{giorno}"
        except ValueError:
            print(f"Formato data non valido: {data_partita}")
            continue

        # Inserimento dei team
        inserisci_team(team_alt)
        inserisci_team(team_enemy)

        # Inserimento della partita
        try:
            cursor.execute("""
                INSERT INTO partita (team_alt, team_enemy, data, ora, risultato)
                VALUES (?, ?, ?, ?, ?)
            """, (team_alt, team_enemy, data_partita, ora_partita, risultato if risultato else None))
        except mariadb.Error as e:
            print(f"Errore nell'inserimento della partita: {e}")

# Salvataggio delle modifiche e chiusura della connessione
conn.commit()
cursor.close()
conn.close()

app = FastAPI()

# Abilita richieste da localhost:3000 (React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/partite")
def get_partite():
    try:
        conn = mariadb.connect(
            user="root",
            password="123456",
            host="localhost",
            port=3306,
            database="altf4"
        )
        cursor = conn.cursor()

        cursor.execute("""
            SELECT team_alt, team_enemy, data, ora, risultato
            FROM partita
            ORDER BY data, ora
        """)

        rows = cursor.fetchall()

        result = [
            {
                "team_alt": r[0],
                "team_enemy": r[1],
                "data": r[2].isoformat(),
                "ora": str(r[3])[:-3],  # "18:00:00" → "18:00"
                "risultato": r[4]
            }
            for r in rows
        ]

        cursor.close()
        conn.close()
        return result

    except mariadb.Error as e:
        print(f"Errore in /partite: {e}")
        return {"errore": str(e)}
