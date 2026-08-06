import GameBoard from './components/GameBoard'
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <>
      <GameBoard></GameBoard>
      <Analytics />
    </>
  )
}

export default App
