/*
=========================================================
 SWEEPER
 Cyber Battle System
 Alpha Web Prototype
=========================================================

 STEP 1
 - Application boot
 - Screen management
 - Character selection
 - Basic 5x5 battlefield rendering

 Battle logic will be separated into modules in the
 following implementation steps.
=========================================================
*/


/* =====================================================
   GAME DATA
===================================================== */

const CHARACTERS = {

    REN: {

        id: "REN",

        name: "レン・クロス",

        shortName: "REN",

        type: "バランス型",

        color: "#2d7cff",

        description:
            "攻撃・防御・移動を平均的に扱えるオールラウンダー。",

        weapon:
            "ブレード",

        attackDamage:
            30,

        attackRange:
            1,

        ability:
            "オーバードライブ",

        uniqueChip:
            "オーバーブレード"

    },


    KAI: {

        id: "KAI",

        name: "カイ・ヴェルド",

        shortName: "KAI",

        type: "スピード型",

        color: "#7dff45",

        description:
            "高い機動力で敵を翻弄し、攻撃と離脱を繰り返す高速型。",

        weapon:
            "ナイフ",

        attackDamage:
            20,

        attackRange:
            1,

        ability:
            "ステップ",

        uniqueChip:
            "アクセルステップ"

    },


    /*
     * Future playable characters.
     * They are data-ready but not selectable
     * in the first prototype.
     */

    GARDO: {

        id: "GARDO",

        name: "ガルド・ブレイク",

        shortName: "GARDO",

        type: "パワー型",

        color: "#ff4b45",

        description:
            "高い攻撃力と耐久力を持つパワー型。",

        weapon:
            "ハンマー",

        attackDamage:
            50,

        attackRange:
            1,

        ability:
            "チャージ",

        uniqueChip:
            "メガハンマー",

        playable:
            false

    },


    SHION: {

        id: "SHION",

        name: "シオン・レイヴ",

        shortName: "SHION",

        type: "テクニック型",

        color: "#b76cff",

        description:
            "遠距離攻撃や特殊効果で相手をコントロールする。",

        weapon:
            "ショット",

        attackDamage:
            20,

        attackRange:
            3,

        ability:
            "スキャン",

        uniqueChip:
            "トラップ",

        playable:
            false

    }

};


/* =====================================================
   COMMON CHIPS
===================================================== */

const COMMON_CHIPS = [

    {
        id: "SWORD",

        name: "ソード",

        description:
            "前方1マスに40ダメージ。",

        damage:
            40
    },


    {
        id: "SHOT",

        name: "ショット",

        description:
            "前方3マスに20ダメージ。",

        damage:
            20
    },


    {
        id: "SHIELD",

        name: "シールド",

        description:
            "受けるダメージを50%軽減。",

        damageReduction:
            0.5
    },


    {
        id: "DASH",

        name: "ダッシュ",

        description:
            "前方に2マス移動。",

        movement:
            2
    },


    {
        id: "RECOVER",

        name: "リカバー",

        description:
            "自分のHPを30回復。",

        recovery:
            30
    }

];


/* =====================================================
   GAME STATE
===================================================== */

const GAME = {

    screen:
        "title",

    selectedCharacter:
        null,

    turn:
        1,

    playerHP:
        100,

    enemyHP:
        100,

    playerPosition:
        {
            row: 4,
            col: 2
        },

    enemyPosition:
        {
            row: 0,
            col: 2
        },

    selectedChip:
        null

};


/* =====================================================
   DOM
===================================================== */

const screens = {

    title:
        document.getElementById(
            "title-screen"
        ),

    characterSelect:
        document.getElementById(
            "character-select-screen"
        ),

    battle:
        document.getElementById(
            "battle-screen"
        ),

    result:
        document.getElementById(
            "result-screen"
        )

};


const characterList =
    document.getElementById(
        "character-list"
    );


const battleField =
    document.getElementById(
        "battle-field"
    );


/* =====================================================
   SCREEN MANAGEMENT
===================================================== */

function showScreen(screenName) {

    Object.values(screens).forEach(
        screen => {

            screen.classList.remove(
                "active"
            );

        }
    );


    screens[screenName]
        .classList.add(
            "active"
        );


    GAME.screen =
        screenName;

}


/* =====================================================
   CHARACTER SELECT
===================================================== */

function renderCharacterSelect() {

    characterList.innerHTML = "";


    const playableCharacters = [

        CHARACTERS.REN,

        CHARACTERS.KAI

    ];


    playableCharacters.forEach(
        character => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                `character-card ${character.id.toLowerCase()}`;


            card.innerHTML = `

                <div class="character-color"></div>

                <h3 class="character-name">
                    ${character.name}
                </h3>

                <div class="character-type">
                    ${character.type}
                </div>

                <div class="character-description">

                    <strong>
                        WEAPON
                    </strong>

                    <br>

                    ${character.weapon}

                    <br><br>

                    <strong>
                        ABILITY
                    </strong>

                    <br>

                    ${character.ability}

                    <br><br>

                    ${character.description}

                </div>

                <button
                    class="character-select-button"
                    type="button"
                >
                    SELECT
                </button>

            `;


            card.addEventListener(
                "click",
                () => {

                    selectCharacter(
                        character.id
                    );

                }
            );


            characterList.appendChild(
                card
            );

        }
    );

}


/* =====================================================
   SELECT CHARACTER
===================================================== */

function selectCharacter(
    characterId
) {

    const character =
        CHARACTERS[
            characterId
        ];


    if (!character) {

        return;

    }


    GAME.selectedCharacter =
        character;


    startBattle();

}


/* =====================================================
   START BATTLE
===================================================== */

function startBattle() {

    GAME.turn =
        1;

    GAME.playerHP =
        100;

    GAME.enemyHP =
        100;


    GAME.playerPosition = {

        row: 4,

        col: 2

    };


    GAME.enemyPosition = {

        row: 0,

        col: 2

    };


    GAME.selectedChip =
        null;


    updateBattleHeader();

    renderBattleField();

    renderChips();


    const player =
        GAME.selectedCharacter;


    document.getElementById(
        "battle-log"
    ).textContent =
        `${player.shortName} ONLINE // BATTLEFIELD READY`;


    document.getElementById(
        "action-message"
    ).textContent =
        "SELECT ACTION";


    showScreen(
        "battle"
    );

}


/* =====================================================
   BATTLE FIELD
===================================================== */

function renderBattleField() {

    battleField.innerHTML = "";


    for (
        let row = 0;
        row < 5;
        row++
    ) {

        for (
            let col = 0;
            col < 5;
            col++
        ) {

            const cell =
                document.createElement(
                    "div"
                );


            cell.className =
                "battle-cell";


            if (row >= 3) {

                cell.classList.add(
                    "player-zone"
                );

            }
            else {

                cell.classList.add(
                    "enemy-zone"
                );

            }


            if (row === 2) {

                cell.classList.add(
                    "center-line"
                );

            }


            cell.dataset.row =
                row;

            cell.dataset.col =
                col;


            if (
                row ===
                    GAME.playerPosition.row &&
                col ===
                    GAME.playerPosition.col
            ) {

                const playerUnit =
                    document.createElement(
                        "div"
                    );


                playerUnit.className =
                    "unit player";


                playerUnit.textContent =
                    GAME.selectedCharacter.shortName;


                cell.appendChild(
                    playerUnit
                );

            }


            if (
                row ===
                    GAME.enemyPosition.row &&
                col ===
                    GAME.enemyPosition.col
            ) {

                const enemyUnit =
                    document.createElement(
                        "div"
                    );


                enemyUnit.className =
                    "unit enemy";


                enemyUnit.textContent =
                    "CPU";


                cell.appendChild(
                    enemyUnit
                );

            }


            cell.addEventListener(
                "click",
                () => {

                    handleCellClick(
                        row,
                        col
                    );

                }
            );


            battleField.appendChild(
                cell
            );

        }

    }

}


/* =====================================================
   FIELD CLICK
===================================================== */

function handleCellClick(
    row,
    col
) {

    const current =
        GAME.playerPosition;


    const distance =
        Math.abs(
            current.row - row
        )
        +
        Math.abs(
            current.col - col
        );


    /*
     * Prototype movement:
     * one grid square per action.
     *
     * The dedicated GridManager and
     * movement rules will replace this
     * in the next implementation step.
     */

    if (
        distance !== 1
    ) {

        document.getElementById(
            "action-message"
        ).textContent =
            "MOVE 1 CELL ONLY";

        return;

    }


    /*
     * Player cannot move into enemy position.
     */

    if (
        row === GAME.enemyPosition.row &&
        col === GAME.enemyPosition.col
    ) {

        document.getElementById(
            "action-message"
        ).textContent =
            "TARGET CELL OCCUPIED";

        return;

    }


    GAME.playerPosition = {

        row,

        col

    };


    renderBattleField();


    document.getElementById(
        "action-message"
    ).textContent =
        "POSITION UPDATED";

}


/* =====================================================
   CHIPS
===================================================== */

function renderChips() {

    const container =
        document.getElementById(
            "chip-list"
        );


    container.innerHTML = "";


    const chips = [

        ...COMMON_CHIPS,

        {
            id:
                GAME.selectedCharacter.id ===
                    "REN"
                    ? "OVER_BLADE"
                    : "ACCEL_STEP",

            name:
                GAME.selectedCharacter.id ===
                    "REN"
                    ? "オーバーブレード"
                    : "アクセルステップ",

            description:
                GAME.selectedCharacter.id ===
                    "REN"
                    ? "次の攻撃を強化。"
                    : "2マス移動。攻撃力+10。"

        }

    ];


    chips.forEach(
        chip => {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "chip-button";


            button.innerHTML = `

                <span class="chip-name">
                    ${chip.name}
                </span>

                <span class="chip-description">
                    ${chip.description}
                </span>

            `;


            button.addEventListener(
                "click",
                () => {

                    selectChip(
                        chip
                    );

                }
            );


            container.appendChild(
                button
            );

        }
    );

}


/* =====================================================
   SELECT CHIP
===================================================== */

function selectChip(
    chip
) {

    GAME.selectedChip =
        chip;


    document
        .querySelectorAll(
            ".chip-button"
        )
        .forEach(
            button => {

                button.classList.remove(
                    "selected"
                );

            }
        );


    event.currentTarget
        .classList
        .add(
            "selected"
        );


    document.getElementById(
        "action-message"
    ).textContent =
        `${chip.name} SELECTED`;

}


/* =====================================================
   UPDATE HEADER
===================================================== */

function updateBattleHeader() {

    const player =
        GAME.selectedCharacter;


    document.getElementById(
        "player-name"
    ).textContent =
        player.shortName;


    document.getElementById(
        "player-hp"
    ).textContent =
        `${GAME.playerHP} / 100`;


    document.getElementById(
        "enemy-hp"
    ).textContent =
        `${GAME.enemyHP} / 100`;


    document.getElementById(
        "player-hp-bar"
    ).style.width =
        `${GAME.playerHP}%`;


    document.getElementById(
        "enemy-hp-bar"
    ).style.width =
        `${GAME.enemyHP}%`;


    document.getElementById(
        "turn-number"
    ).textContent =
        GAME.turn;

}


/* =====================================================
   ATTACK
===================================================== */

function playerAttack() {

    const player =
        GAME.selectedCharacter;


    const distance =
        Math.abs(
            GAME.playerPosition.row -
            GAME.enemyPosition.row
        )
        +
        Math.abs(
            GAME.playerPosition.col -
            GAME.enemyPosition.col
        );


    if (
        distance > player.attackRange
    ) {

        document.getElementById(
            "action-message"
        ).textContent =
            "TARGET OUT OF RANGE";

        return;

    }


    let damage =
        player.attackDamage;


    /*
     * REN:
     * Overdrive
     */

    if (
        player.id === "REN" &&
        GAME.playerHP <= 30
    ) {

        damage += 10;

    }


    GAME.enemyHP =
        Math.max(
            0,
            GAME.enemyHP - damage
        );


    updateBattleHeader();


    document.getElementById(
        "battle-log"
    ).textContent =
        `${player.shortName} ATTACK // -${damage} HP`;


    document.getElementById(
        "action-message"
    ).textContent =
        `HIT ${damage}`;


    if (
        GAME.enemyHP <= 0
    ) {

        finishBattle(
            true
        );

        return;

    }


    /*
     * Temporary CPU response.
     * This will be replaced by EnemyAI.
     */

    setTimeout(
        enemyTurn,
        350
    );

}


/* =====================================================
   ENEMY TURN
===================================================== */

function enemyTurn() {

    if (
        GAME.enemyHP <= 0 ||
        GAME.playerHP <= 0
    ) {

        return;

    }


    const distance =
        Math.abs(
            GAME.playerPosition.row -
            GAME.enemyPosition.row
        )
        +
        Math.abs(
            GAME.playerPosition.col -
            GAME.enemyPosition.col
        );


    if (
        distance === 1
    ) {

        const damage =
            20;


        GAME.playerHP =
            Math.max(
                0,
                GAME.playerHP - damage
            );


        document.getElementById(
            "battle-log"
        ).textContent =
            `CPU ATTACK // -${damage} HP`;

    }
    else {

        moveEnemyTowardPlayer();

        document.getElementById(
            "battle-log"
        ).textContent =
            "CPU MOVED";

    }


    updateBattleHeader();

    renderBattleField();


    if (
        GAME.playerHP <= 0
    ) {

        finishBattle(
            false
        );

        return;

    }


    GAME.turn++;


    updateBattleHeader();


    document.getElementById(
        "action-message"
    ).textContent =
        "YOUR TURN";

}


/* =====================================================
   TEMPORARY CPU MOVEMENT
===================================================== */

function moveEnemyTowardPlayer() {

    const enemy =
        GAME.enemyPosition;


    const player =
        GAME.playerPosition;


    let nextRow =
        enemy.row;


    let nextCol =
        enemy.col;


    if (
        enemy.row < player.row
    ) {

        nextRow++;

    }
    else if (
        enemy.row > player.row
    ) {

        nextRow--;

    }
    else if (
        enemy.col < player.col
    ) {

        nextCol++;

    }
    else if (
        enemy.col > player.col
    ) {

        nextCol--;

    }


    /*
     * Don't move onto the player.
     */

    if (
        nextRow === player.row &&
        nextCol === player.col
    ) {

        return;

    }


    /*
     * Keep the enemy inside the grid.
     */

    if (
        nextRow < 0 ||
        nextRow > 4 ||
        nextCol < 0 ||
        nextCol > 4
    ) {

        return;

    }


    GAME.enemyPosition = {

        row: nextRow,

        col: nextCol

    };

}


/* =====================================================
   FINISH
===================================================== */

function finishBattle(
    playerWon
) {

    const resultTitle =
        document.getElementById(
            "result-title"
        );


    const resultMessage =
        document.getElementById(
            "result-message"
        );


    if (playerWon) {

        resultTitle.textContent =
            "VICTORY";


        resultMessage.textContent =
            "TARGET NEUTRALIZED.";

    }
    else {

        resultTitle.textContent =
            "DEFEAT";


        resultMessage.textContent =
            "SWEEPER SYSTEM OFFLINE.";

    }


    showScreen(
        "result"
    );

}


/* =====================================================
   EVENT LISTENERS
===================================================== */

document
    .getElementById(
        "start-button"
    )
    .addEventListener(
        "click",
        () => {

            renderCharacterSelect();

            showScreen(
                "characterSelect"
            );

        }
    );


document
    .getElementById(
        "back-to-title-button"
    )
    .addEventListener(
        "click",
        () => {

            showScreen(
                "title"
            );

        }
    );


document
    .getElementById(
        "attack-button"
    )
    .addEventListener(
        "click",
        () => {

            playerAttack();

        }
    );


document
    .getElementById(
        "end-turn-button"
    )
    .addEventListener(
        "click",
        () => {

            enemyTurn();

        }
    );


document
    .getElementById(
        "restart-button"
    )
    .addEventListener(
        "click",
        () => {

            startBattle();

        }
    );


document
    .getElementById(
        "result-title-button"
    )
    .addEventListener(
        "click",
        () => {

            showScreen(
                "title"
            );

        }
    );


/* =====================================================
   BOOT
===================================================== */

console.log(
    "SWEEPER // WEB PROTOTYPE ONLINE"
);

console.log(
    "Characters:",
    Object.keys(
        CHARACTERS
    )
);

console.log(
    "Common chips:",
    COMMON_CHIPS.map(
        chip => chip.name
    )
);