function Card({ card, onCardClick, gameStatus }) {
  return (
    <li className={`card ${gameStatus}`}>
      <button onClick={() => onCardClick(card.id)}>
        <img src={card.url} alt={card.alt} />
      </button>
    </li>
  );
}

export default Card
