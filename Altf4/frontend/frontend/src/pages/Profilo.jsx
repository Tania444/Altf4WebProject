import React, { useEffect, useState } from 'react';
import './Profilo.css';
import { useNavigate } from "react-router-dom"; // aggiungi questa riga

const Profilo = () => {
  const navigate = useNavigate(); // aggiungi questa riga
  const [userData, setUserData] = useState(null);
  const [modifica, setModifica] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const email = localStorage.getItem("userEmail");

  useEffect(() => {
    if (!email) return;

    fetch("http://localhost/altf4/backend/get_user.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({ email })
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.username && data.email) {
          setUserData(data);
          setFormData(prev => ({
            ...prev,
            username: data.username,
            email: data.email
          }));
        } else {
          console.error("Dati utente non validi o non trovati:", data);
        }
      })
      .catch(err => console.error("Errore fetch profilo:", err));
  }, [email]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    fetch("http://localhost/altf4/backend/update_user.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams(formData)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUserData({ username: formData.username, email: formData.email });
          localStorage.setItem("username", formData.username);
          setFormData(prev => ({
            ...prev,
            password: '',
            confirmPassword: ''
          }));
          setModifica(false);
          setSuccessMessage("Profilo aggiornato con successo!");
          setTimeout(() => setSuccessMessage(''), 4000);
        } else {
          alert(data.error || "Errore durante l'aggiornamento.");
        }
      })
      .catch(err => {
        console.error("Errore update:", err);
        alert("Errore di rete durante l'aggiornamento.");
      });
  };

  if (!userData) return <p className="caricamento">Caricamento profilo...</p>;

  return (
    <div className="profilo-container">
      <div className="profilo-card">
      <img className="bee-float" src="/IMAGE/bee.png" alt="bee" />

        <h1>Il tuo profilo</h1>

        {successMessage && <div className="success-message">{successMessage}</div>}

        {!modifica ? (
          <>
            <p><strong>Username:</strong> {userData.username}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <button onClick={() => setModifica(true)}>Modifica</button>
            <button className="home-btn" onClick={() => navigate('/')}>Torna alla Home</button>
          </>
        ) : (
          <form onSubmit={handleUpdate}>
            <label>Username
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                minLength={3}
                maxLength={10}
                pattern="^[a-zA-Z0-9]+$"
                title="Solo lettere e numeri, da 3 a 10 caratteri"
              />

            </label>
            <label>Email
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />

            </label>
            <label>Nuova Password
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </label>
            <label>Conferma Nuova Password
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </label>
            <div className="form-buttons">
              <button type="submit">Conferma</button>
              <button type="button" onClick={() => setModifica(false)}>Annulla</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profilo;