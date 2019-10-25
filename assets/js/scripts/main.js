import classes_loaded, { GameStage, Snake } from './game/classes.js';
import input_loaded, { KeyMappings } from './controllers/input.js';

//----------------------------- GLOBAL CONSTANTS / FUNCTIONS
const INITIAL_HEIGHT = 300, INITIAL_WIDTH = 300;
const filesLoaded = () => classes_loaded && input_loaded;


/*
 * Because of the scope imposed by modules we have to explicitly 
 * expose parts of it to the window object
 */
window.startGame = function () {
    MainLoop.start();
}

window.stopGame = function () {
    MainLoop.stop();
}

window.toggleSettings = function (btn) {
    let settings = document.getElementById("settings");
    if (settings.style.display === "block") {
        settings.style.display = "none";
        btn.childNodes[0].nodeValue = "Show settings";

    }
    else {
        settings.style.display = "block";
        btn.childNodes[0].nodeValue = "Hide settings";
    }
}

/*
 * When the DOM has been created and it is safe to interact
 * with, programatically create a canvas element and add it as 
 * a child of the div "gameStage"
 */

document.onreadystatechange = function () {
    if (document.readyState === "complete") {
        if (filesLoaded) {

            const gameStage = new GameStage(INITIAL_WIDTH, INITIAL_HEIGHT);

            const snake = new Snake(200, 200, gameStage.context);

            const keys = new KeyMappings();

            let dir = snake.direction;

            /**
             * The frame rate that the gameloop mimics. Basically this controls 
             * how fast the snake moves
             */

            MainLoop.setSimulationTimestep(90);

            window.updateSnakeColour = function (colour) {
                snake.colour = colour;
            }

            // ----------  EVENT LISTENERS FOR THE SETTINGS / TO CAPTURE INPUT
            window.addEventListener("keydown", function (key) {
                if (keys.getDirection(key.keyCode)) {
                    dir = (keys.getDirection(key.keyCode));
                }
            });


            // --------- MAIN LOOP FUNCTIONS

            //Run at beginning of frame. Process input.
            MainLoop.setBegin(function () {

            });

            //Physics / AI movements, etc
            MainLoop.setUpdate(function (delta) {
                snake.move(dir);
            });

            //Draw canvas elements
            MainLoop.setDraw(function () {
                gameStage.clear();
                snake.draw();
            });
        }
        else {
            console.log("Error loading files");
        }
    }
}