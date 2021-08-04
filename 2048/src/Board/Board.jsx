import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import "./Board.css";

const Cell = ({content}) => {
    const cellClass = classNames({
        cell: true,
        "cell-2": content === 2,
        "cell-4": content === 4,
        "cell-8": content === 8,
        "cell-16": content === 16,
        "cell-32": content === 32,
        "cell-64": content === 64,
        "cell-128": content === 128,
        "cell-256": content === 256,
        "cell-512": content === 512,
        "cell-1024": content === 1024,
        "cell-2048": content === 2048
    });
    return <div className={cellClass}>
        {content}
    </div>
}

Cell.propTypes = {
    content: PropTypes.number
}

const Board = ({data}) => {
    return (
        <div className="board">
            {data.map((row, index) => (
                <>
                    {row.map((cell, cellIndex) => 
                        <Cell content={cell} key={cellIndex} />
                    )}
                </>
            ))}
        </div>
    );
};

Board.propTypes = {
    data: PropTypes.array
};
export default Board