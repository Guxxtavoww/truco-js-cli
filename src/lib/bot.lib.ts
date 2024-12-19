import { getHighestCard, type Manilhas, type TrucoCard } from './cards.lib';

export function playCard(botHand: TrucoCard[], manilhas: Manilhas) {
  const highestCard = getHighestCard(botHand, manilhas);
  const highestCardIndex = botHand.indexOf(highestCard);

  botHand.splice(highestCardIndex, 1);

  return highestCard;
}
