import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';

const Cell = (props) => {
    const lockClass = props.isLock ? "filled " : "empty ";
    const winClass = props.isWin ? "win " : "";
    const gamerClass = props.value ? "gamer" + props.value : "";
    return (
        <div className="cell-container">
            <div className={"cell-card " + lockClass + winClass + gamerClass}
                 id={props.id}>
                {props.value}
            </div>
        </div>
    );
};

class Header extends React.Component {
    isGamer(gamer) {
        return this.props.gamer === gamer && !this.props.endGame;
    }

    isEndGame() {
        return this.props.endGame;
    }

    render() {
        return (
            <div className="header">
                <div>
                    <div
                        className={this.isGamer("X") ? "visible" : "invisible"}>
                        Ход игрока&ensp;<span className="gamerX">X</span>
                    </div>
                    <div
                        className={this.isGamer("O") ? "visible" : "invisible"}>
                        Ход игрока&ensp;<span className="gamerO">O</span>
                    </div>
                    <div
                        className={this.isEndGame() ? "visible" : "invisible"}>Игра
                        окончена
                    </div>
                </div>
            </div>
        );
    }
}

class EndGameLabel extends React.Component {
    end() {
        return <div className="end-game-label">Ничья!</div>;
    }

    win(winner) {
        return (
            <div className="end-game-label">
                Игрок&ensp;
                <span className={"gamer" + winner}>
                    {winner}
                </span>
                &ensp;победил!
            </div>
        );
    }

    render() {
        return this.props.winner ? this.win(this.props.winner) : this.end()
    }
}

class ResetButton extends React.Component {
    handleClick = () => {
        this.props.passClick()
    };

    render() {
        return (
            <div className="reset-button">
                <button className={"gamer" + this.props.winner}
                        onClick={this.handleClick}>
                    Сыграть еще раз?
                </button>
            </div>
        );
    }
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.initialState()
    }

    initialCells() {
        let cells = Array(9).fill("");
        return cells.map((value, index) => ({
            id: index,
            value: value,
            isLock: false
        }));
    }

    initialState() {
        return {
            cells: this.initialCells(),
            currentGamer: "X",
            win: false,
            end: false,
            winner: "",
        };
    }

    resetBoard = () => {
        const state = {
            ...this.initialState(),
            currentGamer: this.state.currentGamer,
            winner: this.state.winner,
        };
        this.setState(state);
    };

    handleCellClick = (e) => {
        let element = e.target;
        if (!element.classList.contains("cell-card")) return;

        let cells = [...this.state.cells];
        let cell = cells[element.id];

        if (cell.isLock || this.state.win) return;

        cell.isLock = true;
        cell.value = this.state.currentGamer;
        this.setState({cells: cells});
        if (this.checkWin()) {
            this.setState({
                win: true,
                end: true,
                winner: this.state.currentGamer,
            });
            return;
        }

        if (this.checkAllCellsFilled()) {
            this.setState({end: true, winner: ""});
            return;
        }

        this.setState({currentGamer: this.nextGamer()});
    };

    nextGamer = () => {
        return this.state.currentGamer === "X" ? "O" : "X";
    };

    checkAllCellsFilled = () => {
        return this.state.cells.every(cells => cells.isLock)
    };

    checkWin = () => {
        let sequences = [].concat(
            this.horizontals(),
            this.verticals(),
            this.diagonals()
        );
        for (let sequence of sequences) {
            let values = this.cellValues(sequence);
            if (values.every(value => (value !== "" && value === values[0]))) {
                return sequence
            }
        }
        return false
    };

    horizontals = () => {
        let cells = [...this.state.cells];
        return this.to2d(cells);
    };

    verticals = () => {
        let cells = [...this.state.cells];
        let verticalNumber = [0, 3, 6, 1, 4, 7, 2, 5, 8];
        cells = verticalNumber.map((key => cells[key]));
        return this.to2d(cells);
    };

    diagonals = () => {
        let cells = [...this.state.cells];
        let diagonalNumber = [0, 4, 8, 2, 4, 6];
        cells = diagonalNumber.map((key => cells[key]));
        return this.to2d(cells)
    };

    cellValues(cells) {
        return cells.map(cell => cell.value);
    }

    to2d(array, count = 3) {
        let new_array = [];
        while (array.length) new_array.push(array.splice(0, count));
        return new_array;
    }

    render() {
        return (
            <div className="page">
                <Header gamer={this.state.currentGamer}
                        endGame={this.state.end}/>
                <div className="board" onClick={this.handleCellClick}>
                    {this.state.cells.map(
                        (cell, index) => <Cell
                            key={index}
                            id={index}
                            value={cell.value}
                            isLock={cell.isLock}
                            isWin={this.state.win}
                        />
                    )}
                </div>
                <div
                    className={"bottom " + (this.state.end ? "visible" : "invisible")}>
                    <EndGameLabel winner={this.state.winner}/>
                    <ResetButton winner={this.state.winner}
                                 passClick={this.resetBoard}/>
                </div>
            </div>
        );
    }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Board/>);
