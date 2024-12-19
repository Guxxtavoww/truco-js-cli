import color from 'picocolors';
import { intro, log, spinner } from '@clack/prompts';
import { setTimeout as sleep } from 'node:timers/promises';

import {
  bestTwoOutOfThree,
  MatchResult,
} from './lib/best-two-out-of-three.lib';
import { cards } from './lib/cards.lib';
import type { GameState } from './lib/types';
import { shuffle } from './utils/shuffle.util';

async function main() {
  console.clear();
  intro(color.inverse(' TRUCO '));

  let playerScore = 0;
  let botScore = 0;

  const game_state: GameState = {
    last_to_bet: null,
    state: 'default',
  };

  while (true) {
    const s = spinner();

    s.start('Embaralhando cartas...');

    await sleep(1500);

    const deck = shuffle(cards);

    s.stop();

    const botCards = deck.splice(0, 3);
    const playerCards = deck.splice(0, 3);
    const flipped_card = deck.shift(); // pega a primeira carta e deleta ela do array

    log.message(`Vira: ${flipped_card}`);

    if (!flipped_card) throw new Error('Vira inválido');

    const winner = await bestTwoOutOfThree(
      playerCards,
      botCards,
      flipped_card,
      game_state
    );

    switch (winner) {
      case MatchResult.PlayerWon:
        playerScore += 1;
      case MatchResult.BotWon:
        botScore += 1;
      case MatchResult.Tie:
        continue;
    }
  }
}

main().catch(console.error);
