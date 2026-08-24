import { Game } from "./core/Game.js";
import { InputManager } from "./realtime/InputManager.js";


/* =====================================================
   SWEEPER MAIN CONTROLLER
   Character Visual Edition
===================================================== */


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


let lastPlayerPosition =
    null;


let animationTimer =
    null;


/* =====================================================
   CHARACTER ASSETS
===================================================== */

const CHARACTER_ASSETS = {

    REN: {

        idle:
            "./ren-idle.png",

        move:
            "./ren-move.png",

        attack:
            "./ren-attack.png"

    },

    KAI: {

        idle:
            "./kai-idle.png",

        move:
            "./kai-move.png",

        attack:
            "./kai-attack.png"

    }

};


/* =====================================================
   CHARACTER DATA
===================================================== */

const CHARACTERS = [

    {

        id:
            "REN",

        name:
            "レン・クロス",

        type:
            "BALANCE",

        typeJP:
            "バランス型",

        weapon:
            "BLADE",

        weaponJP:
            "ブレード",

        ability:
            "OVERDRIVE",

        abilityJP:
            "オーバードライブ",

        description:
            "攻撃・防御・移動を平均的に扱えるオールラウンダー。",

        quote:
            "守るために、強くなる。それだけだ。",

        asset:
            CHARACTER_ASSETS.REN

    },


    {

        id:
            "KAI",

        name:
            "カイ・ヴェルド",

        type:
            "SPEED",

        typeJP:
            "スピード型",

        weapon:
            "KNIFE",

        weaponJP:
            "ナイフ",

        ability:
            "STEP",

        abilityJP:
            "ステップ",

        description:
            "高い機動力で攻撃と離脱を繰り返す高速型。",

        quote:
            "俺は止まらない。一歩先、そこにだけ勝ちがある。",

        asset:
            CHARACTER_ASSETS.KAI

    }

];


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


/* =====================================================
   SCREEN CHANGE
===================================================== */

function showScreen(
    name
) {

    Object.values(
        screens
    ).forEach(
        screen => {

            if (
                screen
            ) {

                screen.classList.remove(
                    "active"
                );

            }

        }
    );


    if (
        screens[name]
    ) {

        screens[name].classList.add(
            "active"
        );

    }

}


/* =====================================================
   TEXT HELPER
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


/* =====================================================
   MESSAGE
===================================================== */

function setMessage(
    message
) {

    setText(
        "action-message",
        message
    );


    setText(
        "battle-log",
        message
    );

}


/* =====================================================
   CHARACTER IMAGE
===================================================== */

function createCharacterImage(
    character,
    state = "idle"
) {

    const image =
        document.createElement(
            "img"
        );


    image.className =
        "character-visual";


    image.alt =
        character.name;


    image.draggable =
        false;


    image.loading =
        "eager";


    const asset =
        character.asset[state];


    const fallback =
        character.asset.idle;


    image.src =
        asset;


    image.style.width =
        "100%";


    image.style.height =
        "100%";


    image.style.objectFit =
        "contain";


    image.style.objectPosition =
        "center";


    image.style.display =
        "block";


    image.style.pointerEvents =
        "none";


    image.style.userSelect =
        "none";


    image.onerror =
        () => {

            if (
                image.src.endsWith(
                    fallback
                )
            ) {

                image.style.display =
                    "none";

                return;

            }


            image.src =
                fallback;

        };


    return image;

}


/* =====================================================
   CHARACTER SELECT
===================================================== */

function renderCharacterSelect() {

    const list =
        document.getElementById(
            "character-list"
        );


    if (
        !list
    ) {

        return;

    }


    list.innerHTML =
        "";


    CHARACTERS.forEach(
        character => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                `character-card ${character.id.toLowerCase()}`;


            const visual =
                document.createElement(
                    "div"
                );


            visual.className =
                "character-select-visual";


            const image =
                createCharacterImage(
                    character,
                    "idle"
                );


            visual.appendChild(
                image
            );


            const content =
                document.createElement(
                    "div"
                );


            content.className =
                "character-card-content";


            content.innerHTML = `

                <h3 class="character-name">
                    ${character.name}
                </h3>

                <div class="character-type">
                    ${character.typeJP}
                </div>

                <p class="character-description">
                    ${character.description}
                </p>

                <p class="character-description">
                    WEAPON：
                    ${character.weaponJP}
                    <br>
                    ABILITY：
                    ${character.abilityJP}
                </p>

                <button
                    type="button"
                    class="character-select-button"
                >
                    SELECT
                </button>

            `;


            card.appendChild(
                visual
            );


            card.appendChild(
                content
            );


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

        }
    );

}


/* =====================================================
   START BATTLE
===================================================== */

function startBattle(
    characterId
) {

    try {

        game.start(
            characterId
        );

    }
    catch (
        error
    ) {

        console.error(
            error
        );

        setMessage(
            "BATTLE INITIALIZATION ERROR"
        );

        return;

    }


    selectedChipId =
        null;


    battleStarted =
        true;


    lastPlayerPosition =
        null;


    showScreen(
        "battle"
    );


    hideOldControls();


    updateBattleUI(
        true
    );


    setMessage(
        "REALTIME BATTLE // ONLINE"
    );

}


/* =====================================================
   OLD CONTROLS
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


    const realtimeControls =
        document.getElementById(
            "realtime-controls"
        );


    if (
        attackButton
    ) {

        attackButton.style.display =
            "none";

    }


    if (
        endTurnButton
    ) {

        endTurnButton.style.display =
            "none";

    }


    if (
        realtimeControls
    ) {

        realtimeControls.remove();

    }

}


/* =====================================================
   RENDER BATTLE FIELD
===================================================== */

function renderBattleField() {

    const field =
        document.getElementById(
            "battle-field"
        );


    if (
        !field
    ) {

        return;

    }


    if (
        !game.state.player ||
        !game.state.enemy
    ) {

        return;

    }


    field.innerHTML =
        "";


    field.style.touchAction =
        "manipulation";


    const state =
        game.state;


    const selectedCharacter =
        CHARACTERS.find(
            character =>
                character.id ===
                state.player.id
        ) ||
        CHARACTERS[0];


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


            cell.dataset.row =
                row;


            cell.dataset.col =
                col;


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
                state.playerPosition.row ===
                    row &&
                state.playerPosition.col ===
                    col;


            const isEnemyCell =
                state.enemyPosition.row ===
                    row &&
                state.enemyPosition.col ===
                    col;


            /* =========================================
               PLAYER
            ========================================= */

            if (
                isPlayerCell
            ) {

                const player =
                    document.createElement(
                        "div"
                    );


                player.className =
                    "unit player";


                player.dataset.character =
                    selectedCharacter.id;


                player.dataset.state =
                    "idle";


                player.style.background =
                    "transparent";


                player.style.overflow =
                    "hidden";


                player.style.padding =
                    "0";


                player.style.border =
                    "none";


                player.style.boxShadow =
                    "none";


                const image =
                    createCharacterImage(
                        selectedCharacter,
                        "idle"
                    );


                player.appendChild(
                    image
                );


                cell.appendChild(
                    player
                );

            }


            /* =========================================
               ENEMY
            ========================================= */

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


            /* =========================================
               TOUCH
            ========================================= */

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


                    handleBattleCell(
                        row,
                        col,
                        isEnemyCell
                    );

                }
            );


            /* =========================================
               MOUSE
            ========================================= */

            cell.addEventListener(
                "click",
                () => {

                    if (
                        !battleStarted
                    ) {

                        return;

                    }


                    handleBattleCell(
                        row,
                        col,
                        isEnemyCell
                    );

                }
            );


            field.appendChild(
                cell
            );

        }

    }

}


/* =====================================================
   BATTLE CELL ACTION
===================================================== */

function handleBattleCell(
    row,
    col,
    isEnemyCell
) {

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


    const result =
        game.movePlayer(
            row,
            col
        );


    if (
        result &&
        result.success
    ) {

        playCharacterAnimation(
            "move",
            280
        );

    }


    updateBattleUI(
        true
    );

}


/* =====================================================
   CHIP UI
===================================================== */

function renderChips() {

    const container =
        document.getElementById(
            "chip-list"
        );


    if (
        !container
    ) {

        return;

    }


    container.innerHTML =
        "";


    game.getAllChips()
        .forEach(
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
                    event => {

                        event.stopPropagation();


                        if (
                            selectedChipId ===
                            chip.id
                        ) {

                            selectedChipId =
                                null;

                            setMessage(
                                "CHIP SELECTION CLEARED"
                            );

                        }
                        else {

                            selectedChipId =
                                chip.id;

                            setMessage(
                                `${chip.name} SELECTED // TAP CPU`
                            );

                        }


                        renderChips();

                    }
                );


                container.appendChild(
                    button
                );

            }
        );

}


/* =====================================================
   USE CHIP
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
        !result ||
        !result.success
    ) {

        setMessage(
            result?.reason ||
            "CHIP UNAVAILABLE"
        );

        return;

    }


    selectedChipId =
        null;


    if (
        result.hit
    ) {

        playCharacterAnimation(
            "attack",
            420
        );


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


    updateBattleUI(
        true
    );


    checkGameOver();

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
        !result ||
        !result.success
    ) {

        setMessage(
            result?.reason ||
            "ATTACK UNAVAILABLE"
        );

        return;

    }


    playCharacterAnimation(
        "attack",
        420
    );


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


    updateBattleUI(
        true
    );


    checkGameOver();

}


/* =====================================================
   GAME OVER
===================================================== */

function checkGameOver() {

    if (
        !game.state.gameOver
    ) {

        return;

    }


    showResult(
        game.state.winner ===
        "PLAYER"
    );

}


/* =====================================================
   CHARACTER ANIMATION
===================================================== */

function playCharacterAnimation(
    state,
    duration = 350
) {

    const player =
        document.querySelector(
            "#battle-field .unit.player"
        );


    if (
        !player
    ) {

        return;

    }


    const characterId =
        player.dataset.character ||
        "REN";


    const character =
        CHARACTERS.find(
            item =>
                item.id ===
                characterId
        ) ||
        CHARACTERS[0];


    const image =
        player.querySelector(
            ".character-visual"
        );


    if (
        !image
    ) {

        return;

    }


    clearTimeout(
        animationTimer
    );


    image.src =
        character.asset[state] ||
        character.asset.idle;


    player.dataset.state =
        state;


    animationTimer =
        setTimeout(
            () => {

                image.src =
                    character.asset.idle;

                player.dataset.state =
                    "idle";

            },
            duration
        );

}


/* =====================================================
   KEYBOARD / REALTIME INPUT
===================================================== */

input.onDirection(
    direction => {

        if (
            !battleStarted
        ) {

            return;

        }


        const moved =
            game.realtime.movePlayer(
                direction
            );


        if (
            moved
        ) {

            playCharacterAnimation(
                "move",
                280
            );

        }


        updateBattleUI(
            true
        );

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

function updateBattleUI(
    force = false
) {

    const now =
        performance.now();


    if (
        !force &&
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


    setText(
        "turn-number",
        ""
    );


    const currentPosition =
        state.playerPosition
            ? `${state.playerPosition.row}:${state.playerPosition.col}`
            : null;


    if (
        lastPlayerPosition !==
            null &&
        currentPosition !==
            lastPlayerPosition
    ) {

        playCharacterAnimation(
            "move",
            280
        );

    }


    lastPlayerPosition =
        currentPosition;


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
                : "SWEEPER DOWN.";

    }


    showScreen(
        "result"
    );

}


/* =====================================================
   TITLE BUTTONS
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


/* =====================================================
   BACK TO TITLE
===================================================== */

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

            battleStarted =
                false;

            game.realtime.stop();

            showScreen(
                "title"
            );

        }
    );

}


/* =====================================================
   REMATCH
===================================================== */

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

            renderCharacterSelect();

            showScreen(
                "characterSelect"
            );

        }
    );

}


/* =====================================================
   RESULT → TITLE
===================================================== */

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

            battleStarted =
                false;

            game.realtime.stop();

            showScreen(
                "title"
            );

        }
    );

}


/* =====================================================
   REALTIME UI LOOP
===================================================== */

function realtimeLoop() {

    if (
        battleStarted
    ) {

        updateBattleUI();

    }


    requestAnimationFrame(
        realtimeLoop
    );

}


/* =====================================================
   INITIALIZE
===================================================== */

hideOldControls();

renderCharacterSelect();

showScreen(
    "title"
);

realtimeLoop();