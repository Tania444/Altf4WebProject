import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './LoginForm.css'; // ⬅Stile personalizzato coerente con l’identità del sito
import { FaUser, FaLock } from "react-icons/fa"; // ⬅ Icone eleganti

const LoginForm = () => {
  const navigate = useNavigate();

  // Stato per i dati del form (email e password)
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  // Ricorda l’email se l’utente seleziona "Ricordami"
  const [rememberMe, setRememberMe] = useState(false);

  // Messaggi di errore e successo
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Al primo caricamento recupera eventuali dati salvati
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true); // imposta anche il checkbox
    }

    // Mostra un messaggio di successo se si arriva dalla registrazione
    const registrationMessage = localStorage.getItem("registrationSuccess");
    if (registrationMessage) {
      setSuccessMessage(registrationMessage);
      localStorage.removeItem("registrationSuccess");
    }
  }, []);

  //  Gestione dei campi del form
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError(""); // pulisce l'errore quando si modifica qualcosa
  };

  // Invia i dati al backend PHP per il login
  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost/altf4/backend/login.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams(formData)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Salva l'email se l'utente ha scelto di ricordarla
          if (rememberMe) {
            localStorage.setItem("rememberedEmail", formData.email);
          } else {
            localStorage.removeItem("rememberedEmail");
          }

          // Salva i dati utente per sessione
          localStorage.setItem("userEmail", formData.email);
          localStorage.setItem("username", data.username);

          // Mostra popup di benvenuto
          setShowPopup(true);
          setTimeout(() => {
            setShowPopup(false);
            navigate("/"); // Redirect alla homepage dopo 2 secondi
          }, 2000);
        } else {
          setError(data.error || "Errore di login.");
        }
      })
      .catch(() => setError("Errore di connessione al server."));
  };

  return (
    <section className="login-page">
      {/* 🎥 Video di sfondo */}
      <video autoPlay muted loop playsInline className="bg-video">
        <source src="/video/altf4video.mp4" type="video/mp4" />
        Il tuo browser non supporta il video :C
      </video>

      <div className="centered-container">
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            <h1>Login</h1>

            {/* Messaggio post-registrazione */}
            {successMessage && (
              <p className="form-success">{successMessage}</p>
            )}

            {/*  Messaggi di errore di login */}
            {error && <p className="form-error">{error}</p>}

            {/* Campo Email */}
            <div className="input-box">
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                value={formData.email}
                onChange={handleChange}
              />
              <FaUser className="icon" />
            </div>

            {/* Campo Password */}
            <div className="input-box">
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                value={formData.password}
                onChange={handleChange}
              />
              <FaLock className="icon" />
            </div>

            {/* Checkbox Ricordami + link fittizio per reset password */}
            <div className="remember-forgot">
              <label>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                /> Ricordami!
              </label>
              <a href="#">Password dimenticata?</a>
            </div>

            {/* Pulsante invio form */}
            <button type="submit" className="login-btn">Login</button>

            {/* Link per andare al form di registrazione */}
            <div className="register-link">
              <span>Non hai un account? </span>
              <button type="button" onClick={() => navigate('/register')}>
                Registrati
              </button>
            </div>

            {/* Popup animato al login */}
            {showPopup && (
              <div className="popup">
                <p>Login effettuato con successo!! <br />Buon divertimento :D!</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default LoginForm;
