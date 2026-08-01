function Card({ card, onCardClick }) {
  return (
    <li className="card">
      <button onClick={() => onCardClick(card.id)}>
        <img src={card.url} alt={card.alt} />
      </button>
    </li>
  );
}

export default Card
