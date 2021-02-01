import React, { useState } from 'react';
import { Cell } from '../../types';
import { generateCells } from '../../utils';
import CellButton from '../CellButton/CellButton';
import './GameBody.scss';

const GameBody: React.FC = () => {
    const [cells, setCells] = useState<Cell[][]>(generateCells());
    const renderCells = (): React.ReactNode => {
        return cells.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
                <CellButton
                    key={`${rowIndex}${colIndex}`}
                    state={cell.state}
                    value={cell.value}
                    row={rowIndex}
                    col={colIndex}
                />
            )),
        );
    };

    return <div className="GameBody">{renderCells()}</div>;
};

export default GameBody;
