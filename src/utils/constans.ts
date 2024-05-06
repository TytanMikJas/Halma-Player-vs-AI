export const BOARD_SIZE = 16;

export const PLAYER1_CORNER = [0,0];
export const PLAYER1_BASE =
[
    PLAYER1_CORNER, [0, 1], [0, 2], [0, 3], [0, 4],
    [1, 0], [1, 1], [1, 2], [1, 3], [1, 4],
    [2, 0], [2, 1], [2, 2], [2, 3],
    [3, 0], [3, 1], [3, 2],
    [4, 0], [4, 1],
];

export const PLAYER2_CORNER = [15, 15];
export const PLAYER2_BASE =
[
    [11, 14], [11, 15],
    [12, 13], [12, 14], [12, 15],
    [13, 12], [13, 13], [13, 14], [13, 15],
    [14, 11], [14, 12], [14, 13], [14, 14], [14, 15],
    [15, 11], [15, 12], [15, 13], [15, 14], PLAYER2_CORNER
];

export const directions = [
    { dx: -1, dy: -1 },
    { dx: -1, dy: 0 },
    { dx: 0, dy: -1 },
    { dx: -1, dy: 1 },
    { dx: 1, dy: -1 },
    { dx: 0, dy: 1 },
    { dx: 1, dy: 0 },
    { dx: 1, dy: 1 },
];

export const weights = {
    occupationWeight: 30,
    defenseWeight: 10,
    distanceWeight: 5,
    doubleJumpWeight: 5,
    mobilityWeight: 5,
};
