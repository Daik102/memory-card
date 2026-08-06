import GameBoard from './components/GameBoard'
import { Analytics } from '@vercel/analytics/react';

function App() {
  const isProduction = import.meta.env.PROD;

  return (
    <>
      <GameBoard></GameBoard>
      {isProduction && <Analytics />}
    </>
  )
}

export default App
