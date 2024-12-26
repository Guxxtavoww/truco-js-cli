import { type GameState, LastToBet } from './types';

export function shouldAskForTruco(
  gameState: GameState,
  round: number
): boolean {
  // Implement your logic here (e.g., random probability, game conditions)
  // Example: Ask for Truco 30% of the time in the first two rounds
  return Math.random() < 0.3 && round <= 2;
}

export function shouldBotAcceptTruco(
  gameState: GameState,
  round: number
): boolean {
  // Implement your bot's Truco acceptance logic here
  // Example: Bot accepts Truco 50% of the time
  return Math.random() < 0.5;
}

export function botAcceptedTruco(gameState: GameState): boolean {
  // Check if the bot accepted the last Truco
  return gameState.last_to_bet === LastToBet.BOT && gameState.playerAccepted;
}
