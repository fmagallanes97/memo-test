import * as stopWatch from './stopWatch';
import { CHARACTERS } from './characters';

const $memoBoard = document.querySelector('#memo-block-board');
const $dashboard = document.querySelector('#dashboard');
const $play = document.querySelector('#btn-play');
const $memosBlock = $memoBoard.querySelectorAll('.memo-block');

export const $stopWatch = $dashboard.querySelector('#stopWatch');

const DECK = [...CHARACTERS, ...CHARACTERS];
const memo = {selected: null, current: null};

function getMemosChecked(){
    const checked = $memoBoard.querySelectorAll('.flip').length;
    return checked;
}

function addMove(){
    const $moves = $dashboard.querySelector('#moves');
    $moves.innerText = Number($moves.innerText) + 1;
}

function resetMoves(){
    const $moves = $dashboard.querySelector('#moves');
    $moves.innerText = 0;
}

function flip(memoBlock){
    memoBlock.classList.add('flip');
}

function unflip(memoBlock){
    memoBlock.classList.remove('flip');
}

function enableBoard(){
    $memoBoard.addEventListener('click', memoHandler);
}

function disableBoard(){
    $memoBoard.removeEventListener('click', memoHandler);
}

function loadCharacters(characters){
    const $memoBlocks = $memoBoard.querySelectorAll('.memo-block');

    $memoBlocks.forEach(($memoBlock, i) => {
        const $backface = $memoBlock.querySelector('.memo-back');
        const $img = document.createElement('img');

        $img.src = characters[i].dir;
        $backface.innerHTML = '';
        $backface.appendChild($img);

        $memoBlock.setAttribute('data-char', characters[i].name);
    });
}

function memoHandler(e){
    const memoBlock = e.target.closest('button');

    if(!memoBlock) return;

    const isFlipped = memoBlock.classList.contains('flip');
    const isSelectedItself = memoBlock === memo.current;
    const isFull = memo.current !== null && memo.selected !== null;

    if(isFull || isFlipped ||isSelectedItself) return;
    
    flip(memoBlock);
    assignMove(memoBlock);
    checkPlay(memo);
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function shuffle(array){
    const shuffled = array;

    for(let i=array.length-1; i >= 0; i--){
        const temp = shuffled[i];
        const random = getRandomInt(0, i);

        shuffled[i] = shuffled[random];
        shuffled[random] = temp;
    }

    return shuffled;
}

function resetAssigment(){
    memo.selected = null;
    memo.current = null;
}

function reset(){
    disableBoard();
    resetAssigment();
    resetMoves();
    stopWatch.reset();
}

function showMemos(){
    const temp = Array.from($memosBlock);
    const first = temp.splice(0,6);
    const second = temp.splice(0,6);
    const third = temp.splice(0,6);

    for(let i=0; i < 6; i++){
        setTimeout(() => {
            flip(first[i]);
            flip(second[i]);
            flip(third[i]);
        }, i*120);
    }

    setTimeout(() => {
        first.reverse();
        second.reverse();
        third.reverse();

        for(let i=0; i < 6; i++){
            setTimeout(() => {
                unflip(first[i]);
                unflip(second[i]);
                unflip(third[i]);
            }, i*120);
        }
    }, 1700)
}

function assignMove(memoBlock){
    if(memo.current !== null){
        memo.selected = memo.current;
    }

    memo.current = memoBlock;
}

function checkPlay(memo){
    const hasTwoMemos = memo.selected !== null;

    if(!hasTwoMemos) return;

    addMove();
    disableBoard();

    const isWin = $memosBlock.length === getMemosChecked();
    const isEqual = memo.current.dataset.char === memo.selected.dataset.char;

    if(isWin){
        stopWatch.pause();
    }
    else if(isEqual){
        setTimeout(() => {
            enableBoard();
        }, 800);
    }
    else{
        const selected = memo.selected;
        const current = memo.current;

        setTimeout(() => {
            unflip(selected);
            unflip(current);
            enableBoard();
        }, 800);
    }

    resetAssigment();
}

function play(){
    const shuffled = shuffle(DECK);

    $play.disabled = true;

    reset();
    loadCharacters(shuffled);
    showMemos();

    setTimeout(() => {
        $play.disabled = null;
        enableBoard();
        stopWatch.start();
    }, 2500);
}

$play.addEventListener('click', play);