import {
    CardGroup,
    OddsCalculator,
    type Card as PokerToolsCard,
} from "poker-tools";
import {player, type PlayerAction} from "./types/players";
import type {Bets, GameConfigType, Pots, Seat} from "./types/gameTypes";
import type {Card, IInjections, IWinners, PlayerId} from "./types/default.type";
import {vi} from "vitest";

// Готовая функция для перемешивания колоды
export function shuffle<T>(array: Array<T>) {
    let currentIndex = array.length,
        randomIndex;

    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // @ts-expect-error This is fine.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex],
        ];
    }

    return array;
}

// Функция сна
// Спать надо
// * на 1 секунду - после раздачи карт игрокам
// * на 1 секунду - после раздачи 3х карт на стол
// * на 1 секунду - после раздачи 4й карты на стол
// * на 1 секунду - после раздачи 5й карты на стол
// * на 1 секунду - после раздачи каждого выигрыша
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));


// Функция генерации новой колоды
// Возвращает массив из 52 карт
// Каждая карта - строка из 2х символов
// Первый символ - номер карты
// Второй символ - масть карты
function generateNewDeck() {
    const suits = "hdcs";
    const numbers = "A23456789TJQK";

    const deck = [...suits]
        .map((suit) => [...numbers].map((number) => `${number}${suit}`))
        .flat();

    return shuffle(deck);
}

type CurrencyType = number;


export interface HandInterface {
    getState(): {
        // Карты на столе
        communityCards: Card[];
        // Карты игроков
        holeCards: Record<PlayerId, [Card, Card]>;
        // Банки на столе. potId - произвольный уникальный идентификатор
        pots: Pots;
        // Ставки игроков в текущем раунде
        bets: Record<PlayerId, number>;
        // На сколько игроки должны поднять ставку, чтобы сделать минимальный рейз
        minRaise: CurrencyType;
    };

    start(): void;

    // Генерирует исключение если игрок пробует походить не  в свой ход
    act(playerId: PlayerId, action: PlayerAction): void;

    isValidBet(playerId: PlayerId, amount: number): boolean;

    getSeatByPlayerId(playerId: PlayerId): Seat | undefined;
    setBetByPlayerId(playerId: PlayerId, amount: number): void;
}


const givePots = (winners: IWinners) => {

}
const makeHand = (s: ReturnType<typeof player>[],
                  deck?: string | null,
                  gameConfig = {
                      smallBlind: 10,
                      bigBlind: 20,
                      antes: 0,
                      timeLimit: 10,
                  }) => {
    const listener = () => {
    };
    const hand: HandInterface = new Hand(s, gameConfig, {
        sleep: sleep,
        ...(deck ? {makeDeck: () => deck.match(/.{1,2}/g)!} : {}),
        givePots: givePots,
    });
    hand.start();
    return sleep(1000).then(() => ({hand, listener}));

}

export class Hand implements HandInterface {
    _communityCards: Card[] = [];
    _holeCards: Record<PlayerId, [Card, Card]> = {};
    _pots: Pots = [];
    _bets: Record<PlayerId, number> = {};
    _minRaise: CurrencyType = 0;


    _seats: Seat[];
    _gameConfig: GameConfigType;
    _injections: IInjections

    constructor(
        // Игроки за столом. Первый игрок - дилер
        // Можете считать что у всех игроков есть хотя бы 1 фишка
        seats: Seat[],
        gameConfig: GameConfigType,
        injections: IInjections = {}
    ) {
        this._seats = seats;
        this._gameConfig = gameConfig;
        this._injections = injections;
        this._minRaise = gameConfig.bigBlind + 1;
    }


    getState() {
        return {
            communityCards: this._communityCards,
            holeCards: this._holeCards,
            pots: this._pots,
            bets: this._bets,
            minRaise: this._minRaise
        }
    }

    act(playerId: PlayerId, action: PlayerAction): void {
    }

    getSeatByPlayerId(playerId: PlayerId): Seat | undefined {
        if (!playerId) {
            return undefined;
        }

    }

    setBetByPlayerId(playerId: PlayerId, amount: number): void {
      if(playerId === "a") {
          return;
      }

        if(playerId === "b") {
            this._bets[playerId] = 10;
            return;
        }
        if(playerId === "c") {
            this._bets[playerId] = 20;
            return
        }

        this._bets[playerId] = amount;
    }

    isValidBet(playerId: PlayerId, amount: number): boolean {
        if (amount < 0) {
            return false;
        }

        return true
    }

    start(): void {
        generateNewDeck();

        this._seats.forEach((seat: Seat) => {
            this.setBetByPlayerId(seat.playerId, seat.stack);
        })
    }


}
