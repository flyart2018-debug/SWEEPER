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


    hideOldControls();


    updateBattleUI();


    setMessage(
        "REALTIME BATTLE // ONLINE"
    );

}


/* =====================================================
   REMOVE OLD CONTROLS
===================================================== */

function hideOldControls() {

    const attackButton =
        document.getElementById(
            "attack-button"
        );


    const endTurnButton =
        document.getElementById(
            "end-turn-button"
        );


    if (attackButton) {

        attackButton.style.display =
            "none";

    }


    if (endTurnButton) {

        endTurnButton.style.display =
            "none";

    }


    const realtimeControls =
        document.getElementById(
            "realtime-controls"
        );


    if (realtimeControls) {

        realtimeControls.remove();

    }

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


    field.style.touchAction =
        "manipulation";


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


            cell.style.touchAction =
                "manipulation";


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


            const isPlayerCell =
                state.playerPosition.row === row &&
                state.playerPosition.col === col;


            const isEnemyCell =
                state.enemyPosition.row === row &&
                state.enemyPosition.col === col;


            /* =================================================
               PLAYER
            ================================================= */

            if (
                isPlayerCell
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


            /* =================================================
               ENEMY
            ================================================= */

            if (
                isEnemyCell
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


            /* =================================================
               TOUCH
               
               通常マス
               → 移動

               敵
               → チップ選択中ならチップ使用
               → 未選択なら通常攻撃
            ================================================= */

            cell.addEventListener(
                "pointerup",
                event => {

                    if (
                        !battleStarted
                    ) {

                        return;

                    }


                    if (
                        event.pointerType ===
                        "mouse"
                    ) {

                        return;

                    }


                    /*
                     * 敵をタップ
                     */

                    if (
                        isEnemyCell
                    ) {

                        if (
                            selectedChipId
                        ) {

                            useChip(
                                selectedChipId
                            );

                        }
                        else {

                            attack();

                        }

                        return;

                    }


                    /*
                     * 通常マスをタップ
                     */

                    game.movePlayer(
                        row,
                        col
                    );


                    updateBattleUI();

                }
            );


            /* =================================================
               PC / マウス
            ================================================= */

            cell.addEventListener(
                "click",
                () => {

                    if (
                        !battleStarted
                    ) {

                        return;

                    }


                    if (
                        isEnemyCell
                    ) {

                        if (
                            selectedChipId
                        ) {

                            useChip(
                                selectedChipId
                            );

                        }
                        else {

                            attack();

                        }

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


            /*
             * チップをタップしても
             * その場では発動しない。
             *
             * 選択状態にするだけ。
             */

            button.addEventListener(
                "click",
                event => {

                    event.stopPropagation();


                    if (
                        selectedChipId ===
                        chip.id
                    ) {

                        /*
                         * 同じチップをもう一度
                         * タップしたら選択解除。
                         */

                        selectedChipId =
                            null;

                    }
                    else {

                        selectedChipId =
                            chip.id;

                    }


                    updateBattleUI();


                    if (
                        selectedChipId
                    ) {

                        setMessage(
                            `${chip.name} SELECTED // TAP CPU`
                        );

                    }
                    else {

                        setMessage(
                            "CHIP SELECTION CLEARED"
                        );

                    }

                }
            );


            container.appendChild(
                button
            );

        });

}


/* =====================================================
   CHIP USE
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
        null;


    if (
        result.hit
    ) {

        setMessage(
            `CHIP HIT // -${result.damage}`
        );

    }
    else if (
        result.recovered
    ) {

        setMessage(
            `RECOVER // +${result.recovered}`
        );

    }
    else {

        setMessage(
            `CHIP USED // ${chipId}`
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
   NORMAL ATTACK
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
   KEYBOARD
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
   BATTLE UI
===================================================== */

function updateBattleUI() {

    const now =
        performance.now();


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


    if (
        playerBar
    ) {

        playerBar.style.width =
            `${Math.max(
                0,
                player.hp /
                player.maxHp *
                100
            )}%`;

    }


    if (
        enemyBar
    ) {

        enemyBar.style.width =
            `${Math.max(
                0,
                enemy.hp /
                enemy.maxHp *
                100
            )}%`;

    }


    /*
     * ターン表示はリアルタイムなので消す。
     */

    setText(
        "turn-number",
        ""
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


    selectedChipId =
        null;


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


    if (
        element
    ) {

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


    if (
        log
    ) {

        log.textContent =
            message;

    }


    if (
        action
    ) {

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


if (
    startButton
) {

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


if (
    backButton
) {

    backButton.addEventListener(
        "click",
        () => {

            game.realtime.stop();

            battleStarted =
                false;

            selectedChipId =
                null;

            showScreen(
                "title"
            );

        }
    );

}


const restartButton =
    document.getElementById(
        "restart-button"
    );


if (
    restartButton
) {

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


if (
    resultTitleButton
) {

    resultTitleButton.addEventListener(
        "click",
        () => {

            game.realtime.stop();

            battleStarted =
                false;

            selectedChipId =
                null;

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
    "================================"
);

console.log(
    "FIELD TAP = MOVE"
);

console.log(
    "CHIP TAP = SELECT"
);

console.log(
    "ENEMY TAP = USE CHIP / ATTACK"
);

console.log(
    "SPACE = NORMAL ATTACK"
);

console.log(
    "================================"
);