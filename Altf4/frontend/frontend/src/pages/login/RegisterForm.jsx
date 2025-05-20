import React, { useState } from "react";
import './RegisterForm.css';
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { username, email, password, confirmPassword } = formData;

    if (!username || !email || !password || !confirmPassword) {
      setError("Tutti i campi sono obbligatori.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Le password non coincidono.");
      return;
    }

    // Invia i dati al backend PHP
    fetch("http://localhost/altf4/backend/register.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        email,
        username,
        password
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          localStorage.setItem("registrationSuccess", "Ora sei registrato! Procedi al login.");
          navigate("/login");
        } else {
          setError(data.error || "Errore nella registrazione.");
        }
      })
      .catch(() => setError("Errore di connessione al server."));
  };

  return (
    <section className="register-page">
      <video autoPlay muted loop playsInline className="bg-video">
        <source src="/video/altf4video.mp4" type="video/mp4" />
        Il tuo browser non supporta questo video :C
      </video>

      <div className="register-container">
        <div className="wrapper">
          <form onSubmit={handleSubmit}>

            <h1>Registrazione</h1>

            {error && <p className="form-error">{error}</p>}

            <div className="input-box">
              <input //RESTRIZIONI SUL LOGIN
                type="text"
                placeholder="Username"
                name="username"
                minLength={3}
                maxLength={10} 
                pattern="^[a-zA-Z0-9]+$"
                title="Username di 3-12 caratteri, solo lettere e numeri!"
                value={formData.username}
                onChange={handleChange}
              />
              <FaUser className="icon" />
            </div>

            <div className="input-box">
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <FaEnvelope className="icon" />
            </div>

            <div className="input-box">
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <FaLock className="icon" />
            </div>

            <div className="input-box">
              <input
                type="password"
                placeholder="Conferma password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <FaLock className="icon" />
            </div>

            <button type="submit" className="login-btn">Registrati</button>

            <div className="register-link">
              <button type="button" onClick={() => navigate('/login')}>
                Torna al login :D
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default RegisterForm;