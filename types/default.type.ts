type Card = string;
type PlayerId = string;

interface IWinners {
    // Идентификаторы игроков которые выиграли этот банк
    playerIds: PlayerId[];
    // Карты, благодаря которым банк выигран (они подсвечиваются при выигрыше)
    winningCards: Card[];
    // Уникальный идентификатор банка
    potId: string;
}
interface IInjections {
    // Функция генерации колоды, значение по умолчанию - generateNewDeck
    makeDeck?: () => string[];
    // Функция сна, значение по умолчанию - sleep
    sleep?: (ms: number) => Promise<unknown>;
    // Функция вызываемая когда надо выдать банк игрокам
    givePots?: (winners: IWinners) => void;
}


enum PlayerActionType {
    FOLD = "fold",
    BET = "bet",
    RAISE = "raise",
    CALL = "call",
    ALL_IN = "all_in",
    CHECK = "check",
}
export type {
    Card,
    PlayerId,
    IInjections,
    IWinners,
}

export {
    PlayerActionType
}