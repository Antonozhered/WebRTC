# WebRTC

## Start of the project

### First Idea
My first thought is to make it a chatroom app. I really like the idea of .io games like slither.io agar.io paper.io and others, also omegle and among us quickly come to mind as inpiration.

### Second Idea
After the consult last week, I realized it would be too difficult to realize a multiplayer game. I decided to still think in the direction of old games I liked. Then it hit me: phone controlled version of the clasic alien invaders.

### Project setup


## Week 2 02.03-09.03
### Goals
1. Design the look of the website (check)
2. set up the connection between the sender and receiver file (check)
3. set up the qr code connection with the phone
4. write game logic and mechanics
5. render game interface
6. make the phone controller move the spaceship
7. finish the MVP version of the game

I have to rewrite the goals, because I realized it's too ambicious for to now.
1. design the look (complete)
2. set up an https server (complete)
3. design basic example game logic (complete)
4. set up connection between sender and receiver via socket.io (complete)
5. set up connection between the phone and the desktop via socket.io (complete)
6. set up qr code (complete)
7. set up the webrtc data channel through simple peer 

### Design 
First I made a player greeting screen with a space background using a figma noise texture plug in. It has an option to name the spaceship and a QR code to establish connection.
![Greeting Screen Design Version 1](../greeting_screen_v1.png/)

Then I used some adobe stock svgs for invading aliens and spaceship, edited to fit the project, and palced them on the second gameplay screen. 
![Gameplay Screen Design Version 1](../gameplay_screen_v1.png)

I made a controller screen for the phone as well with 3 UI elements: move left button, move right button, shoot button.
![Controller Screen Design Version 1](../controller_screen_v1.png)

### Problems I ran into

1. I forgot I needed to put the name of the file to open it on localhost if it's not index.html. I got help on consult and was able to solve it after I was reminded.

2. My controller design needs adjustments: when the user will use it to control the spaceship, it needs to be intuitive and they should be able to do it without looking.

3. I want to establish p2p local server, and i need https certificate to do it, but the code provided in the example doesn't work, gives me this error:

At line:3 char:53
+   -subj '/CN=localhost' 
-extensions EXT -config <( \
+
                   ~
Missing closing ')' in expression.  
At line:3 char:49
+   -subj '/CN=localhost'
-extensions EXT -config <( \        
+
               ~
The '<' operator is reserved for    
future use.
At line:4 char:156
+ ... S:localhost\nkeyUsage=digital 
Signature\nextendedKeyUsage=serverA 
uth")
+

    ~
Unexpected token ')' in expression  
or statement.
    + CategoryInfo          : Pars  
   erError: (:) [], ParentContain   
  sErrorRecordException
    + FullyQualifiedErrorId : Miss  
   ingEndParenthesisInExpression

I figured it was because I used powershell on windows, but mac os uses git bash, so I opened git bash and ran the code there. I got this error instead:

So I decided to ask chat gpt. It told me to create a config file manually because windows syntax doesn't execute the OpenSSL certificate command like it does on linux.
4. Ran into an error when I was setting up https server in the actual working file. The secuirity of chrome did not allow express to connect to my app. I used this line:
app.use(express.static('public/receiver.html'));
And ai fixed it into this line:
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline'; connect-src 'self' ws: wss:; media-src 'self'");
  next();
});

app.use(express.static('public'));
more about what I learned it means in the AI overview

5. When AI wrote code it missed the rebroadcast emit using socket io to all users except sender. I fixed that in index.js. I added the socket.on player move and player shoot events so it emits everything.
6. when I was setting up a qr code I got a Content Secuirity Error:

receiver.html:1 Loading the script 'https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js' violates the following Content Security Policy directive: "script-src 'self' 'unsafe-inline'". Note that 'script-src-elem' was not explicitly set, so 'script-src' is used as a fallback. The action has been blocked.

So I asked ai for a fix. This is what happened: I put the qrcode.min.js into a public folder and copy the script so the


## Week 3 09.03-16.03
### Goals
After setting up the webrtc data channel I want to: 
1. Finish the set up
2. make a continuous evnent journey: 
intro screen -> game start screen -> gameplay -> game end -> score / new game 
### Problems I ran into
1. I tried to follow instructions to set up the webrtc data channel, I added a few peices of code from the github file, but my website stopped loading correctly.

## Week 4 16.03-22.03
### Goals
1. Finish gameplay logic
-render aliens
-player shooting mechanics
-alien shooting mechanics
-kill alien mechanics
-kill player mechanics
-respawn wave mechanics
-score + play again
2. Add gyroscope control 
3. Add finishing touches and submit


4. While I was working I relized I want to add a shield functin. Used ai for this as well.
5. I added a camera at the end screen to practice different webrtc channels
## Use of AI
 
### 1 use 
I used chatGPT to plan stracture of the project, plan initial steps, checkboxes and milestones to compelete.

*after first consult this wasn't needed.
### 2 use
I need to solve the problem of a server certificate on windows. I will use chat gpt to adress this issue for my case. I will paste the program and the error messages then ask for possible solutions and try them one by one relaying the result to the chat.

### 3 use 
Used ai to make the basic alien invader logic. Spaceship and contorller JS code. minor improvements on my other code.

### 4 use
Midway through implementing web rtc:

Issues preventing WebRTC from working:

Receiver doesn't initialize the peer

Listens for signal events but calls peer.signal() on an undefined peer
The answerPeerOffer() function is defined but never called
Sender never initiates the peer

The callPeer() function exists but is never called anywhere
References an undefined myStream variable
Server doesn't relay WebRTC signals

No signal event handler in your server, so even if they tried to emit signals, they wouldn't reach the other peer
Current flow: Only playerMove and playerShoot are sent via Socket.io directly.

To actually use WebRTC for peer-to-peer communication, you need:

Sender initiates peer with initiator: true and generates an offer
Server relays the signal between sender and receiver
Receiver receives the offer and creates a peer with initiator: false to answer
Complete the SDP handshake

### use 5
game logic
I described how I want the game to look, and asked to design the logic in simple steps.

1. shoot mechanics. 2. alien attack mechanics. 3. spaceship death mechanics. 4. kill alien mechanics. 5. approaching aliens (move left to right, then down, then right to left, then down, repeat). 6. If alien touches spaceship death mehcanic. 7. If all aliens die - respawn. 8. end screen + score + play again.

It gave me development concepts and code snippets:
Core structure

Use these game state variables:

let spaceship = {
  x: 375,
  y: 540,
  width: 50,
  height: 30,
  alive: true,
  cooldown: 0
};

let aliens = [];
let playerBullets = [];
let alienBullets = [];

let score = 0;
let wave = 1;
let gameOver = false;

That gives you one place for all logic.

1. Shoot mechanics
Idea

When player presses shoot:

create a bullet object
push it into playerBullets
move bullets upward every frame
remove bullets when off screen
Data shape
{
  x: spaceship.x + 22,
  y: spaceship.y,
  width: 6,
  height: 14,
  speed: 8,
  active: true
}
Functions
shootPlayerBullet()
updatePlayerBullets()
renderPlayerBullets()
Important

Add a cooldown so holding shoot does not spam 100 bullets.

Example:

if (spaceship.cooldown <= 0) {
  shootPlayerBullet();
  spaceship.cooldown = 15;
}

Then reduce cooldown every frame.

2. Alien attack mechanics
Idea

Aliens should randomly shoot downward.

Do not let every alien shoot.
Only allow bottom-most alive alien in each column to shoot. That feels correct like Space Invaders.

Data shape

Alien bullet:

{
  x: alien.x + 25,
  y: alien.y + 55,
  width: 6,
  height: 14,
  speed: 5,
  active: true
}
Functions
getBottomAliens()
alienShoot()
updateAlienBullets()
renderAlienBullets()
Logic

Every few frames:

get bottom aliens
randomly choose one
create one bullet
3. Spaceship death mechanics
Idea

Spaceship dies if:

hit by alien bullet
touched by alien
aliens reach bottom line
Simple version

When dead:

set spaceship.alive = false
set gameOver = true
stop updates
show end screen

Optional:

short explosion effect
flash red
delay before end screen
Function
killSpaceship()
4. Kill alien mechanics
Idea

Check collision between each player bullet and each alive alien.

If collision:

set alien alive = false
set bullet active = false
add score
remove alien visually on rerender
Best data design

Each alien already has:

alive: true

Perfect. Use that.

Function
checkPlayerBulletAlienCollisions()
Score idea

Different rows = different score:

top red = 30
middle green = 20
bottom blue = 10
5. Approaching aliens movement
Idea

Treat the whole alien formation as one moving block.

Do not move each alien independently with separate logic.
Instead:

all aliens shift horizontally together
when edge is reached:
reverse direction
move all aliens downward
Variables
let alienDirection = 1;
let alienSpeed = 1;
let dropDistance = 20;
Logic

Each update:

move all alive aliens by alienSpeed * alienDirection
detect if leftmost or rightmost alien touches edge
if yes:
alienDirection *= -1
move all aliens down by dropDistance
Function
updateAliens()

That gives you:
left → right → down → right → left → down

exactly what you want.

6. If alien touches spaceship death mechanic
Idea

Check collision between spaceship rectangle and every alive alien rectangle.

Also add a simpler fail rule:
if any alien’s bottom reaches the spaceship row, kill player.

Function
checkAlienSpaceshipCollision()
Two checks
real rectangle overlap
alien reached too low

The second one is easier and enough for MVP.

7. If all aliens die — respawn
Idea

When all alive === false:

increase wave
maybe increase speed slightly
recreate aliens
keep player alive and continue
Function
startNextWave()
Example
if (aliens.every(alien => !alien.alive)) {
  wave++;
  alienSpeed += 0.2;
  initializeAliens();
}

Good extra polish for grading.

8. End screen + score + play again
Idea

When gameOver = true:

show overlay
display score
display wave reached
show restart button
HTML

Add overlay:

<div id="endScreen" class="hidden">
  <h2>GAME OVER</h2>
  <p id="finalScore"></p>
  <button id="playAgain">PLAY AGAIN</button>
</div>
Restart logic

Make a resetGame() function:

reset score
reset wave
reset bullets
reset aliens
reset spaceship
hide end screen
show game
Best development order

Do it in this order:

Phase 1
player bullets
bullet render
bullet movement
Phase 2
bullet vs alien collision
kill alien
score
Phase 3
alien formation movement
edge detect
move down
Phase 4
alien bullets
bullet vs spaceship
death
Phase 5
next wave
end screen
restart

That is the safest order.

Very important coding rule

Split every frame into 3 parts:

1. update state
updateSpaceship();
updateAliens();
updatePlayerBullets();
updateAlienBullets();
checkCollisions();
2. clean state

remove inactive bullets

3. render state
renderSpaceship();
renderAliens();
renderBullets();

This will keep your code readable.

Recommended collision helper

Use one rectangle collision function:

const isColliding = (a, b) => {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
};

Then reuse it everywhere.

I then used this output to code using the VScode ai agent.

### use 6
fixing bugs:
render alien function only works correctly after the initialization, but fails after update

 Fix 1: renderAliens() now uses alien.y correctly
Before:

rowDiv.top used ALIEN_START_Y + rowIndex * ROW_SPACING (static)
each alien had top = 0, so downward motion was ignored
After:

rowDiv.top = 0 (static container)
each alienDiv.top = ${alien.y}px`` (dynamic)
alien downward movement in updateAliens() now appears during render


### use 7
after adding a spaceship sprite, the spaceship hitbox became weird.
 
🛠️ Fix 2: correct spaceship collision box from real drawn ship
Before:

used spaceshipState 50x30 for collision
SVG actual visual is 90x100, so hits felt off
After:

in checkAlienSpaceshipCollision(), spaceship collider now from:
spaceship.getBoundingClientRect()
normalized to gameArea coords
used for:
alien reach threshold check
alien-bullet vs ship
alien vs ship direct collision

### use 8 
adding a camera feature.
ran into a problem where at first it only added the video channel for the receiver and not the sender.

### use 9 
adding gyroscope controls