class End extends Phaser.Scene {
    constructor() {
        super("end");

        // Initialize a class variable "my" which is an object.
        // The object has one property, "sprite" which is also an object.
        // This will be used to hold bindings (pointers) to created sprites.
        this.my = {sprite: {}};

        // Create a property inside "sprite" named "bullet".
        // The bullet property has a value which is an array.
        // This array will hold bindings (pointers) to bullet sprites
        this.my.sprite.bullet = [];   
        this.maxBullets = 10;           // Don't create more than this many bullets
        
    }
    init(data) {
        this.score = data.score || 0; // Retrieve the score from data, defaulting to 0 if not provided
    }

    preload() {
 
    }

    create() {
        let my = this.my;

        // Notice that in this approach, we don't create any bullet sprites in create(),
        // and instead wait until we need them, based on the number of space bar presses

        // Create key objects
        this.playScene = this.input.keyboard.addKey("P");
        this.titleScene = this.input.keyboard.addKey("T");
        this.creditsScene = this.input.keyboard.addKey("C");

        // Set movement speeds (in pixels/tick)

        this.thanksText = this.add.text(250, 200, 'Thank you for playing!', { fontFamily: 'Arial', fontSize: 65, color: '#ffffff' });

        // Create score bar
        this.scoreText = this.add.text(400, 350, 'Score: ' + this.score, { fontFamily: 'Arial', fontSize: 50});

        // score result texts
        if (this.score < 10) {
            this.shootText = this.add.text(500, 450, 'Better luck next time', { fontFamily: 'Arial', fontSize: 50});
        }
        else {
            this.yayText = this.add.text(500, 450, 'Yay you did it :D', { fontFamily: 'Arial', fontSize: 50});
        }

        this.playText = this.add.text(650, 550, 'Press P to play again', { fontFamily: 'Arial', fontSize: 40});
        this.titleText = this.add.text(650, 625, 'Press C to go back to credits', { fontFamily: 'Arial', fontSize: 40});
        this.titleText = this.add.text(650, 700, 'Press T to go back to title', { fontFamily: 'Arial', fontSize: 40});

        // update HTML description
        document.getElementById('description').innerHTML = '<h2>End.js</h2><br>'

    }

    update() {
        let my = this.my;

        // for testing purposes
        if (Phaser.Input.Keyboard.JustDown(this.playScene)) {
            this.scene.start("loadScene");
        }
        if (Phaser.Input.Keyboard.JustDown(this.titleScene)) {
            this.scene.start("start");
        }
        if (Phaser.Input.Keyboard.JustDown(this.creditsScene)) {
            this.scene.start("credits");
        }

    }

}