import { outro, spinner, log } from '@clack/prompts';
import { setTimeout as sleep } from 'node:timers/promises';

import { playCard } from './bot.lib';
import type { GameState } from './types';
import { handlePlayCard } from './player.lib';
import { getHighestCard, getManilhas, type TrucoCard } from './cards.lib';

export enum MatchResult {
  PlayerWon = 'player',
  BotWon = 'bot',
  Tie = 'tie',
}

export async function bestTwoOutOfThree(
  playerHand: TrucoCard[],
  botHand: TrucoCard[],
  flippedCard: TrucoCard
): Promise<MatchResult> {
  let playerWins = 0;
  let botWins = 0;

  const game_state: GameState = {
    last_to_bet: null,
    state: 'default',
  };

  const roundResults: MatchResult[] = [];
  const manilhas = getManilhas(flippedCard);
  const s = spinner();

  const announceWinner = (result: MatchResult, message: string) => {
    roundResults.push(result);
    outro(message);
    result === MatchResult.PlayerWon ? playerWins++ : botWins++;
  };

  for (let round = 1; round <= 3; round++) {
    s.start(`Rodada ${round}: Bot está decidindo sua jogada...`);

    const botPlay = playCard(botHand, manilhas);
    await sleep(2000);

    s.stop(
      `Bot Jogou: ${
        manilhas.includes(botPlay) ? `${botPlay} - Manilha` : botPlay
      }`
    );

    const playerPlay = await handlePlayCard(playerHand, manilhas);
    const winnerCard = getHighestCard([botPlay, playerPlay], manilhas);

    if (winnerCard === botPlay) {
      announceWinner(MatchResult.BotWon, 'Bot ganhou essa rodada!');
    } else if (winnerCard === playerPlay) {
      announceWinner(MatchResult.PlayerWon, 'Você ganhou essa rodada!');
    } else {
      roundResults.push(MatchResult.Tie);
      log.message('Melou!!');
    }

    if (playerWins === 2 || botWins === 2) {
      const matchWinner =
        playerWins === 2 ? MatchResult.PlayerWon : MatchResult.BotWon;
      log.message(
        `${
          matchWinner === MatchResult.PlayerWon ? 'Você' : 'Bot'
        } venceu a melhor de 3!`
      );
      return matchWinner;
    }
  }

  if (playerWins === botWins) {
    log.message('Partida empatada! Aplicando critério de desempate...');
    const decisiveWinner =
      roundResults[0] === MatchResult.Tie
        ? roundResults.find((r) => r !== MatchResult.Tie)
        : roundResults[0];

    if (decisiveWinner === MatchResult.PlayerWon) {
      log.message('Você venceu o desempate!');
      return MatchResult.PlayerWon;
    } else if (decisiveWinner === MatchResult.BotWon) {
      log.message('Bot venceu o desempate!');
      return MatchResult.BotWon;
    }
  }

  const finalWinner =
    playerWins > botWins ? MatchResult.PlayerWon : MatchResult.BotWon;

  log.message(
    `${
      finalWinner === MatchResult.PlayerWon ? 'Você' : 'Bot'
    } venceu a melhor de 3!`
  );
  return finalWinner;
}
