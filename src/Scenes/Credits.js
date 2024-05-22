class Credits extends Phaser.Scene {
    constructor() {
        super("credits");

        // Initialize a class variable "my" which is an object.
        // The object has one property, "sprite" which is also an object.
        // This will be used to hold bindings (pointers) to created sprites.
        this.my = {sprite: {}};
        
    }

    preload() {

    }

    create() {
        let my = this.my;

        // Create key objects
        this.nextScene = this.input.keyboard.addKey("B");

        // controls
        // A: left // D: right // Space: fire/emit // R: Reset Scene // S: Next Scene
        // credits
        this.creditText = this.add.text(100, 150, 'Credits:', { fontFamily: 'Arial', fontSize: 25, color: '#ffffff' });
        this.credit1Text = this.add.text(100, 200, 'kenney_pixel-platformer for assets.', { fontFamily: 'Arial', fontSize: 25, color: '#ffffff' });
        this.credit2Text = this.add.text(100, 250, ' kenny_impact-sounds for sound.', { fontFamily: 'Arial', fontSize: 25, color: '#ffffff' });
        this.credit3Text = this.add.text(100, 300, 'PlatformImprovement-master file by Jim Whitehead as reference for my code ', { fontFamily: 'Arial', fontSize: 25, color: '#ffffff' });

        this.nextText = this.add.text(320, 600, 'Press B to go back', { fontFamily: 'Arial', fontSize: 35});

        // update HTML description
        document.getElementById('description').innerHTML = '<h2>Credits.js</h2><br>'

    }

    update() {
        let my = this.my;

        if (Phaser.Input.Keyboard.JustDown(this.nextScene)) {
            this.scene.start("end", {score: this.score});
        }

    }

}

// kenney_pixel-platformer