/* =========================
   SCREENS
========================= */

const loadingScreen =
document.getElementById(
    "loadingScreen"
);

const profileScreen =
document.getElementById(
    "profileScreen"
);

const gameScreen =
document.getElementById(
    "gameScreen"
);

const profilesContainer =
document.getElementById(
    "profilesContainer"
);

const addProfile =
document.getElementById(
    "addProfile"
);

const manageProfilesBtn =
document.getElementById("manageProfilesBtn");

let profileDeleteMode = false;

const createPlayerPopup =
document.getElementById(
    "createPlayerPopup"
);

const createPlayerBtn =
document.getElementById(
    "createPlayerBtn"
);

const playerNameInput =
document.getElementById(
    "playerNameInput"
);

const playerNameText =
document.getElementById(
    "playerName"
);

const playerIdText =
document.getElementById(
    "playerId"
);

let currentPlayer = null;


/* =========================
   LOADING
========================= */

window.addEventListener(
"load",
() => {

    const progress =
    document.getElementById(
        "loadingProgress"
    );

    const loadingText =
    document.getElementById(
        "loadingText"
    );

    let percent = 0;

    const loader =
    setInterval(() => {

        percent += 2;

       const circleLength = 314;

progress.style.strokeDashoffset =

circleLength -

(circleLength * percent / 100);

        document.getElementById(
    "loadingPercent"
).textContent =
percent + "%";

        if(percent >= 100){

            clearInterval(loader);

            setTimeout(() => {

                loadingScreen.style.display =
                "none";

                showProfiles();

            },300);
        }

    },25);
});

/* =========================
   PROFILE SYSTEM
========================= */

function getPlayers(){

    return JSON.parse(

        localStorage.getItem(
            "lastBlockPlayers"
        )

    ) || [];
}


function savePlayers(
    players
){

    localStorage.setItem(

        "lastBlockPlayers",

        JSON.stringify(
            players
        )
    );
}


function createPlayerId(){

    return "LB" +

    Math.floor(
        100000 +
        Math.random() *
        900000
    );
}
function showProfiles(){

    profileScreen.classList.remove("hidden");
    gameScreen.classList.add("hidden");

    profilesContainer.innerHTML = "";

    const players = getPlayers();

    players.forEach(player => {

        const card = document.createElement("div");

        card.className = "profile-card";

        if(profileDeleteMode){
            card.classList.add("delete-mode");
        }

        card.innerHTML = `
            
            <button class="remove-profile-btn"
                    type="button"
                    aria-label="Remove ${player.name}">
                −
            </button>

            <div class="profile-avatar">

                ${
                    ["😎","🔥","⚡","👑","🚀"][
                        Math.floor(Math.random() * 5)
                    ]
                }

            </div>

            <h3>
                ${player.name}
            </h3>

            <p>
                ${player.id}
            </p>
        `;

        card.addEventListener("click", () => {

            // Don't open profile while deleting
            if(profileDeleteMode){
                return;
            }

            startPlayer(player);

        });

        const removeBtn =
            card.querySelector(".remove-profile-btn");

        removeBtn.addEventListener("click", (event) => {

            event.stopPropagation();

            if(!profileDeleteMode){
                return;
            }

            deletePlayer(player.id);

        });

        profilesContainer.appendChild(card);

    });
}

function deletePlayer(playerId){

    const players = getPlayers();

    const updatedPlayers = players.filter(
        player => player.id !== playerId
    );

    savePlayers(updatedPlayers);

    showProfiles();
}
manageProfilesBtn.addEventListener("click", () => {

    profileDeleteMode = !profileDeleteMode;

    manageProfilesBtn.classList.toggle(
        "active",
        profileDeleteMode
    );

    manageProfilesBtn.textContent =
        profileDeleteMode ? "✓" : "−";

    showProfiles();

});
addProfile.addEventListener(
"click",
() => {

    createPlayerPopup
    .classList.remove(
        "hidden"
    );
});

createPlayerBtn
.addEventListener(
"click",
() => {

    const name =

    playerNameInput
    .value
    .trim();

    if(!name)
    return;

    const players =
    getPlayers();

    const player = {

        name,

        id:
        createPlayerId(),

        highScore:0,

        coins:0
    };

    players.push(
        player
    );

    savePlayers(
        players
    );

    createPlayerPopup
    .classList.add(
        "hidden"
    );

    playerNameInput.value =
    "";

    showProfiles();
});

function startPlayer(
    player
){

    currentPlayer =
    player;

    profileScreen
    .classList.add(
        "hidden"
    );

    gameScreen
    .classList.remove(
        "hidden"
    );

    playerNameText.textContent =

    "👤 " + player.name;

    playerIdText.textContent =

    "🆔 " + player.id;

    setEmoji(
    "😎",
    "Welcome " +
    player.name +
    "!"
);
}



const placeSound =
new Audio("sounds/place.mp3");

const clearSound =
new Audio("sounds/clear.mp3");

const comboSound =
new Audio("sounds/combo.mp3");

const gameOverSound =
new Audio("sounds/gameover.mp3");

/* VOLUME CONTROL */

placeSound.volume = 0.3;

clearSound.volume = 0.5;

comboSound.volume = 0.6;

gameOverSound.volume = 0.7;

const comboText =
document.getElementById(
    "comboText"
);

const highScoreText =
document.getElementById(
    "highScore"
);
let highScore =

localStorage.getItem(
    "blockBlastHighScore"
) || 0;

highScoreText.textContent =
highScore;


const popup =
document.getElementById(
    "gameOverPopup"
);

const finalScore =
document.getElementById(
    "finalScore"
);

const bestScorePopup =
document.getElementById(
    "bestScorePopup"
);

const restartBtn =
document.getElementById(
    "restartBtn"
);

const replayBtn =
document.getElementById(
    "replayBtn"
);

const board =
document.getElementById("board");

const scoreText =
document.getElementById("score");

const blockArea =
document.getElementById("blockArea");

const gameEmoji =
document.getElementById(
    "gameEmoji"
);

const emojiText =
document.getElementById(
    "emojiText"
);

const backToProfilesBtn =
    document.getElementById("backToProfilesBtn");

    backToProfilesBtn.addEventListener("click", () => {

    const confirmBack = confirm(
        "Are you sure you want to go back to profiles?"
    );

    if(!confirmBack){
        return;
    }

    // Stop the current game
    gameScreen.classList.add("hidden");

    // Show profile selection
    profileScreen.classList.remove("hidden");

    // Refresh profiles
    showProfiles();

});

let score = 0;
let combo = 0;
const boardSize = 7;

let selectedBlock = null;
let ghostIndexes = [];

/* COLORS */

const colors = [

    "blue",
    "green",
    "purple",
    "red",
    "yellow",
    "cyan",
    "orange",
    "pink"
];


/* THEMES */

const themes = [

    { block:"neon" },

    { block:"wood" },

    { block:"leaf" },

    { block:"crystal" },

    { block:"fire" },

    { block:"galaxy" },

    { block:"ice" },

    { block:"lightning" }
];


/* UPDATE THEME */

function updateTheme(){

    const totalThemes =
    themes.length;

    const level =

    Math.floor(score / 200) %
    totalThemes;

    document.body.dataset.theme =
    themes[level].block;

    document.body.style.background =
    "linear-gradient(135deg,#000000,#050505,#0a0a0a)";
}


/* EMOJI REACTION */

function setEmoji(
    emoji,
    text
){

    gameEmoji.textContent =
    emoji;

    emojiText.textContent =
    text;

    gameEmoji.classList.remove(
        "emoji-pop"
    );

    void gameEmoji.offsetWidth;

    gameEmoji.classList.add(
        "emoji-pop"
    );
}


/* CREATE BOARD */

for(let i=0;i<49;i++){

    const cell =
    document.createElement("div");

    cell.className =
    "cell";

    cell.dataset.index =
    i;

    board.appendChild(cell);
}


/* SHAPES */

const shapes = [

    [[1]],

    [[1,1]],

    [[1],[1]],

    [[1,1,1]],

    [[1],[1],[1]],

    [[1,1],
     [1,1]],

    [[1,1,1],
     [0,1,0]],

    [[1,0],
     [1,1]],

    [[0,1],
     [1,1]],

    [[1,1,1,1]],

    [[1],
     [1],
     [1],
     [1]]
];


/* GENERATE BLOCKS */

function generateBlocks(){

    blockArea.innerHTML = "";

    for(let i=0;i<3;i++){

        const shape =

        shapes[
            Math.floor(
                Math.random() *
                shapes.length
            )
        ];

        const color =

        colors[
            Math.floor(
                Math.random() *
                colors.length
            )
        ];

        const block =
        document.createElement("div");

        block.className =
        "block";

        block.draggable = true;

        block.dataset.shape =
        JSON.stringify(shape);

        block.dataset.color =
        color;

        block.style.gridTemplateColumns =
        `repeat(${shape[0].length},1fr)`;


        shape.forEach(row => {

            row.forEach(cell => {

                const blockCell =
                document.createElement("div");

                if(cell){

                    blockCell.className =
                    `block-cell ${color}`;

                }else{

                    blockCell.style.visibility =
                    "hidden";
                }

                block.appendChild(blockCell);
            });
        });


        /* DRAG START */

        block.addEventListener(
            "dragstart",
            e => {

                selectedBlock =
                block;

                block.style.opacity =
                "0.7";

                e.dataTransfer.setData(
                    "text/plain",
                    "block"
                );
            }
        );


        /* DRAG END */

        block.addEventListener(
"dragend",
() => {

    block.style.opacity = "1";

    clearGhost();
});

        blockArea.appendChild(
            block
        );
    }

    setEmoji(
        "🎮",
        "Choose Your Next Move!"
    );
}

generateBlocks();


/* BOARD DRAG */

board.addEventListener(
"dragover",
e => {

    e.preventDefault();

    const target =
    document.elementFromPoint(
        e.clientX,
        e.clientY
    );

    if(

        target &&

        target.classList.contains(
            "cell"
        ) &&

        selectedBlock

    ){

        const shape =
        JSON.parse(
            selectedBlock.dataset.shape
        );

        showGhost(
            shape,
            parseInt(
                target.dataset.index
            )
        );
    }

    createGlowTrail(
        e.clientX,
        e.clientY
    );
});

  
/* DROP */

board.addEventListener(
"drop",
e => {

    e.preventDefault();

    if(!selectedBlock)
    return;

    const target =
    document.elementFromPoint(
        e.clientX,
        e.clientY
    );

    if(
        !target ||
        !target.classList.contains("cell")
    )
    return;


    const shape =
    JSON.parse(
        selectedBlock.dataset.shape
    );

    const color =
    selectedBlock.dataset.color;

    const startIndex =
    parseInt(
        target.dataset.index
    );

    placeShape(
        shape,
        startIndex,
        color
    );
});


/* PLACE SHAPE */

function placeShape(
    shape,
    startIndex,
    color
){

    const cells =
    document.querySelectorAll(".cell");

    let indexes = [];

    let valid = true;

    const startRow =
    Math.floor(
        startIndex / boardSize
    );

    const startCol =
    startIndex % boardSize;


    shape.forEach((row,r) => {

        row.forEach((value,c) => {

            if(value){

                const newRow =
                startRow + r;

                const newCol =
                startCol + c;

                if(

                    newRow >= boardSize ||

                    newCol >= boardSize

                ){

                    valid = false;

                    return;
                }

                const index =

                newRow * boardSize +
                newCol;

                const cell =
                cells[index];

                if(
                    cell.classList.contains(
                        "filled"
                    )
                ){

                    valid = false;

                    return;
                }

                indexes.push(index);
            }
        });
    });

    if(!valid){

        setEmoji(
            "😵",
            "Wrong Placement!"
        );

        return;
    }


    requestAnimationFrame(() => {

        indexes.forEach(index => {

            const cell =
            cells[index];

            cell.className =
            `cell filled ${color}`;

            cell.animate([

                {
                    transform:
                    "scale(0.65)"
                },

                {
                    transform:
                    "scale(1.15)"
                },

                {
                    transform:
                    "scale(1)"
                }

            ],{

                duration:160,

                easing:
                "cubic-bezier(.17,.67,.38,1.37)"
            });
        });

        score += indexes.length * 10;
placeSound.currentTime = 0;
placeSound.play();
        scoreText.textContent =
        score;
if(score > highScore){

    highScore = score;

    localStorage.setItem(
        "blockBlastHighScore",
        highScore
    );

    highScoreText.textContent =
    highScore;
}
        updateTheme();


        /* RANDOM HAPPY */

        const happyEmojis = [

            ["😎","Nice Move!"],

            ["🔥","Awesome!"],

            ["🚀","Great Placement!"],

            ["🤩","Cool!"],

            ["😄","Perfect!"]
        ];

        const randomHappy =

        happyEmojis[
            Math.floor(
                Math.random() *
                happyEmojis.length
            )
        ];

        setEmoji(
            randomHappy[0],
            randomHappy[1]
        );

        selectedBlock.remove();
clearGhost();
        clearLines();
        

        if(
            blockArea.children.length === 0
        ){

            generateBlocks();
            checkGameOver();
        }
        checkGameOver();
    });
}


/* CLEAR LINES */

function clearLines(){

    const cells =
    document.querySelectorAll(".cell");
let cleared = false;
    /* ROWS */

    for(let r=0;r<boardSize;r++){

        let full = true;

        for(let c=0;c<boardSize;c++){

            const index =
            r * boardSize + c;

            if(
                !cells[index]
                .classList.contains(
                    "filled"
                )
            ){

                full = false;
            }
        }

        if(full){
            clearSound.currentTime = 0;
clearSound.play();
cleared = true;
            createComboExplosion();

            setEmoji(
                "🥳",
                "HURRAY! LINE CLEARED!"
            );

            for(let c=0;c<boardSize;c++){

                const index =
                r * boardSize + c;

                const cell =
                cells[index];

                createParticles(cell);

                cell.classList.add(
                    "line-clear"
                );

                setTimeout(() => {

                    cell.className =
                    "cell";

                },420);
            }

            score += 100;
        }
    }


    /* COLUMNS */

    for(let c=0;c<boardSize;c++){

        let full = true;

        for(let r=0;r<boardSize;r++){

            const index =
            r * boardSize + c;

            if(
                !cells[index]
                .classList.contains(
                    "filled"
                )
            ){

                full = false;
            }
        }

        if(full){
            clearSound.currentTime = 0;
clearSound.play();
cleared = true;
            createComboExplosion();

            setEmoji(
                "🎉",
                "AMAZING CLEAR!"
            );

            for(let r=0;r<boardSize;r++){

                const index =
                r * boardSize + c;

                const cell =
                cells[index];

                createParticles(cell);

                cell.classList.add(
                    "line-clear"
                );

                setTimeout(() => {

                    cell.className =
                    "cell";

                },420);
            }

            score += 100;
        }

        if(cleared){

    combo++;

    if(combo > 1){
comboSound.currentTime = 0;
comboSound.play();
        comboText.textContent =
        "🔥 COMBO x" + combo;

        score += combo * 50;
    }

}else{

    combo = 0;

    comboText.textContent = "";
}
    }

    scoreText.textContent =
    score;

    updateTheme();
}


/* PARTICLES */

function createParticles(cell){

    const rect =
    cell.getBoundingClientRect();

    for(let i=0;i<14;i++){

        const particle =
        document.createElement("div");

        particle.className =
        "particle";

        particle.style.left =
        rect.left +
        rect.width/2 +
        "px";

        particle.style.top =
        rect.top +
        rect.height/2 +
        "px";

        particle.style.background =
        getComputedStyle(cell)
        .background;

        document.body.appendChild(
            particle
        );

        const x =
        (Math.random() - 0.5)
        * 180;

        const y =
        (Math.random() - 0.5)
        * 180;

        particle.animate([

            {
                transform:
                "translate(0,0) scale(1)",

                opacity:1
            },

            {
                transform:
                `translate(${x}px,${y}px) scale(0)`,

                opacity:0
            }

        ],{

            duration:700,

            easing:"ease-out"
        });

        setTimeout(() => {

            particle.remove();

        },700);
    }
}


/* COMBO EXPLOSION */

function createComboExplosion(){

    const boom =
    document.createElement("div");

    boom.className =
    "combo-explosion";

    boom.style.left =
    "50%";

    boom.style.top =
    "45%";

    boom.style.transform =
    "translate(-50%,-50%)";

    document.body.appendChild(
        boom
    );

    setTimeout(() => {

        boom.remove();

    },500);
}


/* GLOW TRAIL */

function createGlowTrail(x,y){

    const trail =
    document.createElement("div");

    trail.className =
    "glow-trail";

    trail.style.left =
    x + "px";

    trail.style.top =
    y + "px";

    document.body.appendChild(
        trail
    );

    setTimeout(() => {

        trail.remove();

    },450);
}

function clearGhost(){

    document
    .querySelectorAll(".ghost-cell")
    .forEach(cell => {

        cell.classList.remove(
            "ghost-cell"
        );

        cell.style.background = "";
    });

    ghostIndexes = [];
}

function showGhost(
    shape,
    startIndex
){

    clearGhost();

    const cells =
    document.querySelectorAll(".cell");

    const startRow =
    Math.floor(
        startIndex / boardSize
    );

    const startCol =
    startIndex % boardSize;

    let valid = true;

    let indexes = [];

    shape.forEach((row,r)=>{

        row.forEach((value,c)=>{

            if(!value) return;

            const newRow =
            startRow + r;

            const newCol =
            startCol + c;

            if(

                newRow >= boardSize ||

                newCol >= boardSize

            ){

                valid = false;

                return;
            }

            const index =

            newRow * boardSize +
            newCol;

            const cell =
            cells[index];

            if(
                cell.classList.contains(
                    "filled"
                )
            ){

                valid = false;

                return;
            }

            indexes.push(index);
        });
    });

    if(!valid)
    return;

    indexes.forEach(index=>{

       cells[index].classList.add(
    "ghost-cell"
);

cells[index].style.background =
getComputedStyle(
    selectedBlock.querySelector(".block-cell")
).background;
    });

    ghostIndexes = indexes;
}
function checkGameOver(){

    const blocks =
    document.querySelectorAll(
        ".block"
    );

    let possible = false;

    blocks.forEach(block => {

        const shape =
        JSON.parse(
            block.dataset.shape
        );

        if(
            canPlaceAnywhere(
                shape
            )
        ){

            possible = true;
        }
    });

    if(!possible){

        showGameOver();
    }
}

function canPlaceAnywhere(
    shape
){

    const cells =
    document.querySelectorAll(
        ".cell"
    );

    for(
        let start=0;
        start<boardSize*boardSize;
        start++
    ){

        let valid = true;

        const startRow =
        Math.floor(
            start / boardSize
        );

        const startCol =
        start % boardSize;

        shape.forEach((row,r)=>{

            row.forEach((value,c)=>{

                if(!value) return;

                const newRow =
                startRow + r;

                const newCol =
                startCol + c;

                if(

                    newRow >= boardSize ||

                    newCol >= boardSize

                ){

                    valid = false;

                    return;
                }

                const index =

                newRow * boardSize +
                newCol;

                if(
                    cells[index]
                    .classList.contains(
                        "filled"
                    )
                ){

                    valid = false;
                }
            });
        });

        if(valid)
        return true;
    }

    return false;
}


function showGameOver(){
gameOverSound.currentTime = 0;
gameOverSound.play();
    finalScore.textContent =
    score;

    bestScorePopup.textContent =
    highScore;

    popup.style.display =
    "flex";

    setEmoji(
    "☠️",
    "LAST BLOCK FAILED!"
);
}
restartBtn.addEventListener(
"click",
() => {

    gameOverPopup.style.display =
    "none";

    showProfiles();
});

replayBtn.addEventListener(
"click",
() => {

    restartGame();

});

function restartGame(){

    gameOverPopup.style.display =
    "none";

    score = 0;

    combo = 0;

    scoreText.textContent =
    0;

    comboText.textContent =
    "";

    const cells =
    document.querySelectorAll(
        ".cell"
    );

    cells.forEach(cell => {

        cell.className =
        "cell";

        cell.style.background =
        "";
    });

    blockArea.innerHTML =
    "";
    clearGhost();

    generateBlocks();

    setEmoji(
        "😎",
        "Let's Go Again!"
    );
}

if("serviceWorker" in navigator){

    navigator.serviceWorker
    .register("sw.js");

}