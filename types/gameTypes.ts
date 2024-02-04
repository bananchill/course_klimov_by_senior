import type { PlayerId } from "./default.type";

type GameConfigType = {
    smallBlind: number;
    bigBlind: number;
    antes: number;
    timeLimit: number;
};
type Pot = {
    potId: string;
    amount: number;
    eligiblePlayers: Set<PlayerId>;
};
type Seat = {
    playerId: PlayerId;
    stack: number;
};
type Pots = { potId: string; amount: number }[]

type Bets = Record<PlayerId, number>
export type {
    GameConfigType,
    Pot,
    Pots,
    Seat,
    Bets
}