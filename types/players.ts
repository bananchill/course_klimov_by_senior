import type { PlayerId } from "./default.type";

type PlayerAction =
    | {
    type: "fold";
}
    | {
    type: "bet";
    amount: number;
};
 const player = (name: PlayerId, stack: number = 1000) => ({
    playerId: name,
    stack,
});


export type{
    PlayerAction,
}

export {
    player,
}