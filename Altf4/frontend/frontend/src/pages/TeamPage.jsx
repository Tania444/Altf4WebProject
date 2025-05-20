import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './TeamPage.css'; // Assicurati di avere questo file

export default function TeamPage() {
  const { slug } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost/altf4/backend/get_game.php?slug=${slug}`)
      .then(res => res.json())
      .then(data => {
        setGame(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <div className="team-page"><p>Loading...</p></div>;
  }

  if (!game || game.error) {
    return <div className="team-page"><p>Team not found.</p></div>;
  }

  return (
    <div className="team-page">
      {/* Hero image with overlay */}
      <div className="team-hero">
        <img src={game.banner_url} alt={game.nome} className="hero-image" />
        <div className="hero-overlay">
          <img src={game.logo_url} alt="Logo" className="hero-logo" />
          <h1 className="hero-title">{game.nome}</h1>
        </div>
      </div>

      {/* Description */}
      <div className="team-description">
        <p>{game.descrizione}</p>
      </div>

      {/* Members */}
      <div className="team-members">
        <h2>Team</h2>
        <div className="member-list">
          {game.membri && game.membri.map((membro, index) => (
            <div className="member-card" key={index}>
              <img src={membro.foto} alt={membro.nickname} className="member-image" />
              <div className="member-info">
                <h3>{membro.nickname}</h3>
                <p>{membro.nome}</p>
                <p className="role">{membro.ruolo}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

