import { select, isCancel, cancel } from '@clack/prompts';

import type { TrucoCard } from './cards.lib';

export async function handlePlayCard(
  playerHand: TrucoCard[],
  manilhas: TrucoCard[]
) {
  const pickedCard = await select({
    message: 'Escolha uma carta para jogar',
    options: playerHand.map((card, index) => ({
      label: `${index + 1}. ${card}`,
      value: index,
      hint: manilhas.includes(card) ? 'Manilha' : undefined,
    })),
  });

  if (isCancel(pickedCard)) {
    cancel('Cancelado');
    return process.exit(0);
  }

  const cardIndex = pickedCard as number;

  const playedCard = playerHand[cardIndex];

  playerHand.splice(cardIndex, 1);

  return playedCard as TrucoCard;
}
