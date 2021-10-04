import React, { useState, } from 'react';
import './index.css';
function Principal() {
    // Declare a new state variable, which we'll call "count"
    // const [file, setFile] = useState([]);
    const [draws, setDraws] = useState([])
    const [canva, setCanva] = useState()
    const [line, setLine] = useState()

    const returnHowUse = () => {
        return (
            <div className="howUseWapper">
                <h2 className="howUseTitle">How you use</h2>
                <p className="howUseText">
                    At the moment, the program should support the following set of commands:<br />
                    <div style={{ display: 'flex'}}>
                        <div>
                            <p style={{ fontWeight: "bold" }}>C w h</p>
                            Create Canvas: Should create a new canvas of width w and height h.
                        </div>
                        <div>

                            <p style={{ fontWeight: "bold" }}>L x1 y1 x2 y2</p>
                            Create Line: Should create a new line from (x1,y1) to (x2,y2). Currently only horizontal or
                            vertical lines are supported. Horizontal and vertical lines will be drawn using the 'x'
                            character.<br />
                        </div>
                        <div>
                            <p style={{ fontWeight: "bold" }}>R x1 y1 x2 y2</p>
                            Create Rectangle: Should create a new rectangle, whose upper left corner is (x1,y1) and
                            lower right corner is (x2,y2). Horizontal and vertical lines will be drawn using the 'x'
                            character.<br />
                        </div>
                        <div>
                            <p style={{ fontWeight: "bold" }}>B x y c</p>
                            Bucket Fill: Should fill the entire area connected to (x,y) with "colour" c. The behavior of this
                            is the same as that of the "bucket fill" tool in paint programs.<br />
                            Please take into account that you can only draw if a canvas has been created.
                        </div>
                    </div>
                </p>
            </div>
        )
    }

    const returnImport = () => {
        return (
            <div className="importWapper">
                <h2 className="importTitle">Choose your file to convert</h2>
                <input type="file" onChange={handleFile} />
            </div>
        )
    }

    const controlActions = (file) => {
        var board = null
        var width = null
        var height = null
        const resp = file.map((item) => {
            const command = item.split(" ")
            switch (command[0].toUpperCase()) {
                case "C":
                    width = command[1]
                    height = command[2]
                    board = createCanvas(Array.from({ length: command[1] }, (_, idx) => `-`)
                        , Array.from({ length: command[2] }, (_, idx) => `|`))
                    break;
                case "L":
                    board = createLine(
                        width,
                        height,
                        board,
                        parseInt(command[1]),
                        parseInt(command[2] - 1),
                        parseInt(command[3]),
                        parseInt(command[4] - 1)
                    )
                    break;
                case "R":
                    board = createBox(
                        parseInt(width),
                        parseInt(height),
                        board,
                        parseInt(command[1]),
                        parseInt(command[2]),
                        parseInt(command[3]),
                        parseInt(command[4])
                    )
                    break;
                case "B":
                    board = createBucket(
                        parseInt(width),
                        parseInt(height),
                        board,
                        command[3]
                    )
                    break;
                default:
                    break;
            }

            return board
        })
        const element = document.createElement("a");
        const fileNew = new Blob([resp[file.length - 1]], { type: 'text/plain' });
        element.href = URL.createObjectURL(fileNew);
        element.download = "output.txt";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }

    const createCanvas = (width, height) => {
        var board = `-${width.join("")}-`;
        board += `\n`
        for (let index = 0; index < height.length; index++) {
            board += "|"
            board += Array.from({ length: width.length + 1 }, (_) => ".\u00A0").join("")
            board += "|\n"
        }
        board += `-${width.join("")}-`;
        setCanva(board.split(".").join(""))
        return board
    }

    const createLine = (width, height, board, x1, y1, x2, y2) => {
        var boardSplit = board.split(".")
        if (x1 < x2)
            for (let index = x1 + (width * y1 + y1); index <= x2 + (width * y2 + y2); index++) {
                boardSplit[index] = "\u00A0x"
            }
        else {
            boardSplit = board.split("\u00A0")
            boardSplit.forEach((part, index, theArray) => {
                if (!boardSplit[index]) boardSplit[index] = "\u00A0"
                else if (boardSplit[index] === "x")
                    boardSplit[index] = "x"
            })
            for (let index = x1 + (width * y1 + y1); index <= x2 + (width * y2 + y2); index++) {
                if (index === x1 + (width * y1 + y1) || index === x2 + (width * y2 + y2))
                    boardSplit[index] = "x"
            }
        }
        setCanva(boardSplit.join(""))
        return boardSplit.join("")
    }

    const createBox = (width, height, board, x1, y1, x2, y2) => {
        const begin = (x1 - 1) + ((width + height) * y1)
        const end = x2 + ((width + height - 1) * y2)
        var line = 0
        var boardSplit = board.split("")
        boardSplit.forEach((part, index, theArray) => {
            if (!boardSplit[index]) boardSplit[index] = "\u00A0"
        })
        for (let index = begin; index <= end; index++) {
            if (boardSplit[index] === "\u00A0") {
                if (index >= begin + height && index < end - height) {
                    if (index === (begin + (line * (width + height - 1))) + height) {
                        boardSplit[index] = "x"
                        line++
                        index = (begin + (line * (width + height - 1)))
                        boardSplit[index] = "x"
                    }
                    else if (index === (begin + (line * (width + height - 1)))) {
                        boardSplit[index] = "x"
                        index += height
                        boardSplit[index] = "x"
                    }
                } else {
                    boardSplit[index] = "x"
                }
            }
        }
        setCanva(boardSplit.join(""))
        return boardSplit.join("")
    }

    const createBucket = (width, height, board, item) => {
        var boardSplit = board.split("")
        boardSplit.forEach((part, index, theArray) => {
            if (boardSplit[index] === "\u00A0") boardSplit[index] = item
        })
        setCanva(boardSplit.join(""))
        return boardSplit.join("")
    }



    const handleFile = e => {
        if (e.target.files[0]) {
            const reader = new FileReader()
            reader.onload = async (e) => {
                const text = (e.target.result.split("\n"))
                if (text[0][0].toUpperCase() !== "C") {
                    alert("Wrong Text Format \nText Should start with the command C")
                    return
                }
                else
                    controlActions(text)
            };
            reader.readAsText(e.target.files[0])
        }
    };


    return (
        <div className="container">
            <h1>Drawing Tool</h1>
            <div className="content">
                {returnHowUse()}
                {returnImport()}
            </div>
        </div>
    );
}
export default Principal