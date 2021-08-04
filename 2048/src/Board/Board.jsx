import React from 'react';
import PropTypes from 'prop-types';
import "./Board.css";

const Cell = ({content}) => {
    return <div className="cell">
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
                <div className="board-row" key={index}>
                    {row.map((cell, cellIndex) => 
                        <Cell content={cell} key={cellIndex} />
                    )}
                </div>
            ))}
        </div>
    );
};

Board.propTypes = {
    data: PropTypes.array
};
export default Board