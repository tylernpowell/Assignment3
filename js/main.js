window.onload = function(){
    
var game = new Phaser.Game(1024, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.tilemap('level1', 'assets/level2.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles-1', 'assets/tiles-1.png');
    game.load.spritesheet('character', 'assets/character.png', 60, 88);
    game.load.spritesheet('doge', 'assets/doge.png', 81, 71);
    game.load.image('wallofflesh', 'assets/wallofflesh.png');
    game.load.image('grave', 'assets/grave.png');
    game.load.image('heart', 'assets/HeartContainer.png');
    game.load.audio('kill', 'assets/death.mp3');
    game.load.audio('music', 'assets/wallofflesh.mp3');
    game.load.audio('victory', 'assets/victory.mp3');

}

var map;
var tileset;
var layer;
var player;
var facing = 'left';
var cursors;
var jumpButton;
var invulnTimer = 0;
var playerMaxHealth = 1;
var playerHealth = 1;
var hearts = [];
var grave;
var doges = [];
var dogesFacing = [];
var numberOfDoges = 0;
var playerJumpVelocity = -325;
var playerSpeed = 150;
var killSound;
var music;
var elapsedTime = 0;
var wallOfFlesh;
var wallOfFlesh2;
var victorySound;
var won;

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#000000';                                     //Background color

    //bg = game.add.tileSprite(0, 0, 800, 600, 'background');                     //Creates background
    //bg.fixedToCamera = true;                                                    //Fixes background to camera

    map = game.add.tilemap('level1');                                           //Creates tilemap

    map.addTilesetImage('tiles-1');                                             //Tile spritesheet

    map.setCollisionByExclusion([ 51 ]);    //Data on tile collisions

    layer = map.createLayer('Tile Layer 1');

    //  Un-comment this on to see the collision tiles
     //layer.debug = true;

    layer.resizeWorld();

    game.physics.arcade.gravity.y = 250;                                        //Sets gravity
    player = game.add.sprite(128, 1000, 'character');                                   //Adds spritesheet to player and places it at position (32, 32)
    grave = game.add.sprite(-100, -100, 'grave');
    wallOfFlesh = game.add.sprite(-500, 1128, 'wallofflesh');
    wallOfFlesh2 = game.add.sprite(-500, 720, 'wallofflesh');

    game.physics.enable(player, Phaser.Physics.ARCADE);                         //Adds physics to player
    game.physics.enable(wallOfFlesh, Phaser.Physics.ARCADE);
    game.physics.enable(wallOfFlesh2, Phaser.Physics.ARCADE);

    player.body.bounce.y = 0.0;                                                 //Adds bounce to player
    player.body.collideWorldBounds = false;                                      //Makes player collide with world bounds
    player.body.setSize(39, 77, 5, 16);                                         //Sets side of player collision

    player.animations.add('left', [18, 17, 16, 15, 14, 13, 12, 11, 10], 10, true);                      //Adds animation to player "Left"
    player.animations.add('turn', [0, 19], 20, true);                               //Adds animation to player "Turn"
    player.animations.add('right', [1, 2, 3, 4, 5, 6, 7, 8, 9], 10, true);                     //Adds animation to player "Right"
    
    game.camera.follow(player); 
    cursors = game.input.keyboard.createCursorKeys();                           //Creates cursors
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);          //Creates jump button
    
    killSound = game.add.audio('kill');
    victorySound = game.add.audio('victory');
    music = game.add.audio('music', 0.05, true);
    killSound.allowMultiple = true;
    music.play();
    won = false;
}

function update() 
{
    wallUpdate();
    playerUpdate();
}

function wallUpdate()
{
    wallOfFlesh.body.velocity.x = 130;
    wallOfFlesh.body.mass = 0;
    wallOfFlesh.y = 1128;
    wallOfFlesh2.body.velocity.x = 130;
    wallOfFlesh2.body.mass = 0;
    wallOfFlesh2.y = 720;
    if(wallOfFlesh.y > 721)
        {
            wallOfFlesh.body.velocity.y = -1;
            wallOfFlesh2.body.velocity.y = -1;
        }
}
function playerUpdate()
{
    player.body.velocity.x = 0;
    if(playerHealth == 0)
        {
            return;
        }
    if(player.x >= 31890 && !won)
        {
            victory();
            won = true;
        }
    game.physics.arcade.overlap(player, wallOfFlesh, killPlayer);
    game.physics.arcade.collide(player, layer);                                 //Collides player with layer
    if(player.y >= 1600)
        {
            killPlayer();
        }
    elapsedTime += game.time.elapsed;
    if (cursors.left.isDown)                                                    //Moves player left
    {
        player.body.velocity.x = -playerSpeed;

        if (facing != 'left')
        {
            player.animations.play('left');
            facing = 'left';
        }
    }
    else if (cursors.right.isDown)                                              //Moves player right
    {
        player.body.velocity.x = playerSpeed;

        if (facing != 'right')
        {
            player.animations.play('right');
            facing = 'right';
        }
    }
    else                                                                        //Sets player to idle
    {
        if (facing != 'idle')
        {
            player.animations.stop();

            if (facing == 'left')
            {
                player.frame = 19;
            }
            else
            {
                player.frame = 0;
            }

            facing = 'idle';
        }
    }
    
    if (jumpButton.isDown && player.body.onFloor())//Makes player jump
    {
        player.body.velocity.y = playerJumpVelocity;
    }
    
    if(player.body.onFloor())
        {
            canMove = true;
        }
}

function killPlayer()
{
    grave.x = player.x;
    grave.y = player.y + 55;
    playerHealth--;
    killSound.play();
    player.kill();
}
    
function victory()
    {
        wallOfFlesh.kill();
        wallOfFlesh2.kill();
        music.stop();
        victorySound.play();
    }

function render () 
{
    if(playerHealth == 0)
        {
            game.debug.text('GAME OVER', 512, 300);
        }
    if(won)
        {
            game.debug.text('YOU WIN!', 512, 300);
        }
}
};
