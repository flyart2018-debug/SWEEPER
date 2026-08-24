import { Game } from "./core/Game.js";
import { InputManager } from "./realtime/InputManager.js";


/* =====================================================
   SWEEPER
   MAIN CONTROLLER
   SPRITE SHEET EDITION
===================================================== */


/* =====================================================
   CORE
===================================================== */

const game = new Game();
const input = new InputManager();


/* =====================================================
   STATE
===================================================== */

let selectedChipId = null;
let battleStarted = false;
let lastUIUpdate = 0;
let lastPlayerPosition = null;
let animationTimer = null;


/* =====================================================
   SPRITE SETTINGS
===================================================== */

const SPRITE_FRAMES = 4;
const SPRITE_FRAME_TIME = 90;


/* =====================================================
   CHARACTER ASSETS
===================================================== */

const CHARACTER_ASSETS = {

    REN: {

        idle: "./ren-idle.png",
        move: "./ren-move.png",
        attack: "./ren-attack.png"

    },

    KAI: {

        idle: "./kai-idle.png",
        move: "./kai-move.png",
        attack: "./kai-attack.png"

    }

};


/* =====================================================
   CHARACTER DATA
===================================================== */

const CHARACTERS = [

    {

        id: "REN",

        name: "レン・クロス",

        typeJP: "バランス型",

        weaponJP: "ブレード",

        abilityJP: "オーバードライブ",

        description:
            "攻撃・防御・移動を平均的に扱えるオールラウンダー。",

        quote:
            "守るために、強くなる。それだけだ。",

        asset: CHARACTER_ASSETS.REN

    },


    {

        id: "KAI",

        name: "カイ・ヴェルド",

        typeJP: "スピード型",

        weaponJP: "ナイフ",

        abilityJP: "ステップ",

        description:
            "高い機動力で攻撃と離脱を繰り返す高速型。",

        quote:
            "俺は止まらない。一歩先、そこにだけ勝ちがある。",

        asset: CHARACTER_ASSETS.KAI

    }

];


/* =====================================================
   SCREENS
===================================================== */

const screens = {

    title:
        document.getElementById("title-screen"),

    characterSelect:
        document.getElementById(
            "character-select-screen"
        ),

    battle:
        document.getElementById("battle-screen"),

    result:
        document.getElementById("result-screen")

};


/* =====================================================
   SCREEN
===================================================== */

function showScreen(name) {

    Object.values(screens).forEach(
        screen => {

            if (screen) {

                screen.classList.remove(
                    "active"
                );

            }

        }
    );


    if (screens[name]) {

        screens[name].classList.add(
            "active"
        );

    }

}


/* =====================================================
   TEXT
===================================================== */

function setText(id, value) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent = value;

    }

}


/* =====================================================
   MESSAGE
===================================================== */

function setMessage(message) {

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
   SPRITE VISUAL
===================================================== */

function createSprite(
    character,
    state = "idle"
) {

    const sprite =
        document.createElement("div");


    sprite.className =
        "character-visual";


    sprite.dataset.character =
        character.id;


    sprite.dataset.state =
        state;


    sprite.dataset.frame =
        "0";


    sprite.setAttribute(
        "aria-label",
        character.name
    );


    const asset =
        character.asset[state];


    const fallback =
        character.asset.idle;


    sprite.style.width =
        "100%";


    sprite.style.height =
        "100%";


    sprite.style.backgroundImage =
        `url("${asset}")`;


    sprite.style.backgroundRepeat =
        "no-repeat";


    sprite.style.backgroundSize =
        `${SPRITE_FRAMES * 100}% 100%`;


    sprite.style.backgroundPosition =
        "0% 50%";


    sprite.style.backgroundColor =
        "transparent";


    sprite.style.display =
        "block";


    sprite.style.pointerEvents =
        "none";


    sprite.style.userSelect =
        "none";


    sprite.style.webkitUserSelect =
        "none";


    /*
     * 画像が存在しない場合
     * CSS背景は壊れた画像アイコンを出さない。
     * カイ素材追加前でも画面を壊さない。
     */

    const tester =
        new Image();


    tester.onload =
        () => {

            sprite.style.backgroundImage =
                `url("${asset}")`;

        };


    tester.onerror =
        () => {

            if (asset !== fallback) {

                sprite.style.backgroundImage =
                    `url("${fallback}")`;

            }

        };


    tester.src =
        asset;


    return sprite;

}


/* =====================================================
   SPRITE FRAME
===================================================== */

function setSpriteFrame(
    sprite,
    frame
) {

    if (!sprite) {

        return;

    }


    const safeFrame =
        Math.max(
            0,
            Math.min(
                SPRITE_FRAMES - 1,
                frame
            )
        );


    const percent =
        SPRITE_FRAMES === 1
            ? 0
            : safeFrame /
              (SPRITE_FRAMES - 1) *
              100;


    sprite.dataset.frame =
        String(safeFrame);


    sprite.style.backgroundPosition =
        `${percent}% 50%`;

}


/* =====================================================
   SPRITE ANIMATION
===================================================== */

function animateSprite(
    sprite,
    state,
    duration = 360
) {

    if (!sprite) {

        return;

    }


    clearInterval(
        animationTimer
    );


    sprite.dataset.state =
        state;


    const characterId =
        sprite.dataset.character;


    const character =
        CHARACTERS.find(
            item =>
                item.id ===
                characterId
        );


    if (!character) {

        return;

    }


    const asset =
        character.asset[state] ||
        character.asset.idle;


    sprite.style.backgroundImage =
        `url("${asset}")`;


    let frame = 0;


    setSpriteFrame(
        sprite,
        frame
    );


    animationTimer =
        setInterval(
            () => {

                frame++;

                if (
                    frame >=
                    SPRITE_FRAMES
                ) {

                    frame = 0;

                }


                setSpriteFrame(
                    sprite,
                    frame
                );

            },
            SPRITE_FRAME_TIME
        );


    setTimeout(
        () => {

            clearInterval(
                animationTimer
            );


            const idle =
                character.asset.idle;


            sprite.dataset.state =
                "idle";


            sprite.style.backgroundImage =
                `url("${idle}")`;


            setSpriteFrame(
                sprite,
                0
            );

        },
        duration
    );

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


    list.innerHTML =
        "";


    CHARACTERS.forEach(
        character => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                `character-card ${
                    character.id.toLowerCase()
                }`;


            /* -----------------------------------------
               VISUAL
            ----------------------------------------- */

            const visual =
                document.createElement(
                    "div"
                );


            visual.className =
                "character-select-visual";


            visual.style.width =
                "100%";


            visual.style.height =
                "180px";


            visual.style.display =
                "flex";


            visual.style.alignItems =
                "center";


            visual.style.justifyContent =
                "center";


            visual.style.overflow =
                "hidden";


            const sprite =
                createSprite(
                    character,
                    "idle"
                );


            sprite.style.width =
                "70%";


            sprite.style.height =
                "100%";


            visual.appendChild(
                sprite
            );


            /* -----------------------------------------
               CONTENT
            ----------------------------------------- */

            const content =
                document.createElement(
                    "div"
                );


            content.className =
                "character-card-content";


            const name =
                document.createElement(
                    "h3"
                );


            name.className =
                "character-name";


            name.textContent =
                character.name;


            const type =
                document.createElement(
                    "div"
                );


            type.className =
                "character-type";


            type.textContent =
                character.typeJP;


            const description =
                document.createElement(
                    "p"
                );


            description.className =
                "character-description";


            description.textContent =
                character.description;


            const details =
                document.createElement(
                    "p"
                );


            details.className =
                "character-description";


            details.innerHTML =
                `
                    WEAPON：${character.weaponJP}
                    <br>
                    ABILITY：${character.abilityJP}
                `;


            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "character-select-button";


            button.textContent =
                "SELECT";


            content.appendChild(
                name
            );


            content.appendChild(
                type
            );


            content.appendChild(
                description
            );


            content.appendChild(
                details
            );


            content.appendChild(
                button
            );


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


            /*
             * キャラ選択画面でも
             * 待機アニメーション
             */

            let frame = 0;


            setInterval(
                () => {

                    const current =
                        visual.querySelector(
                            ".character-visual"
                        );


                    if (!current) {

                        return;

                    }


                    frame++;

                    if (
                        frame >=
                        SPRITE_FRAMES
                    ) {

                        frame = 0;

                    }


                    setSpriteFrame(
                        current,
                        frame
                    );

                },
                SPRITE_FRAME_TIME
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
    catch (error) {

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
   OLD UI
===================================================== */

function hideOldControls() {

    const attack =
        document.getElementById(
            "attack-button"
        );


    const endTurn =
        document.getElementById(
            "end-turn-button"
        );


    const realtime =
        document.getElementById(
            "realtime-controls"
        );


    if (attack) {

        attack.style.display =
            "none";

    }


    if (endTurn) {

        endTurn.style.display =
            "none";

    }


    if (realtime) {

        realtime.remove();

    }

}


/* =====================================================
   BATTLE FIELD
===================================================== */

function renderBattleField() {

    const field =
        document.getElementById(
            "battle-field"
        );


    if (!field) {

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


    const state =
        game.state;


    const character =
        CHARACTERS.find(
            item =>
                item.id ===
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


            cell.dataset.row =
                row;


            cell.dataset.col =
                col;


            cell.style.touchAction =
                "manipulation";


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


            const isPlayer =
                state.playerPosition &&
                state.playerPosition.row ===
                    row &&
                state.playerPosition.col ===
                    col;


            const isEnemy =
                state.enemyPosition &&
                state.enemyPosition.row ===
                    row &&
                state.enemyPosition.col ===
                    col;


            /* -----------------------------------------
               PLAYER
            ----------------------------------------- */

            if (isPlayer) {

                const unit =
                    document.createElement(
                        "div"
                    );


                unit.className =
                    "unit player";


                unit.dataset.character =
                    character.id;


                unit.style.background =
                    "transparent";


                unit.style.border =
                    "none";


                unit.style.boxShadow =
                    "none";


                unit.style.padding =
                    "0";


                unit.style.overflow =
                    "hidden";


                const sprite =
                    createSprite(
                        character,
                        "idle"
                    );


                sprite.style.width =
                    "100%";


                sprite.style.height =
                    "100%";


                unit.appendChild(
                    sprite
                );


                cell.appendChild(
                    unit
                );

            }


            /* -----------------------------------------
               ENEMY
            ----------------------------------------- */

            if (isEnemy) {

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


            /* -----------------------------------------
               CELL INPUT
            ----------------------------------------- */

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
                        isEnemy
                    );

                }
            );


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
                        isEnemy
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
   CELL ACTION
===================================================== */

function handleBattleCell(
    row,
    col,
    isEnemy
) {

    if (isEnemy) {

        if (selectedChipId) {

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
            300
        );

    }


    updateBattleUI(
        true
    );

}


/* =====================================================
   BATTLE ANIMATION
===================================================== */

function playCharacterAnimation(
    state,
    duration
) {

    const sprite =
        document.querySelector(
            "#battle-field .unit.player .character-visual"
        );


    if (!sprite) {

        return;

    }


    animateSprite(
        sprite,
        state,
        duration
    );

}


/* =====================================================
   CHIPS
===================================================== */

function renderChips() {

    const container =
        document.getElementById(
            "chip-list"
        );


    if (!container) {

        return;

    }


    container.innerHTML =
        "";


    const chips =
        game.getAllChips();


    if (!Array.isArray(chips)) {

        return;

    }


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

    if (!battleStarted) {

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


    if (result.hit) {

        playCharacterAnimation(
            "attack",
            450
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
            "CHIP USED"
        );

    }


    updateBattleUI(
        true
    );


    checkGameOver();

}


/* =====================================================
   ATTACK
===================================================== */

function attack() {

    if (!battleStarted) {

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
        450
    );


    if (result.hit) {

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
            50
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
        player.shortName ||
        player.name ||
        "REN"
    );


    setText(
        "enemy-name",
        enemy.shortName ||
        enemy.name ||
        "CPU"
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


    /*
     * TURN表示はリアルタイム版では非表示
     */

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
            300
        );

    }


    lastPlayerPosition =
        currentPosition;


    renderBattleField();


    renderChips();


    checkGameOver();

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


    if (title) {

        title.textContent =
            playerWon
                ? "VICTORY"
                : "DEFEAT";

    }


    if (message) {

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
   INPUT
===================================================== */

input.onDirection(
    direction => {

        if (!battleStarted) {

            return;

        }


        const moved =
            game.realtime.movePlayer(
                direction
            );


        if (moved) {

            playCharacterAnimation(
                "move",
                300
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
   TITLE
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


/* =====================================================
   BACK
===================================================== */

const backButton =
    document.getElementById(
        "back-to-title-button"
    );


if (backButton) {

    backButton.addEventListener(
        "click",
        () => {

            battleStarted =
                false;


            if (
                game.realtime &&
                game.realtime.stop
            ) {

                game.realtime.stop();

            }


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


if (restartButton) {

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


if (resultTitleButton) {

    resultTitleButton.addEventListener(
        "click",
        () => {

            battleStarted =
                false;


            if (
                game.realtime &&
                game.realtime.stop
            ) {

                game.realtime.stop();

            }


            showScreen(
                "title"
            );

        }
    );

}


/* =====================================================
   REALTIME LOOP
===================================================== */

function realtimeLoop() {

    if (battleStarted) {

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