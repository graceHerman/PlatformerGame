class Start extends Phaser.Scene {
    constructor() {
        super("start");

        // Initialize a class variable "my" which is an object.
        // The object has one property, "sprite" which is also an object.
        // This will be used to hold bindings (pointers) to created sprites.
        this.my = {sprite: {}};

        this.score = 0;
        
    }

    preload() {
        this.load.setPath("./assets/");

    }

    create() {
        let my = this.my;

        // Notice that in this approach, we don't create any bullet sprites in create(),
        // and instead wait until we need them, based on the number of space bar presses

        // Create key objects for both Enter and Return keys
        this.enterKey = this.input.keyboard.addKey("P");

        this.titleText = this.add.text(200, 250, 'Mad Dash', { fontFamily: 'Arial', fontSize: 80, color: '#ffffff' });
        this.titleText = this.add.text(300, 350, 'Try to collect everything!', { fontFamily: 'Arial', fontSize: 65, color: '#ffffff' });

        // Create score bar
        this.playText = this.add.text(300, 500, 'Press P to play', { fontFamily: 'Arial', fontSize: 50});

        // update HTML description
        document.getElementById('description').innerHTML = '<h2>Start.js</h2><br>'

    }

    update() {
        let my = this.my;

        if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
            this.scene.start("loadScene", { score: this.score });
        }

    }
}