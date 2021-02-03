import { Cell, CellState, CellValue } from './../types';
import { MAX_COLS, MAX_ROWS, N_OF_BOMBS } from './../constants';

const grabAllAdjacentCells = (
    cells: Cell[][],
    rowIndex: number,
    colIndex: number,
): {
    topLeftCell: Cell | null;
    topCell: Cell | null;
    topRightCell: Cell | null;
    leftCell: Cell | null;
    rightCell: Cell | null;
    bottomLeftCell: Cell | null;
    bottomCell: Cell | null;
    bottomRightCell: Cell | null;
} => {
    const topLeftCell = rowIndex > 0 && colIndex > 0 ? cells[rowIndex - 1][colIndex - 1] : null;
    const topCell = rowIndex > 0 ? cells[rowIndex - 1][colIndex] : null;
    const topRightCell = rowIndex > 0 && colIndex < MAX_COLS - 1 ? cells[rowIndex - 1][colIndex + 1] : null;
    const leftCell = colIndex > 0 ? cells[rowIndex][colIndex - 1] : null;
    const rightCell = colIndex < MAX_COLS - 1 ? cells[rowIndex][colIndex + 1] : null;
    const bottomLeftCell = rowIndex < MAX_ROWS - 1 && colIndex > 0 ? cells[rowIndex + 1][colIndex - 1] : null;
    const bottomCell = rowIndex < MAX_ROWS - 1 ? cells[rowIndex + 1][colIndex] : null;
    const bottomRightCell =
        rowIndex < MAX_ROWS - 1 && colIndex < MAX_COLS - 1 ? cells[rowIndex + 1][colIndex + 1] : null;

    return {
        topLeftCell,
        topCell,
        topRightCell,
        leftCell,
        rightCell,
        bottomLeftCell,
        bottomCell,
        bottomRightCell,
    };
};

export const generateCells = (): Cell[][] => {
    const cells: Cell[][] = [];

    for (let row = 0; row < MAX_ROWS; row++) {
        cells.push([]);
        for (let col = 0; col < MAX_COLS; col++) {
            cells[row].push({
                value: CellValue.empty,
                state: CellState.default,
            });
        }
    }

    let bombsPlaced = 0;
    while (bombsPlaced < N_OF_BOMBS) {
        const randomRow = Math.floor(Math.random() * MAX_ROWS);
        const randomCol = Math.floor(Math.random() * MAX_COLS);
        const currentCell = cells[randomRow][randomCol];

        if (currentCell.value !== CellValue.bomb) {
            cells[randomRow][randomCol] = {
                ...cells[randomRow][randomCol],
                state: currentCell.state,
                value: CellValue.bomb,
            };
            bombsPlaced++;
        }
    }

    for (let rowIndex = 0; rowIndex < MAX_ROWS; rowIndex++) {
        for (let colIndex = 0; colIndex < MAX_COLS; colIndex++) {
            const currentCell = cells[rowIndex][colIndex];
            if (currentCell.value === CellValue.bomb) {
                continue;
            }

            let numberOfBombs = 0;
            const {
                topLeftCell,
                topCell,
                topRightCell,
                leftCell,
                rightCell,
                bottomLeftCell,
                bottomCell,
                bottomRightCell,
            } = grabAllAdjacentCells(cells, rowIndex, colIndex);
            if (topLeftCell?.value === CellValue.bomb) {
                numberOfBombs++;
            }
            if (topCell?.value === CellValue.bomb) {
                numberOfBombs++;
            }
            if (topRightCell?.value === CellValue.bomb) {
                numberOfBombs++;
            }
            if (leftCell?.value === CellValue.bomb) {
                numberOfBombs++;
            }
            if (rightCell?.value === CellValue.bomb) {
                numberOfBombs++;
            }
            if (bottomLeftCell?.value === CellValue.bomb) {
                numberOfBombs++;
            }
            if (bottomCell?.value === CellValue.bomb) {
                numberOfBombs++;
            }
            if (bottomRightCell?.value === CellValue.bomb) {
                numberOfBombs++;
            }

            if (numberOfBombs > 0) {
                cells[rowIndex][colIndex] = {
                    ...currentCell,
                    value: numberOfBombs,
                };
            }
        }
    }

    return cells;
};

export const openMultipleEmptyCells = (cells: Cell[][], rowParam: number, colParam: number): Cell[][] => {
    let newCells = cells.slice();

    newCells[rowParam][colParam].state = CellState.visible;
    const {
        topLeftCell,
        topCell,
        topRightCell,
        leftCell,
        rightCell,
        bottomLeftCell,
        bottomCell,
        bottomRightCell,
    } = grabAllAdjacentCells(cells, rowParam, colParam);

    if (topLeftCell?.state === CellState.default) {
        if (topLeftCell?.value === CellValue.empty) {
            newCells = openMultipleEmptyCells(newCells, rowParam - 1, colParam - 1);
        } else {
            newCells[rowParam - 1][colParam - 1].state = CellState.visible;
            if (newCells[rowParam - 1][colParam - 1].value === CellValue.bomb) {
            }
        }
    }

    if (topCell?.state === CellState.default) {
        if (topCell?.value === CellValue.empty) {
            newCells = openMultipleEmptyCells(newCells, rowParam - 1, colParam);
        } else {
            newCells[rowParam - 1][colParam].state = CellState.visible;
            if (newCells[rowParam - 1][colParam].value === CellValue.bomb) {
            }
        }
    }

    if (topRightCell?.state === CellState.default) {
        if (topRightCell?.value === CellValue.empty) {
            newCells = openMultipleEmptyCells(newCells, rowParam - 1, colParam + 1);
        } else {
            newCells[rowParam - 1][colParam + 1].state = CellState.visible;
            if (newCells[rowParam - 1][colParam + 1].value === CellValue.bomb) {
            }
        }
    }

    if (leftCell?.state === CellState.default) {
        if (leftCell?.value === CellValue.empty) {
            newCells = openMultipleEmptyCells(newCells, rowParam, colParam - 1);
        } else {
            newCells[rowParam][colParam - 1].state = CellState.visible;
            if (newCells[rowParam][colParam - 1].value === CellValue.bomb) {
            }
        }
    }

    if (rightCell?.state === CellState.default) {
        if (rightCell?.value === CellValue.empty) {
            newCells = openMultipleEmptyCells(newCells, rowParam, colParam + 1);
        } else {
            newCells[rowParam][colParam + 1].state = CellState.visible;
            if (newCells[rowParam][colParam + 1].value === CellValue.bomb) {
            }
        }
    }

    if (bottomLeftCell?.state === CellState.default) {
        if (bottomLeftCell?.value === CellValue.empty) {
            newCells = openMultipleEmptyCells(newCells, rowParam + 1, colParam - 1);
        } else {
            newCells[rowParam + 1][colParam - 1].state = CellState.visible;
            if (newCells[rowParam + 1][colParam - 1].value === CellValue.bomb) {
            }
        }
    }

    if (bottomCell?.state === CellState.default) {
        if (bottomCell?.value === CellValue.empty) {
            newCells = openMultipleEmptyCells(newCells, rowParam + 1, colParam);
        } else {
            newCells[rowParam + 1][colParam].state = CellState.visible;
            if (newCells[rowParam + 1][colParam].value === CellValue.bomb) {
            }
        }
    }

    if (bottomRightCell?.state === CellState.default) {
        if (bottomRightCell?.value === CellValue.empty) {
            newCells = openMultipleEmptyCells(newCells, rowParam + 1, colParam + 1);
        } else {
            newCells[rowParam + 1][colParam + 1].state = CellState.visible;
            if (newCells[rowParam + 1][colParam + 1].value === CellValue.bomb) {
            }
        }
    }

    return newCells;
};

export const checkMultipleVisibleCells = (cells: Cell[][], rowParam: number, colParam: number): Cell[][] => {
    const currentCell = cells[rowParam][colParam];
    const newCells = cells.slice();

    const {
        topLeftCell,
        topCell,
        topRightCell,
        leftCell,
        rightCell,
        bottomLeftCell,
        bottomCell,
        bottomRightCell,
    } = grabAllAdjacentCells(cells, rowParam, colParam);

    let numberOfFlags = 0;

    if (topLeftCell?.state === CellState.flagged) {
        numberOfFlags++;
    }
    if (topCell?.state === CellState.flagged) {
        numberOfFlags++;
    }
    if (topRightCell?.state === CellState.flagged) {
        numberOfFlags++;
    }
    if (leftCell?.state === CellState.flagged) {
        numberOfFlags++;
    }
    if (rightCell?.state === CellState.flagged) {
        numberOfFlags++;
    }
    if (bottomLeftCell?.state === CellState.flagged) {
        numberOfFlags++;
    }
    if (bottomCell?.state === CellState.flagged) {
        numberOfFlags++;
    }
    if (bottomRightCell?.state === CellState.flagged) {
        numberOfFlags++;
    }

    if (numberOfFlags < currentCell.value) {
        console.log('LOOK Better');
        //TODO
    } else openMultipleEmptyCells(cells, rowParam, colParam);

    return newCells;
};

export const toggleStyleAllAdjacentCells = (
    cells: Cell[][],
    rowParam: number,
    colParam: number,
    isPressed: boolean,
): Cell[][] => {
    if (cells[rowParam][colParam].state === CellState.default) {
        return cells;
    }

    const newCells = cells.slice();

    const {
        topLeftCell,
        topCell,
        topRightCell,
        leftCell,
        rightCell,
        bottomLeftCell,
        bottomCell,
        bottomRightCell,
    } = grabAllAdjacentCells(cells, rowParam, colParam);

    if (topLeftCell?.state === CellState.default) {
        newCells[rowParam - 1][colParam - 1].checked = isPressed;
    }

    if (topCell?.state === CellState.default) {
        newCells[rowParam - 1][colParam].checked = isPressed;
    }

    if (topRightCell?.state === CellState.default) {
        newCells[rowParam - 1][colParam + 1].checked = isPressed;
    }

    if (leftCell?.state === CellState.default) {
        newCells[rowParam][colParam - 1].checked = isPressed;
    }

    if (rightCell?.state === CellState.default) {
        newCells[rowParam][colParam + 1].checked = isPressed;
    }

    if (bottomLeftCell?.state === CellState.default) {
        newCells[rowParam + 1][colParam - 1].checked = isPressed;
    }

    if (bottomCell?.state === CellState.default) {
        newCells[rowParam + 1][colParam].checked = isPressed;
    }

    if (bottomRightCell?.state === CellState.default) {
        newCells[rowParam + 1][colParam + 1].checked = isPressed;
    }

    return newCells;
};
