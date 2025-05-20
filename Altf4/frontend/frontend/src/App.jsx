import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import './index.css';
import './App.css';

export default function App() {
  const [partite, setPartite] = useState([]);
  const [nextMatch, setNextMatch] = useState(null);
  const [countdown, setCountdown] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const navigate = useNavigate();

  const BANNER_TEXT = '#GO ALT+F4';
  const REPEAT_COUNT = 100;
  const baseItems = Array.from({ length: REPEAT_COUNT }, () => BANNER_TEXT);
  const bannerItems = [...baseItems, ...baseItems];

  // Fetch partite e trova il prossimo match
  useEffect(() => {
    fetch('http://localhost/altf4/backend/get_partita.php')
      .then(res => res.json())
      .then(data => {
        setPartite(data);

        const now = new Date();
        const upcoming = data
          .map(p => ({ ...p, datetime: new Date(`${p.data}T${p.ora.padEnd(8, ':00')}`) }))
          .filter(p => p.datetime > now)
          .sort((a, b) => a.datetime - b.datetime);

        if (upcoming.length > 0) {
          setNextMatch(upcoming[0]);
        }
      })
      .catch(err => console.error('Errore nel recupero dati:', err));
  }, []);

  // Countdown al prossimo match
  useEffect(() => {
    if (!nextMatch) return;

    const interval = setInterval(() => {
      const now = new Date();
      const diff = new Date(`${nextMatch.data}T${nextMatch.ora}`) - now;

      if (diff <= 0) {
        setCountdown("IN CORSO");
        clearInterval(interval);
        return;
      }

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setCountdown(`${h}h ${m}m ${s}s`);

    }, 1000);

    return () => clearInterval(interval);
  }, [nextMatch]);

  // Messaggio login (popup)
  useEffect(() => {
    const msg = localStorage.getItem("loginMessage");
    if (msg) {
      setLoginMessage(msg);
      setTimeout(() => {
        setLoginMessage("");
        localStorage.removeItem("loginMessage");
      }, 5000);
    }
  }, []);

  return (
    <div className="countdown-box">
      {loginMessage && (
        <div className="popup">
          <p>{loginMessage}</p>
        </div>
      )}

      {/* Hero Video */}
      <section className="relative w-screen aspect-video overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/video/bg.mp4" type="video/mp4" />
          Il tuo browser non supporta il video.
        </video>
        <div className="hero-text-overlay">
          <h1>WHEN WE PLAY<br />OTHERS QUIT</h1>
        </div>
      </section>

      {/* Countdown Match */}
      {nextMatch && (
  <div
    className="countdown-box"
    style={{
      backgroundImage: "url('/IMAGE/vittoriaMondiale.png')", // <-- sfondo come immagine
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  >
    {/* Overlay scuro sopra immagine */}
    <div className="absolute inset-0 bg-black/50"></div>

    {/* Contenuto in sovraimpressione */}
    <div className="overlay-box">
      <p>ALT+F4 Spring 2025</p>
      <h1>ALT+F4 vs 100 Thieves</h1>

      {/* Loghi + VS centrato */}
      <div className="match-logos">
        <img src="/IMAGE/logo.png" alt="ALT+F4 Logo" className="logo" />
        <span className="vs">VS</span>
        <img src="/IMAGE/logo_100.png" alt="100 Thieves Logo" className="logo" />
      </div>

      {/* Countdown */}
      <div className="countdown-strip">
        {["hours", "minutes", "seconds"].map((unit, i) => {
          const timeValues = countdown.split(/[\s]/); // ["4h", "0m", "59s"]
          const val = timeValues[i] ? timeValues[i].replace(/[a-z]/gi, "") : "00";
          return (
            <div key={unit} className="countdown-item">
              <div className="countdown-value">{val.padStart(2, "0")}</div>
              <div className="countdown-label">{unit}</div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
)}
    </div>
  );
}