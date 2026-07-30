
import { useState, useEffect } from 'react'
import Card from './Card'
import '../styles/GameBoard.css'

function GameBoard() {
  const [cards, setCards] = useState([]);
  const [currentScore, setCurrentScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    
    const fetchData = async () => {
      try {
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

    return () => {
      controller.abort();
    }
  }, []);

  const handleCardClick = (id) => {
    const clickedCard = cards.find((card) => card.id === id);

    if (clickedCard.isClicked) {
      const resetCards = cards.map((card) => ({ ...card, isClicked: false }));
      setCards(shuffleArray(resetCards));
      setCurrentScore(0);
    } else {
      const updatedCards = cards.map((card) => card.id === id ? { ...card, isClicked: true } : card);
      setCards(updatedCards);

      const newScore = currentScore + 1;
      setCurrentScore(newScore);

      if (newScore > highScore) {
        setHighScore(newScore);
      }
    }

    function shuffleArray(array) {
      const shuffled = [...array];

      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      return shuffled;
    }

    const reorderedCards = shuffleArray(cards);
    setCards(reorderedCards);
  };

  return (
    <ul className="card-grid">
      {cards.map((card) => (
        <Card
          key={card.id}
          card={card}
          onCardClick={handleCardClick}
        />
      ))}
    </ul>
  )
}

export default GameBoard;
