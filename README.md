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
2. Add gyroscope control 
3. Add finishing touches and submit
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