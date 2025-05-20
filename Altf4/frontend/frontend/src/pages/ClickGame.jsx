import React, { useState, useEffect, useRef } from 'react';
import './ClickGame.css';

const ClickGame = () => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [gameActive, setGameActive] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [couponCode, setCouponCode] = useState(null);
  const beeRef = useRef(null);
  const gameAreaRef = useRef(null);

  useEffect(() => {
    let timer;
    if (gameActive && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && gameActive) {
      endGame();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameActive]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(20);
    setGameActive(true);
    setShowResult(false);
    moveBee();
  };

  const endGame = async () => {
    setGameActive(false);
    setShowResult(true);
    if (score >= 10) {
      try {
        const res = await fetch('http://localhost:8000/generate_coupon.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ score: Number(score) })
        });

        const data = await res.json();
        console.log("Risposta backend:", data);

        if (data.success && data.codice) {
          setCouponCode(data.codice);
        } else {
          setCouponCode(null);
        }
      } catch (error) {
        console.error("Errore nella richiesta coupon:", error);
        setCouponCode(null);
      }
    }
  };

  const handleBeeClick = () => {
    if (!gameActive) return;
    setScore(s => s + 1);
    moveBee();
  };

  const moveBee = () => {
    if (!beeRef.current || !gameAreaRef.current) return;
    const area = gameAreaRef.current.getBoundingClientRect();
    const x = Math.random() * (area.width - 100);
    const y = Math.random() * (area.height - 100);
    beeRef.current.style.left = `${x}px`;
    beeRef.current.style.top = `${y}px`;
  };

  return (
    
    <div className="game-container">
    <video
      autoPlay
      loop
      muted
      playsInline
      className="video-bg"
    >
      <source src="/video/sfondogioco.mp4" type="video/mp4" />
      Il tuo browser non supporta il video.
    </video>
      <h2>Colpisci l'Ape 🐝</h2>
      {!gameActive && !showResult && <button onClick={startGame}>Inizia</button>}

      {gameActive && (
        <>
          <div className="scoreboard">Punteggio: {score} | Tempo: {timeLeft}s</div>
          <div className="game-area" ref={gameAreaRef}>
            <img
              src="/Image/beee.png"
              alt="bee"
              className="bee"
              ref={beeRef}
              onClick={handleBeeClick}
            />
          </div>
        </>
      )}

      {showResult && (
        <div className="result">
          <p>Hai fatto {score} punti!</p>
          {couponCode ? (
            <p>🎉 Codice sconto: <strong>{couponCode}</strong></p>
          ) : (
            <p>Mi dispiace, non hai vinto. Riprova!</p>
          )}
          <button onClick={startGame}>Riprova</button>
        </div>
      )}
    </div>
  );
};

export default ClickGame;
