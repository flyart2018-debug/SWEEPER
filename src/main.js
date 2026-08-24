import { Game } from "./core/Game.js";
import { InputManager } from "./realtime/InputManager.js";


const game =
    new Game();


const input =
    new InputManager();


let selectedChipId =
    null;


let battleStarted =
    false;


let lastUIUpdate =
    0;


/* =====================================================
   SCREEN
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


function showScreen(name) {

    Object.values(screens)
        .forEach(screen => {

            if (screen) {

                screen.classList.remove(
                    "active"
                );

            }

        });


    if (
        screens[name]
    ) {

        screens[name]
            .classList.add(
                "active"
            );

    }

}


/* =====================================================
   CHARACTER SELECT
===================================================== */

function renderCharacterSelect() {

    const list =
        document.getElementById(
            "character-list"
        );


    if (!list) {

        return;

    }


    list.innerHTML = "";


    const characters = [

        {
            id: "REN",
            name: "レン・クロス",
            type: "BALANCE",
            weapon: "BLADE",
            ability: "OVERDRIVE",
            description:
                "攻撃・防御・移動を平均的に扱えるオールラウンダー。"
        },

        {
            id: "KAI",
            name: "カイ・ヴェルド",
            type: "SPEED",
            weapon: "KNIFE",
            ability: "STEP",
            description:
                "高い機動力で攻撃と離脱を繰り返す高速型。"
        }

    ];


    characters.forEach(character => {

        const card =
            document.createElement(
                "article"
            );


        card.className =
            `character-card ${character.id.toLowerCase()}`;


        card.innerHTML = `

            <h3>
                ${character.name}
            </h3>

            <div>
                ${character.type}
            </div>

            <p>
                WEAPON:
                ${character.weapon}
            </p>

            <p>
                ABILITY:
                ${character.ability}
            </p>

            <p>
                ${character.description}
            </p>

            <button
                type="button"
                class="character-select-button"
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


        list.appendChild(
            card
        );

    });

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


    battleStarted =
        true;


    showScreen(
        "battle"
    );


    updateBattleUI();


    setMessage(
        "REALTIME BATTLE // ONLINE"
    );

}


/* =====================================================
   FIELD
===================================================== */

function renderBattleField() {

    const field =
        document.getElementById(
            "battle-field"
        );


    if (!field) {

        return;

    }


    field.innerHTML = "";


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


            /*
             * PLAYER
             */

            if (
                state.playerPosition.row === row &&
                state.playerPosition.col === col
            ) {

                const player =
                    document.createElement(
                        "div"
                    );


                player.className =
                    "unit player";


                player.textContent =
                    state.player.shortName;


                cell.appendChild(
                    player
                );

            }


            /*
             * ENEMY
             */

            if (
                state.enemyPosition.row === row &&
                state.enemyPosition.col === col
            ) {

                const enemy =
                    document.createElement(
                        "div"
                    );


                enemy.className =
                    "unit enemy";


                enemy.textContent =
                    "CPU";


                cell.appendChild(
                    enemy
                );

            }


            /*
             * タップ移動
             */

            cell.addEventListener(
                "click",
                () => {

                    if (
                        !battleStarted
                    ) {

                        return;

                    }


                    game.movePlayer(
                        row,
                        col
                    );

                    updateBattleUI();

                }
            );


            field.appendChild(
                cell
            );

        }

    }

}


/* =====================================================
   CHIP UI
===================================================== */

function renderChips() {

    const container =
        document.getElementById(
            "chip-list"
        );


    if (!container) {

        return;

    }


    container.innerHTML = "";


    game.getAllChips()
        .forEach(chip => {

            if (!chip) {

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

                    useChip(
                        chip.id
                    );

                }
            );


            container.appendChild(
                button
            );

        });

}


/* =====================================================
   CHIP
===================================================== */

function useChip(
    chipId
) {

    if (
        !battleStarted
    ) {

        return;

    }


    const result =
        game.useChip(
            chipId
        );


    if (
        !result.success
    ) {

        setMessage(
            result.reason ||
            "CHIP UNAVAILABLE"
        );

        return;

    }


    selectedChipId =
        chipId;


    if (
        result.hit
    ) {

        setMessage(
            `CHIP HIT // -${result.damage}`
        );

    }
    else {

        setMessage(
            `CHIP // ${chipId}`
        );

    }


    updateBattleUI();

}


/* =====================================================
   ATTACK
===================================================== */

function attack() {

    if (
        !battleStarted
    ) {

        return;

    }


    const result =
        game.playerAttack();


    if (
        !result.success
    ) {

        setMessage(
            result.reason ||
            "ATTACK UNAVAILABLE"
        );

        return;

    }


    if (
        result.hit
    ) {

        setMessage(
            `HIT // -${result.damage}`
        );

    }
    else {

        setMessage(
            "ATTACK MISS"
        );

    }


    updateBattleUI();


    if (
        game.state.gameOver
    ) {

        showResult(
            game.state.winner ===
            "PLAYER"
        );

    }

}


/* =====================================================
   INPUT
===================================================== */

input.onDirection(
    direction => {

        if (
            !battleStarted
        ) {

            return;

        }


        game.realtime
            .movePlayer(
                direction
            );


        updateBattleUI();

    }
);


input.onAttack(
    () => {

        attack();

    }
);


/* =====================================================
   UPDATE
===================================================== */

function updateBattleUI() {

    const now =
        performance.now();


    /*
     * 更新しすぎない。
     * スマホ負荷を抑える。
     */

    if (
        now - lastUIUpdate <
        45
    ) {

        return;

    }


    lastUIUpdate =
        now;


    const state =
        game.state;


    if (
        !state.player ||
        !state.enemy
    ) {

        return;

    }


    const player =
        state.player;


    const enemy =
        state.enemy;


    setText(
        "player-name",
        player.shortName
    );


    setText(
        "enemy-name",
        enemy.shortName
    );


    setText(
        "player-hp",
        `${player.hp} / ${player.maxHp}`
    );


    setText(
        "enemy-hp",
        `${enemy.hp} / ${enemy.maxHp}`
    );


    const playerBar =
        document.getElementById(
            "player-hp-bar"
        );


    const enemyBar =
        document.getElementById(
            "enemy-hp-bar"
        );


    if (playerBar) {

        playerBar.style.width =
            `${Math.max(
                0,
                player.hp /
                player.maxHp *
                100
            )}%`;

    }


    if (enemyBar) {

        enemyBar.style.width =
            `${Math.max(
                0,
                enemy.hp /
                enemy.maxHp *
                100
            )}%`;

    }


    setText(
        "turn-number",
        "REALTIME"
    );


    renderBattleField();

    renderChips();


    if (
        state.gameOver
    ) {

        showResult(
            state.winner ===
            "PLAYER"
        );

    }

}


/* =====================================================
   RESULT
===================================================== */

function showResult(
    playerWon
) {

    battleStarted =
        false;


    const title =
        document.getElementById(
            "result-title"
        );


    const message =
        document.getElementById(
            "result-message"
        );


    if (
        title
    ) {

        title.textContent =
            playerWon
                ? "VICTORY"
                : "DEFEAT";

    }


    if (
        message
    ) {

        message.textContent =
            playerWon
                ? "TARGET NEUTRALIZED."
                : "SWEEPER SYSTEM OFFLINE.";

    }


    showScreen(
        "result"
    );

}


/* =====================================================
   HELPERS
===================================================== */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.textContent =
            value;

    }

}


function setMessage(
    message
) {

    const log =
        document.getElementById(
            "battle-log"
        );


    const action =
        document.getElementById(
            "action-message"
        );


    if (log) {

        log.textContent =
            message;

    }


    if (action) {

        action.textContent =
            message;

    }

}


/* =====================================================
   BUTTONS
===================================================== */

const startButton =
    document.getElementById(
        "start-button"
    );


if (startButton) {

    startButton.addEventListener(
        "click",
        () => {

            renderCharacterSelect();

            showScreen(
                "characterSelect"
            );

        }
    );

}


const backButton =
    document.getElementById(
        "back-to-title-button"
    );


if (backButton) {

    backButton.addEventListener(
        "click",
        () => {

            game.realtime.stop();

            showScreen(
                "title"
            );

        }
    );

}


const attackButton =
    document.getElementById(
        "attack-button"
    );


if (attackButton) {

    attackButton.addEventListener(
        "click",
        attack
    );

}


const restartButton =
    document.getElementById(
        "restart-button"
    );


if (restartButton) {

    restartButton.addEventListener(
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

}


const resultTitleButton =
    document.getElementById(
        "result-title-button"
    );


if (resultTitleButton) {

    resultTitleButton.addEventListener(
        "click",
        () => {

            game.realtime.stop();

            showScreen(
                "title"
            );

        }
    );

}


/* =====================================================
   BOOT
===================================================== */

console.log(
    "================================"
);

console.log(
    "SWEEPER REALTIME BATTLE"
);

console.log(
    "Realtime Engine: ONLINE"
);

console.log(
    "Grid: 5x5"
);

console.log(
    "Input: KEYBOARD + TOUCH"
);

console.log(
    "================================"
);