"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var c;
var ctx;
const width = 500;
const height = 400;
const frameWidth = 50;
const frameHeight = 40;
const verticalFramesRowCount = height / frameHeight;
const verticalFramesColCount = width / frameWidth - 1;
var verticalFrames;
const horizontalFramesRowCount = height / frameHeight - 1;
const horizontalFramesColCount = width / frameWidth;
let horizontalFrames;
const cellsRowCount = height / frameHeight;
const cellsColCount = width / frameWidth;
let cells;
let pickableVerticalFrames;
let pickableHorizontalFrames;
let cellNumbers;
Array.prototype.remove = function () {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};
function initialize() {
    c = document.getElementById("theCanvas");
    c.width = width;
    c.height = height;
    ctx = c.getContext("2d");
    ctx.lineWidth = 1;
    verticalFrames = new Array();
    for (let index = 0; index < verticalFramesRowCount; index++) {
        let tmp = new Array(verticalFramesColCount);
        tmp.fill(true);
        verticalFrames.push(tmp);
    }
    horizontalFrames = new Array();
    for (let index = 0; index < horizontalFramesRowCount; index++) {
        let tmp = new Array(horizontalFramesColCount);
        tmp.fill(true);
        horizontalFrames.push(tmp);
    }
    cells = new Array();
    cellNumbers = new Array();
    for (let index = 0; index < cellsRowCount; index++) {
        let tmp = new Array(cellsColCount);
        cells.push(tmp);
    }
    for (let row = 0; row < cellsRowCount; row++) {
        for (let col = 0; col < cellsColCount; col++) {
            let tmp = row * cellsColCount + col;
            cells[row][col] = tmp;
            cellNumbers.push(tmp);
        }
    }
    pickableVerticalFrames = new Array();
    for (let row = 0; row < verticalFramesRowCount; row++) {
        for (let col = 0; col < verticalFramesColCount; col++) {
            pickableVerticalFrames.push([row, col]);
        }
    }
    pickableHorizontalFrames = new Array();
    for (let row = 0; row < horizontalFramesRowCount; row++) {
        for (let col = 0; col < horizontalFramesColCount; col++) {
            pickableHorizontalFrames.push([row, col]);
        }
    }
    drawCellBackground();
    drawFrames();
    drawCellNum();
    iterate();
}
function drawFrames() {
    ctx.strokeStyle = "black";
    // vertical
    for (let row = 0; row < verticalFramesRowCount; row++) {
        for (let col = 0; col < verticalFramesColCount; col++) {
            if (!verticalFrames[row][col]) {
                continue;
            }
            ctx.moveTo((col + 1) * frameWidth, row * frameHeight);
            ctx.lineTo((col + 1) * frameWidth, (row + 1) * frameHeight);
            ctx.lineTo((col + 1) * frameWidth, row * frameHeight);
            ctx.stroke();
        }
    }
    // horizontal
    for (let row = 0; row < horizontalFramesRowCount; row++) {
        for (let col = 0; col < horizontalFramesColCount; col++) {
            if (!horizontalFrames[row][col]) {
                continue;
            }
            ctx.moveTo(col * frameWidth, (row + 1) * frameHeight);
            ctx.lineTo((col + 1) * frameWidth, (row + 1) * frameHeight);
            ctx.lineTo(col * frameWidth, (row + 1) * frameHeight);
            ctx.stroke();
        }
    }
}
function drawCellBackground() {
    for (let row = 0; row < cellsRowCount; row++) {
        for (let col = 0; col < cellsColCount; col++) {
            let num = 100 + 100 * (cells[row][col] / (cellsRowCount * cellsColCount));
            ctx.fillStyle =
                'rgb(' +
                    num +
                    ', ' +
                    (num - 40) +
                    ', ' +
                    num +
                    ')';
            ctx.fillRect(col * frameWidth, row * frameHeight, frameWidth, frameHeight);
        }
    }
}
function drawCellNum() {
    ctx.font = "12px Georgia";
    for (let row = 0; row < cellsRowCount; row++) {
        for (let col = 0; col < cellsColCount; col++) {
            let num = 100 + 100 * (cells[row][col] / (cellsRowCount * cellsColCount));
            let Supplementary = num > 128 ? 0 : 255;
            ctx.fillStyle =
                'rgb('
                    + Supplementary
                    + ', '
                    + Supplementary
                    + ', '
                    + Supplementary
                    + ')';
            ctx.fillText(cells[row][col].toString(), 0.5 * frameWidth + col * frameWidth, 0.5 * frameHeight + row * frameHeight);
        }
    }
}
function iterate() {
    let isValidPick = false;
    let randomPick;
    let pickableFrames;
    let pickedFrames;
    let pickedFrameType;
    let randomRow;
    let randomCol;
    while (!isValidPick) {
        let pickRange = pickableHorizontalFrames.length +
            pickableVerticalFrames.length;
        randomPick = Math.floor(Math.random() * pickRange);
        if (randomPick >= pickableHorizontalFrames.length) {
            randomPick -= pickableHorizontalFrames.length;
            pickableFrames = pickableVerticalFrames;
            pickedFrames = verticalFrames;
            pickedFrameType = "vertical";
        }
        else {
            pickableFrames = pickableHorizontalFrames;
            pickedFrames = horizontalFrames;
            pickedFrameType = "horizontal";
        }
        randomRow = pickableFrames[randomPick][0];
        randomCol = pickableFrames[randomPick][1];
        switch (pickedFrameType) {
            case "vertical":
                let left = cells[randomRow][randomCol];
                let right = cells[randomRow][randomCol + 1];
                if (left === right) {
                    continue;
                }
                isValidPick = true;
                for (let row = 0; row < cellsRowCount; row++) {
                    while (true) {
                        let index = cells[row].indexOf(left, 0);
                        if (index == -1) {
                            break;
                        }
                        cells[row][index] = right;
                    }
                }
                break;
            case "horizontal":
                let up = cells[randomRow][randomCol];
                let down = cells[randomRow + 1][randomCol];
                if (up === down) {
                    continue;
                }
                isValidPick = true;
                for (let row = 0; row < cellsRowCount; row++) {
                    while (true) {
                        let index = cells[row].indexOf(up, 0);
                        if (index == -1) {
                            break;
                        }
                        cells[row][index] = down;
                    }
                }
                break;
            default:
                break;
        }
    }
    pickableFrames.splice(randomPick, 1);
    pickedFrames[randomRow][randomCol] = false;
    let index = cellNumbers.indexOf(cells[randomRow][randomCol]);
    cellNumbers.splice(index, 1);
    c.width = c.width;
    drawCellBackground();
    drawFrames();
    drawCellNum();
    if (cellNumbers.length <= 1) {
        return;
    }
    setTimeout(iterate, 100);
}
/// script goes here
initialize();
