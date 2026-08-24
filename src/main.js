import { Game } from "./core/Game.js";


/* =====================================================
   SWEEPER
   Main Application Controller
===================================================== */


const game = new Game();


let selectedChipId = null;

let actionUsed = false;

let attackPerformed = false;

let battleLocked = false;


/* =====================================================
   DOM
===================================================== */

const screens = {

    title:
        document.getElementById("title-screen"),

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


const battleField =
    document.getElementById(
        "battle-field"
    );


const characterList =
    document.getElementById(
        "character-list"
    );


const battleLog =
    document.getElementById(
        "battle-log"
    );


const actionMessage =
    document.getElementById(
        "action-message"
    );


/* =====================================================
   SCREEN
===================================================== */

function showScreen(name) {

    Object.values(screens).forEach(
        screen => {

            screen.classList.remove(
                "active"
            );

        }
    );


    screens[name].classList.add(
        "active"
    );

}


/* =====================================================
   CHARACTER SELECT
===================================================== */

function renderCharacterSelect() {

    characterList.innerHTML = "";


    const characters = [

        {
            id: "REN",
            name: "レン・クロス",
            type: "バランス型",
            color: "#2d7cff",
            weapon: "ブレード",
            ability: "オーバードライブ",
            description:
                "攻撃・防御・移動を平均的に扱えるオールラウンダー。"
        },

        {
            id: "KAI",
            name: "カイ・ヴェルド",
            type: "スピード型",
            color: "#7dff45",
            weapon: "ナイフ",
            ability: "ステップ",
            description:
                "高い機動力で攻撃と離脱を繰り返す高速型。"
        }

    ];


    characters.forEach(
        character => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "character-card " +
                character.id.toLowerCase();


            card.innerHTML = `

                <div class="character-color"></div>

                <h3 class="character-name">
                    ${character.name}
                </h3>

                <div class="character-type">
                    ${character.type}
                </div>

                <div class="character-description">

                    <strong>WEAPON</strong>
                    <br>
                    ${character.weapon}

                    <br><br>

                    <strong>ABILITY</strong>
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

                    startBattle(
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
   START BATTLE
===================================================== */

function startBattle(
    characterId
) {

    game.start(
        characterId
    );


    selectedChipId =
        null;

    actionUsed =
        false;

    attackPerformed =
        false;

    battleLocked =
        false;


    showScreen(
        "battle"
    );


    updateBattleUI();


    battleLog.textContent =
        `${game.state.player.shortName} ONLINE // BATTLEFIELD READY`;


    actionMessage.textContent =
        "YOUR TURN";

}


/* =====================================================
   BATTLE FIELD
===================================================== */

function renderBattleField() {

    battleField.innerHTML = "";


    const state =
        game.state;


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


            if (
                row >= 3
            ) {

                cell.classList.add(
                    "player-zone"
                );

            }
            else {

                cell.classList.add(
                    "enemy-zone"
                );

            }


            if (
                row === 2
            ) {

                cell.classList.add(
                    "center-line"
                );

            }


            cell.dataset.row =
                row;

            cell.dataset.col =
                col;


            /*
             * PLAYER
             */

            if (
                row ===
                    state.playerPosition.row &&
                col ===
                    state.playerPosition.col
            ) {

                const unit =
                    document.createElement(
                        "div"
                    );


                unit.className =
                    "unit player";


                unit.textContent =
                    state.player.shortName;


                cell.appendChild(
                    unit
                );

            }


            /*
             * ENEMY
             */

            if (
                row ===
                    state.enemyPosition.row &&
                col ===
                    state.enemyPosition.col
            ) {

                const unit =
                    document.createElement(
                        "div"
                    );


                unit.className =
                    "unit enemy";


                unit.textContent =
                    "CPU";


                cell.appendChild(
                    unit
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

    if (
        battleLocked
    ) {

        return;

    }


    if (
        game.state.gameOver
    ) {

        return;

    }


    /*
     * If an action has already been used,
     * movement is locked.
     */

    if (
        actionUsed
    ) {

        actionMessage.textContent =
            "ACTION ALREADY USED";

        return;

    }


    const result =
        game.movePlayer(
            row,
            col
        );


    if (
        !result.success
    ) {

        actionMessage.textContent =
            "MOVE 1 CELL ONLY";

        return;

    }


    actionUsed =
        true;


    battleLog.textContent =
        "PLAYER MOVED";


    actionMessage.textContent =
        "ACTION COMPLETE";


    updateBattleUI();


    executeEnemyTurn();

}


/* =====================================================
   ATTACK
===================================================== */

function handleAttack() {

    if (
        battleLocked ||
        actionUsed
    ) {

        return;

    }


    const result =
        game.playerAttack();


    if (
        !result.success
    ) {

        actionMessage.textContent =
            "TARGET OUT OF RANGE";

        return;

    }


    actionUsed =
        true;


    attackPerformed =
        true;


    battleLog.textContent =
        `PLAYER ATTACK // -${result.damage} HP`;


    actionMessage.textContent =
        `HIT ${result.damage}`;


    updateBattleUI();


    if (
        result.gameOver
    ) {

        showResult(
            true
        );

        return;

    }


    executeEnemyTurn();

}


/* =====================================================
   CHIP LIST
===================================================== */

function renderChips() {

    const container =
        document.getElementById(
            "chip-list"
        );


    container.innerHTML = "";


    const chips =
        game.getAllChips();


    chips.forEach(
        chip => {

            if (
                !chip
            ) {

                return;

            }


            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "chip-button";


            if (
                selectedChipId ===
                chip.id
            ) {

                button.classList.add(
                    "selected"
                );

            }


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

                    handleChip(
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
   CHIP
===================================================== */

function handleChip(
    chip
) {

    if (
        battleLocked ||
        game.state.gameOver
    ) {

        return;

    }


    /*
     * Modifier chips can be used before
     * the main attack.
     */

    if (
        chip.id ===
            "OVER_BLADE"
    ) {

        if (
            game.state.player.id !==
            "REN"
        ) {

            return;

        }


        const result =
            game.useChip(
                chip.id
            );


        if (
            !result.success
        ) {

            return;

        }


        selectedChipId =
            chip.id;


        actionMessage.textContent =
            "OVERBLADE READY";


        battleLog.textContent =
            "NEXT ATTACK POWER +50";


        renderChips();

        return;

    }


    if (
        chip.id ===
            "ACCEL_STEP"
    ) {

        if (
            game.state.player.id !==
            "KAI"
        ) {

            return;

        }


        const result =
            game.useChip(
                chip.id
            );


        if (
            !result.success
        ) {

            actionMessage.textContent =
                "CANNOT USE HERE";

            return;

        }


        selectedChipId =
            chip.id;


        actionMessage.textContent =
            "ACCEL STEP // ATTACK +10";


        battleLog.textContent =
            "KAI POSITION SHIFTED";


        updateBattleUI();

        renderChips();

        return;

    }


    /*
     * DASH can be used after attack,
     * according to the prototype specification.
     */

    if (
        chip.id === "DASH"
    ) {

        if (
            !attackPerformed &&
            actionUsed
        ) {

            actionMessage.textContent =
                "DASH UNAVAILABLE";

            return;

        }


        const result =
            game.useChip(
                chip.id
            );


        if (
            !result.success
        ) {

            actionMessage.textContent =
                "CANNOT DASH";

            return;

        }


        actionUsed =
            true;


        battleLog.textContent =
            "DASH // MOVED 2 CELLS";


        actionMessage.textContent =
            "DASH COMPLETE";


        updateBattleUI();


        if (
            attackPerformed
        ) {

            executeEnemyTurn();

        }


        return;

    }


    /*
     * Other chips consume the action.
     */

    if (
        actionUsed
    ) {

        actionMessage.textContent =
            "ACTION ALREADY USED";

        return;

    }


    const result =
        game.useChip(
            chip.id
        );


    if (
        !result.success
    ) {

        actionMessage.textContent =
            "CHIP CANNOT BE USED";

        return;

    }


    actionUsed =
        true;


    selectedChipId =
        chip.id;


    if (
        chip.id ===
        "SWORD"
    ) {

        battleLog.textContent =
            "SWORD // " +
            `-${result.damage} HP`;

    }


    else if (
        chip.id ===
        "SHOT"
    ) {

        battleLog.textContent =
            "SHOT // " +
            `-${result.damage} HP`;

    }


    else if (
        chip.id ===
        "SHIELD"
    ) {

        battleLog.textContent =
            "SHIELD // DAMAGE -50%";

    }


    else if (
        chip.id ===
        "RECOVER"
    ) {

        battleLog.textContent =
            `RECOVER // +${result.recovered} HP`;

    }


    actionMessage.textContent =
        "CHIP ACTION COMPLETE";


    updateBattleUI();


    if (
        game.state.gameOver
    ) {

        showResult(
            true
        );

        return;

    }


    executeEnemyTurn();

}


/* =====================================================
   ENEMY TURN
===================================================== */

async function executeEnemyTurn() {

    if (
        battleLocked ||
        game.state.gameOver
    ) {

        return;

    }


    battleLocked =
        true;


    actionMessage.textContent =
        "ENEMY TURN";


    await wait(
        450
    );


    const result =
        await game.executeEnemyTurn();


    updateBattleUI();


    if (
        game.state.gameOver
    ) {

        showResult(
            false
        );

        return;

    }


    actionUsed =
        false;


    attackPerformed =
        false;


    selectedChipId =
        null;


    battleLocked =
        false;


    renderChips();


    actionMessage.textContent =
        "YOUR TURN";


    battleLog.textContent =
        `TURN ${game.state.turn} // READY`;

}


/* =====================================================
   UI UPDATE
===================================================== */

function updateBattleUI() {

    const state =
        game.state;


    if (
        !state.player
    ) {

        return;

    }


    const player =
        state.player;


    const enemy =
        state.enemy;


    document.getElementById(
        "player-name"
    ).textContent =
        player.shortName;


    document.getElementById(
        "enemy-name"
    ).textContent =
        enemy.shortName;


    document.getElementById(
        "player-hp"
    ).textContent =
        `${player.hp} / ${player.maxHp}`;


    document.getElementById(
        "enemy-hp"
    ).textContent =
        `${enemy.hp} / ${enemy.maxHp}`;


    document.getElementById(
        "player-hp-bar"
    ).style.width =
        `${Math.max(
            0,
            player.hp /
            player.maxHp *
            100
        )}%`;


    document.getElementById(
        "enemy-hp-bar"
    ).style.width =
        `${Math.max(
            0,
            enemy.hp /
            enemy.maxHp *
            100
        )}%`;


    document.getElementById(
        "turn-number"
    ).textContent =
        state.turn;


    renderBattleField();

    renderChips();

}


/* =====================================================
   RESULT
===================================================== */

function showResult(
    playerWon
) {

    battleLocked =
        true;


    const title =
        document.getElementById(
            "result-title"
        );


    const message =
        document.getElementById(
            "result-message"
        );


    if (
        playerWon
    ) {

        title.textContent =
            "VICTORY";


        message.textContent =
            "TARGET NEUTRALIZED.";

    }
    else {

        title.textContent =
            "DEFEAT";


        message.textContent =
            "SWEEPER SYSTEM OFFLINE.";

    }


    showScreen(
        "result"
    );

}


/* =====================================================
   WAIT
===================================================== */

function wait(
    milliseconds
) {

    return new Promise(
        resolve => {

            setTimeout(
                resolve,
                milliseconds
            );

        }
    );

}


/* =====================================================
   BUTTONS
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
        handleAttack
    );


document
    .getElementById(
        "end-turn-button"
    )
    .addEventListener(
        "click",
        () => {

            if (
                battleLocked ||
                actionUsed
            ) {

                return;

            }


            executeEnemyTurn();

        }
    );


document
    .getElementById(
        "restart-button"
    )
    .addEventListener(
        "click",
        () => {

            if (
                game.state.player
            ) {

                startBattle(
                    game.state.player.id
                );

            }

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
    "================================="
);

console.log(
    "SWEEPER // ONLINE"
);

console.log(
    "Battle Engine: READY"
);

console.log(
    "Character System: READY"
);

console.log(
    "Chip System: READY"
);

console.log(
    "Enemy AI: READY"
);

console.log(
    "================================="
);