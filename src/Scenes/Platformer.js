class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");

        this.score = 0;
    }

    init() {
        /* 
        Acceleration: 8
        Max Speed: 8
        Deceleration: 10
        Jump Height: 4.5
        Down Gravity: 3
        Duration: 5
        */
        // variables and settings 
        this.ACCELERATION = 300;
        this.DRAG = 120;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 1300;
        this.JUMP_VELOCITY = -550;
        this.PARTICLE_VELOCITY = 50;
        this.SCALE = 2.0;
    }

    preload() {
        this.load.setPath("./assets/");
        // sound effects
        this.load.audio("ding", "impactMetal_light_000.ogg");
        this.load.audio("bling", "impactMining_001.ogg");
    }

    create() {
        // Create a new tilemap game object which uses 18x18 pixel tiles, and is
        // 140 tiles wide and 25 tiles tall.
        this.map = this.add.tilemap("Ground-platform1", 18, 18, 140, 25);

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset = this.map.addTilesetImage("kenny_tilemap_packed", "tilemap_tiles");

        // Create a layer
        this.groundLayer = this.map.createLayer("platform-level1", this.tileset, 0, 0);

        // Make it collidable
        this.groundLayer.setCollisionByProperty({
            collides: true
        });

        // TODO: Add createFromObjects here
        // Find coins in the "Objects" layer in Phaser
        // Look for them by finding objects with the name "coin"
        // Assign the coin texture from the tilemap_sheet sprite sheet
        // Phaser docs:
        // https://newdocs.phaser.io/docs/3.80.0/focus/Phaser.Tilemaps.Tilemap-createFromObjects

        this.coins = this.map.createFromObjects("Objects", {
            name: "coin",
            key: "tilemap_sheet",
            frame: 151
        });
        this.gems = this.map.createFromObjects("Gems", {
            name: "gem",
            key: "tilemap_sheet",
            frame: 67
        }); 
        this.key = this.map.createFromObjects("Key", {
            name: "key",
            key: "tilemap_sheet",
            frame: 27
        });
        this.door = this.map.createFromObjects("Door", {
            name: "door",
            key: "tilemap_sheet",
            frame: 28
        });    

        // TODO: Add turn into Arcade Physics here
        // Since createFromObjects returns an array of regular Sprites, we need to convert 
        // them into Arcade Physics sprites (STATIC_BODY, so they don't move) 
        this.physics.world.enable(this.coins, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.gems, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.key, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.door, Phaser.Physics.Arcade.STATIC_BODY);

        // Create a Phaser group out of the array this.coins
        // This will be used for collision detection below.
        this.coinGroup = this.add.group(this.coins);
        this.gemGroup = this.add.group(this.gems);
        this.keyGroup = this.add.group(this.key);
        this.doorGroup = this.add.group(this.door);
        this.door.forEach(function(door) {
            door.visible = false;
        }, this);

        // set up player avatar
        my.sprite.player = this.physics.add.sprite(100, 320, "platformer_characters", "tile_0000.png");
        my.sprite.player.setCollideWorldBounds(true);

        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);

        // TODO: Add coin collision handler
        // Handle collision detection with coins
        this.physics.add.overlap(my.sprite.player, this.coinGroup, (obj1, obj2) => {
            this.score += 1;
            this.scoreText.setText('Score: ' + this.score);
            this.updateScoreBar();
            this.sound.play("ding", {volume: 1});
            obj2.destroy(); // remove coin on overlap
        });
        // gems
        this.physics.add.overlap(my.sprite.player, this.gemGroup, (obj1, obj2) => {
            this.score += 2;
            this.scoreText.setText('Score: ' + this.score);
            this.updateScoreBar();
            this.sound.play("bling", {volume: 1});
            obj2.destroy(); // remove coin on overlap
        });
        // key
        let gotKey = false;
        this.physics.add.overlap(my.sprite.player, this.keyGroup, (obj1, obj2) => {
            gotKey = true;
            this.sound.play("ding", {volume: 1});
            this.door.forEach(function(door) {
                door.visible = true;
            }, this);
            obj2.destroy(); // remove coin on overlap
        });

        // unlock door
        this.physics.add.overlap(my.sprite.player, this.doorGroup, (obj3, obj4) => {
            if (gotKey) {
                obj4.destroy(); // remove coin on overlap
                this.scene.start("end", {score: this.score});
            }
        });

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        this.rKey = this.input.keyboard.addKey('R');

        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);

        // TODO: Add movement vfx here
        // movement vfx

        my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
            frame: ['smoke_06.png', 'smoke_07.png'],
            // TODO: Try: add random: true
            scale: {start: 0.03, end: 0.1},
            // TODO: Try: maxAliveParticles: 8,
            lifespan: 350,
            // TODO: Try: gravityY: -400,
            alpha: {start: 1, end: 0.1}, 
        });

        my.vfx.walking.stop();

        // TODO: add camera code here
        //this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        // Calculate map dimensions in pixels
        const mapWidth = 2520; // 2520
        const mapHeight = 450;  // 450

        // Set world bounds
        this.physics.world.setBounds(0, 0, mapWidth, mapHeight);

        // TODO: add camera code here
        this.cameras.main.setBounds(0, 0, mapWidth, mapHeight); // 2000 to see the end of map
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(this.SCALE);

        // Add score text and score bar
        this.scoreText = this.add.text(20, 20, 'Score: ' + this.score, { fontFamily: 'Arial', fontSize: 18 });
        this.scoreText.setDepth(1);

        this.scoreBar = this.add.rectangle(20, 50, 200, 20).setOrigin(0);
        this.scoreText.setDepth(1);

    }

    update() {

        /*// Update score text and score bar position with camera
        this.scoreText.x = my.sprite.player.x + 450;
        this.scoreText.y = my.sprite.player.y - 275;

        this.scoreBar.x = my.sprite.player.body.position.x;
        this.scoreBar.y = my.sprite.player.body.position.y;*/
        // Update score text and score bar position with camera scroll position
        this.scoreText.x = this.cameras.main.scrollX + 1440 - this.scoreText.width - 20;
        this.scoreText.y = this.cameras.main.scrollY + 20;

        this.scoreBar.x = this.cameras.main.scrollX + 1440 - this.scoreBar.width - 20;
        this.scoreBar.y = this.cameras.main.scrollY + 50;

        // player movement
        if(cursors.left.isDown) {
            my.sprite.player.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);
            //this.sound.play("steps", {volume: 0.5});
            // TODO: add particle following code here
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);

            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

            // Only play smoke effect if touching the ground

            if (my.sprite.player.body.blocked.down) {

                my.vfx.walking.start();

            }

        } else if(cursors.right.isDown) {
            my.sprite.player.setAccelerationX(this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);
            //this.sound.play("steps", {volume: 0.5});
            // TODO: add particle following code here
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);

            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

            // Only play smoke effect if touching the ground

            if (my.sprite.player.body.blocked.down) {

                my.vfx.walking.start();

            }

        } else {
            // Set acceleration to 0 and have DRAG take over
            my.sprite.player.setAccelerationX(0);
            my.sprite.player.setDragX(this.DRAG);
            my.sprite.player.anims.play('idle');
            // TODO: have the vfx stop playing

            my.vfx.walking.stop();
        }

        // player jump
        if (Phaser.Input.Keyboard.JustDown(cursors.up)) {
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
        }

        if((Phaser.Input.Keyboard.JustDown(this.rKey)) || (my.sprite.player.y >= 425)) {
            this.score = 0;
            this.scene.restart();
        }

    }

    // Function to update the score bar
    updateScoreBar() {
        this.scoreBar.displayWidth = (this.score / this.maxScore) * 200;
    }
}