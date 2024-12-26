import color from 'picocolors';
import { intro, log, spinner } from '@clack/prompts';
import { setTimeout as sleep } from 'node:timers/promises';

import { cards } from './lib/cards.lib';
import { MatchResult } from './lib/types';
import { shuffle } from './utils/shuffle.util';
import { bestTwoOutOfThree } from './lib/best-two-out-of-three.lib';

async function main() {
  console.clear();
  intro(color.inverse(' TRUCO '));

  let playerScore = 0;
  let botScore = 0;

  while (true) {
    if (playerScore >= 12 || botScore >= 12) {
      log.message(`Jogo acabou vencedor: ${botScore >= 12 ? 'Bot' : 'Player'}`);

      break;
    }

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

    const winner = await bestTwoOutOfThree(playerCards, botCards, flipped_card);

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
