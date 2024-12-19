export const DEFAULT_SEQUENCE = [
  '4',
  '5',
  '6',
  '7',
  'Q',
  'J',
  'K',
  'A',
  '2',
  '3',
] as const;

export const SUITS = ['♦️', '♠️', '♥️', '♣️'] as const;

export type DefaultSequenceType = (typeof DEFAULT_SEQUENCE)[number];

export type SuitsType = (typeof SUITS)[number];

export type TrucoCard = `${DefaultSequenceType}${SuitsType}`;

export const cards = DEFAULT_SEQUENCE.flatMap((card) =>
  SUITS.map((suit) => `${card}${suit}`)
) as TrucoCard[];

export function getManilhas(flipped_card: TrucoCard) {
  const indexOfNextCard =
    DEFAULT_SEQUENCE.indexOf(flipped_card[0] as DefaultSequenceType) + 1;

  const nextCard =
    indexOfNextCard > DEFAULT_SEQUENCE.length - 1
      ? DEFAULT_SEQUENCE[0]
      : (DEFAULT_SEQUENCE[indexOfNextCard] as DefaultSequenceType);

  return SUITS.map((suit) => `${nextCard}${suit}`) as [
    TrucoCard,
    TrucoCard,
    TrucoCard,
    TrucoCard
  ];
}

export type Manilhas = ReturnType<typeof getManilhas>

export function getHighestCard(
  cards: TrucoCard[],
  manilhas: Manilhas
): TrucoCard {
  const manilhasInCards = cards.filter((card) => manilhas.includes(card));

  if (manilhasInCards.length > 0) {
    const highestManilha = manilhasInCards.reduce((highest, current) => {
      return SUITS.indexOf(current[1] as SuitsType) >
        SUITS.indexOf(highest[1] as SuitsType)
        ? current
        : highest;
    });

    return highestManilha;
  }

  const highestCardIndex = cards.reduce(
    (highestIndex, currentCard, currentIndex) => {
      return DEFAULT_SEQUENCE.indexOf(currentCard[0] as DefaultSequenceType) >
        DEFAULT_SEQUENCE.indexOf(
          cards.at(highestIndex)![0] as DefaultSequenceType
        )
        ? currentIndex
        : highestIndex;
    },
    0
  );

  return cards[highestCardIndex]!;
}
