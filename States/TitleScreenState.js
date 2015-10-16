export class TitleScreenState extends Phaser.State {
        game: Phaser.Game;
        constructor() {
            super();
        }
        titleScreenImage: Phaser.Sprite;

        preload() {
            this.load.image("title", "/Graphics/bg.jpg");
        }
        create() {
            this.titleScreenImage = this.add.sprite(0, 0, "title");
            this.input.onTap.addOnce(this.titleClicked,this); // <-- that um, this is extremely important
        }
        titleClicked (){
            this.game.state.start("GameRunningState");
        }
    }
