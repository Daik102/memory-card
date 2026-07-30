
import { useState, useEffect } from 'react'
import Card from './Card'

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

  return (
    <>
      {cards.map((card) => (
        <Card
          key={card.id}
          card={card}
          onCardClick={handleCardClick}
        />
      ))}
    </>
  )
}

export default GameBoard;
