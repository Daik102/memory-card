import { useState, useEffect } from 'react'
import Card from './Card'
import '../styles/GameBoard.css'

function shuffleArray(array) {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

function GameBoard() {
  const [cards, setCards] = useState([]);
  const [currentScore, setCurrentScore] = useState(0);
  const [hiScore, setHiScore] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gameStatus, setGameStatus] = useState('playing');

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
        const url = `https://api.unsplash.com/search/photos?query=nature&orientation=squarish&per_page=12&client_id=${accessKey}`;
        const response = await fetch(url, { signal });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        const adjustedArray = result.results.map((item) => ({
          id: item.id,
          alt: item.alt_description,
          url: item.urls.small,
          isClicked: false
        }));

        setCards(adjustedArray);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, []);

  const handleCardClick = (id) => {
    if (gameStatus !== 'playing') {
      return;
    }

    const clickedCard = cards.find((card) => card.id === id);

    if (clickedCard.isClicked) {
      setGameStatus('lost');
    } else {
      const updatedCards = cards.map((card) => card.id === id ? { ...card, isClicked: true } : card);
      setCards(shuffleArray(updatedCards));

      const newScore = currentScore + 1;
      setCurrentScore(newScore);

      if (newScore > hiScore) {
        setHiScore(newScore);
      }

      if (newScore === 12) {
        setGameStatus('won');
      }
    }
  };

  const handlePlayAgain = () => {
    const resetCards = cards.map((card) => ({ ...card, isClicked: false }));
    setCards(shuffleArray(resetCards));
    setCurrentScore(0);
  };

  let message = 'No Repeats!';

  if (gameStatus === 'won') {
    message = 'Nice Work!';
  } else if (gameStatus === 'lost') {
    message = 'Game Over';
  }

  if (loading) {
    return (
      <div className='wrapper'>
        <div className="status-container">
          <p className="loading-text">Loading game cards...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='wrapper'>
        <div className="status-container">
          <p className="error-text">Failed to load cards: {error}</p>
          <button className='try-again-btn' onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`wrapper ${gameStatus}`}>
      <main className='game-board'>
        <header className='header'>
          <h1 className='game-title'>Odin Memory Card</h1>
          <div className='info-display'>
            <div className='spacer-left'></div>
            <div className='message-container'>
              <h2 className='message'>{message}</h2>
              {gameStatus === 'playing' ? (
                <button className='spacer-btn'>&nbsp;</button>
              ) : (
                <button className='play-again-btn' onClick={() => {
                  setGameStatus('playing');
                  handlePlayAgain();
                }}>
                  Play Again
                </button>
              )}
            </div>
            <div className='score-container'>
              <p>Score: <span className="score-num">{currentScore}</span></p>
              <p>Hi-Score: <span className="score-num">{hiScore}</span></p>
            </div>
          </div>
        </header>
        <ul className="card-grid">
          {cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              onCardClick={handleCardClick}
              gameStatus={gameStatus}
            />
          ))}
        </ul>
      </main>
      <footer className="footer">
        <p>Created for <a href="https://www.theodinproject.com" target="_blank" rel="noreferrer">The Odin Project</a> | <a href="https://daik102.github.io/homepage/" target="_blank" rel="noreferrer">2026 Daik</a></p>
      </footer>
    </div>
  )
}

export default GameBoard;
