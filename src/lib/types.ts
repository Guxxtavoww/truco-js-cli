export enum LastToBet {
  PLAYER = 'player',
  BOT = 'bot',
}

export const states = ['default', 'truco', '6', '9', '12'] as const;

export interface GameState {
  last_to_bet: LastToBet | null;
  state: (typeof states)[number];
}
