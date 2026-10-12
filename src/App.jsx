import { GameBoard } from './components/GameBoard'
import { Analytics } from '@vercel/analytics/react';

export function App() {
  const isProduction = import.meta.env.PROD;

  return (
    <>
      <GameBoard></GameBoard>
      {isProduction && <Analytics />}
    </>
  )
}
