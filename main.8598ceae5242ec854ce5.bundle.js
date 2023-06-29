(()=>{"use strict";var e,t={261:(e,t,s)=>{var i=s(260),a=s.n(i);const l=Math.min(500,window.innerWidth),o=window.innerHeight;class r extends Phaser.Scene{constructor(){super({key:"Shop Scene"})}preload(){this.load.image("normalball","assets/sprites/ball.png"),this.load.image("basketball","assets/images/ball.png"),this.load.image("pokeball","assets/images/poke-ball.png"),this.load.image("football","assets/images/football.png"),this.load.image("volleyball","assets/images/volleyball.png"),this.load.image("tennisball","assets/images/tennisball.png"),this.load.image("cannonbolt","assets/images/cannonbolt.png"),this.load.image("dragonball","assets/images/dragonball.png"),this.load.image("back","assets/images/back.png"),this.load.image("gem","assets/images/gem.png")}create(){this.balls=[],this.ballKey=["normalball","basketball","football","volleyball","tennisball","pokeball","cannonbolt","dragonball"],this.gemNeedToPay=[0,10,20,30,40,50,60,70],this.gemNeedToPayDisplay=[],this.getBoughtBall(),this.add.image(10,10,"back").setOrigin(0).setScale(.1).setInteractive().on("pointerdown",(()=>{this.scene.switch("Start Scene")})),this.add.text(l/2,10,"Shop",{fontSize:"32px",fontFamily:"Arial",color:"#000000",testString:"1234y"}).setStroke("black",1).setOrigin(.5,0);const e=this.add.image(l-10,10,"gem").setOrigin(1,0);e.setScale(50/e.displayWidth),this.playerGameDisplay=this.add.text(e.x-e.displayWidth-10,10,`${r.playerGem}`,{fontSize:"16px",color:"0x000000"}).setOrigin(1,0),this.createBallList()}createBall(e,t,s,i){const a=this.add.image(t,s,e).setOrigin(0);a.setScale(100/a.width).setInteractive().on("pointerdown",(()=>{if(r.playerGem>=this.gemNeedToPay[i]){if(r.playerGem-=this.gemNeedToPay[i],this.gemNeedToPay[i]>0){const e=localStorage.getItem("boughtBall");e&&localStorage.setItem("boughtBall",e+` ${i}`)}r.chosenBall=i,this.gemNeedToPay[i]=0,this.gemNeedToPayDisplay[i].setText("0"),localStorage.setItem("chosenBall",i.toString()),localStorage.setItem("totalGem",r.playerGem.toString());for(const e of this.balls)e.setAlpha(1);a.setAlpha(.3)}})),r.chosenBall==i&&a.setAlpha(.3),this.balls.push(a)}createGemDisplay(e,t,s){const i=this.add.text(e,t,`${s}`,{color:"0x000000",fontSize:"16px"}).setOrigin(.5);i.setY(t+i.displayHeight/2),this.gemNeedToPayDisplay.push(i)}createBallList(){const e=(l-100*Math.floor(l/100))/2,t=Math.floor(l/100);for(let s=0;s<this.ballKey.length;s++){const i=s%t,a=Math.floor(s/t);this.createBall(this.ballKey[s],e+100*i,50*a*2+100+16*a,s),this.createGemDisplay(e+100*i+50,50*a*2+100+100+16*a,this.gemNeedToPay[s])}}getBoughtBall(){const e=localStorage.getItem("boughtBall");if(e){const t=e.split(" ");for(const e of t)this.gemNeedToPay[parseInt(e)]=0}}update(){this.playerGameDisplay.setText(`${r.playerGem}`)}}class h{constructor(e){this.scene=e,this.floors=[],this.pipes=[],this.gems=[],this.spikes=[],this.hitPoints=[],this.colors=[15759480,10146549,16109717,11336381],this.floorSpeed=-2.5,this.jumpSpeed=-10,this.fallSpeed=10,this.timeToChangeColor=5,this.colorIndex=0,this.timeToSpawnPipe=50,this.cnt=this.timeToSpawnPipe,this.floorDownSpeed=2,this.delta=7,this.timeToFire=0,this.perfect=!1,this.comboDisplay=this.scene.add.text(100,200,"Perfect",{fontSize:"20px",fontFamily:"Arial",color:"#1c2070",testString:"1234y"}).setAlpha(0).setOrigin(.5).setDepth(10),this.combo=0}static getInstance(e){return h.instance||(h.instance=new h(e)),h.instance}initial(){for(let e=2;e<=4;e++)this.createFloor(Math.floor(e*l/4),l,1);this.initialBall(),this.initialEmitter()}initialBall(){this.ball=this.scene.matter.add.image(0,0,"normalball"),this.ball.setScale(50/this.ball.width).setCircle(this.ball.displayWidth/2).setFriction(.005).setBounce(0).setMass(3).setDepth(5).setPosition(l/2,35).setOnCollide((()=>{this.ball.setVelocity(0,Math.max(this.jumpSpeed*this.delta/7,-12)),n.score++,this.timeToChangeColor--,n.start=!0,this.timeToFire>0&&this.timeToFire--,this.emitter.setPosition(this.ball.x,this.ball.y+this.ball.displayWidth/2),this.emitter.visible||this.emitter.setVisible(!0),this.perfect?(this.emitter.gravityX=0,this.emitter.gravityY=-500*this.delta/7,this.emitter.speed=300*this.delta/7,this.emitter.explode(10)):(this.emitter.gravityX=-500*this.delta/7,this.emitter.gravityY=0,this.emitter.speed=150*this.delta/7,this.emitter.explode(3))})),this.scene.input.on("pointerdown",(()=>{n.gameOver||this.ball.setVelocity(0,this.fallSpeed*this.delta/7)}))}initialEmitter(){this.emitter=this.scene.add.particles(100,150,"red",{lifespan:2e3,speed:{min:100,max:200},scale:{start:.6,end:0},gravityX:-500,emitting:!1}).setScale(.2),this.fireEmitter=this.scene.add.particles(this.ball.x,this.ball.y,"whitefire",{color:[16436258,16291840,16266752,10421252],x:0,y:0,lifespan:500,angle:{min:-100,max:-80},scale:{start:.4,end:0,ease:"sine.in"},speed:{min:200,max:300},advance:2e3,emitting:!1,colorEase:"quart.out"}).setDepth(3).setVisible(!1)}setFloorCollideEvent(e){e.setOnCollide((()=>{if(e){e.setState(1);const t=this.pipes.filter((t=>t.x==e.x));t[0]&&t[0].setState(1);const s=this.gems.filter((t=>{if(e)return t.x==e.x}));s[0]&&s[0].setState(1);const i=this.spikes.filter((t=>{if(e)return t.x<=e.x+e.displayWidth/2&&t.x>=e.x-e.displayWidth/2}));i[0]&&i[0].setState(1),this.createHitpoint(e.x,e.y,e.displayWidth,e.displayHeight,this.ball.x-e.x)}}))}createFloor(e,t,s){let i;const a=this.floors.filter((e=>e.x+e.displayWidth/2<=0));0==a.length?(i=this.scene.matter.add.image(0,0,"floor").setBounce(0),this.setFloorCollideEvent(i),console.log("create New Floor"),this.floors.push(i)):i=a[0],i&&(i.setStatic(!0).setY(t).setOrigin,null==e?i.setX(l+i.displayWidth/2):i.setX(e),i.scaleX=s,i.setState(0),i.setDepth(2),this.createPipe(i.x,i.y+i.displayHeight/2+o/2,i.displayWidth,o),this.createGem(i.x,i.y-i.displayHeight/2),this.createSpike(i.x,i.y-i.displayHeight/2,i.displayWidth,i.scaleX))}createPipe(e,t,s,i){let a;const l=this.pipes.filter((e=>e.x+e.displayWidth/2<=0));0==l.length?(a=this.scene.add.rectangle(e,t,s,i,16711680).setDepth(0),console.log("create New Pipe"),this.pipes.push(a)):a=l[0],a&&(a.displayWidth=s,a.displayHeight=i,a.setPosition(e,t),a.setState(0),a.fillColor=this.colors[this.colorIndex])}createGem(e,t){if(0!=Phaser.Math.Between(0,100)%5)return;let s;const i=this.gems.filter((e=>e.x+e.displayWidth/2<=0||0==e.alpha));0==i.length?(s=this.scene.add.image(e,t,"gem"),s.setScale(20/s.width),this.gems.push(s),console.log("create New Gem")):s=i[0],s&&(0==Phaser.Math.Between(1,100)%5?(s.setTexture("firegem"),s.setScale(20/s.width)):(s.setTexture("gem"),s.setScale(20/s.width)),s.setState(0),s.setAlpha(1),s.setPosition(e,t-s.displayHeight/2))}createHitpoint(e,t,s,i,a){let l;const o=this.hitPoints.filter((e=>e.x+e.displayWidth/2<=0));if(0==o.length?(l=this.scene.add.rectangle(e,t,s/3,i,16711680).setDepth(3),this.hitPoints.push(l),console.log("create New Spike")):(l=o[0],l&&(l.setY(t),l.scaleX=s/(3*l.width))),null!=l){if(a<-s/6)l.setX(e-s/3),this.perfect=!1,this.combo=0,this.spikes.filter((t=>t.x<e&&t.x>e-s/2))[0]&&this.timeToFire<=0&&(n.gameOver=!0);else if(a>s/6)l.setX(e+s/3),this.combo=0,this.perfect=!1,this.spikes.filter((t=>t.x>e&&t.x<e+s/2))[0]&&this.timeToFire<=0&&(n.gameOver=!0);else{l.setX(e),this.combo++,this.perfect=!0;const t=this.gems.filter((t=>t.x==e))[0];if(t&&t.alpha)if(t.setAlpha(0),n.score+=5,"firegem"==t.texture.key){if(this.timeToFire<=0){this.fireEmitter.start(),this.fireEmitter.setVisible(!0);const e=document.getElementById("game");e&&(e.style.backgroundColor="#000000")}this.timeToFire+=20}else r.playerGem++,localStorage.setItem("totalGem",r.playerGem.toString())}l.fillColor=this.colors[this.colorIndex],l.setState(1)}}createSpike(e,t,s,i){if(i<1.1)return;if(3!=Phaser.Math.Between(0,5))return;const a=Phaser.Math.Between(0,1);let l;const o=this.spikes.filter((e=>e.x+e.displayWidth/2<=0));0==o.length?(l=this.scene.add.image(e,t,"spike").setScale(.3),this.spikes.push(l),console.log("create New Spike")):l=o[0],l&&(l.setState(0),l.setAlpha(1).setDepth(0),0==a?l.setPosition(e-s/2+l.displayWidth/2,t-l.displayHeight/2):l.setPosition(e+s/2-l.displayWidth/2,t-l.displayHeight/2))}createObject(){this.ball.rotation+=3*Phaser.Math.DEG_TO_RAD*this.delta/7,this.cnt-=Math.round(1*this.delta/7),this.cnt<=0&&(this.cnt=this.timeToSpawnPipe,this.createFloor(null,Phaser.Math.Between(.5*o,.6*o),Phaser.Math.FloatBetween(1,2.5)/2))}handleGameOver(){c.score=n.score,this.restart(),this.scene.scene.switch("Game Over Scene")}changeColor(){if(this.timeToChangeColor<=0){this.colorIndex=(this.colorIndex+1)%this.colors.length,this.timeToChangeColor=5;for(const e of this.pipes)e.fillColor=this.colors[this.colorIndex];switch(this.colorIndex){case 0:this.emitter.setTexture("red");break;case 1:this.emitter.setTexture("blue");break;case 2:this.emitter.setTexture("orange");break;case 3:this.emitter.setTexture("green")}}}checkOutOfBoundOfArray(e,t){for(const s of e){if(!(s.x+s.displayWidth/2<=0))break;{const s=e.shift();null!=s&&t.push(s)}}}checkOutOfBound(){(this.ball.y>=this.ball.displayHeight/2+o||this.ball.x<=0)&&(console.log("Game Over"),n.gameOver=!0)}update(e){this.delta=e,this.fireEmitter.visible&&this.fireEmitter.setPosition(this.ball.x,this.ball.y),this.timeToFire<=0&&(this.fireEmitter.stop(),this.fireEmitter.setVisible(!1)),n.start&&(this.perfect?(this.combo>=2?this.comboDisplay.setText(`Perfect x${this.combo}`):this.comboDisplay.setText("Perfect"),this.comboDisplay.setPosition(this.ball.x,this.ball.y-this.ball.displayWidth/2-this.comboDisplay.displayHeight/2-30).setAlpha(1)):this.comboDisplay.setAlpha(0),this.createObject(),this.moveFloor())}moveFloor(){this.emitter.setX(this.emitter.x+this.floorSpeed*this.delta/7),this.emitter.setY(this.emitter.y+this.floorDownSpeed*this.delta/7),0!=this.ball.x&&this.ball.setX(l/2),this.moveGameObject(this.floors),this.moveGameObject(this.pipes),this.moveGameObject(this.spikes),this.moveGameObject(this.gems),this.moveGameObject(this.hitPoints)}moveGameObject(e){for(const t of e)t.setX(t.x+this.floorSpeed*this.delta/7),t.state&&t.setY(t.y+this.floorDownSpeed*this.delta/7)}restart(){n.score=0,n.start=!1,n.gameOver=!1,this.emitter.setVisible(!1),this.ball.setVelocity(0,0),this.timeToChangeColor=5,this.cnt=this.timeToSpawnPipe,this.comboDisplay.setAlpha(0),this.combo=0,this.timeToFire=0,this.fireEmitter.stop(),this.fireEmitter.setVisible(!1),this.clearArr(this.floors),this.clearArr(this.pipes),this.clearArr(this.spikes),this.clearArr(this.hitPoints),this.clearArr(this.gems);for(let e=2;e<=4;e++)this.createFloor(Math.floor(e*l/4),l,1);this.ball.setPosition(l/2,35)}clearArr(e){for(const t of e)t.setX(-1e3)}changeBall(e){this.ball.setTexture(e),this.ball.setScale(50/this.ball.width)}}h.instance=null;class n extends Phaser.Scene{constructor(){super({key:"Play Scene"})}preload(){this.load.image("normalball","assets/sprites/ball.png"),this.load.image("basketball","assets/images/ball.png"),this.load.image("pokeball","assets/images/poke-ball.png"),this.load.image("football","assets/images/football.png"),this.load.image("volleyball","assets/images/volleyball.png"),this.load.image("tennisball","assets/images/tennisball.png"),this.load.image("cannonbolt","assets/images/cannonbolt.png"),this.load.image("dragonball","assets/images/dragonball.png"),this.load.image("pipe","assets/images/up-pipe.png"),this.load.image("floor","assets/images/floor.png"),this.load.image("gem","assets/images/gem.png"),this.load.image("spike","assets/images/triangle.png"),this.load.image("red","assets/images/red-partical.png"),this.load.image("blue","assets/images/blue-partical.png"),this.load.image("orange","assets/images/orange-partical.png"),this.load.image("green","assets/images/green-partical.png"),this.load.image("blackfire","assets/images/blackfire.png"),this.load.image("whitefire","assets/images/whitefire.png"),this.load.image("firegem","assets/images/fire-gem.png")}create(){console.log("create play scene"),this.matter.world.setGravity(0,.4),n.start=!1,n.gameOver=!1,n.score=0,this.objectManager=h.getInstance(this),this.balls=["normalball","basketball","football","volleyball","tennisball","pokeball","cannonbolt","dragonball"],this.currentBall=0,this.scoreDisplay=this.add.text(0,0,`${n.score}`,{fontSize:"180px",fontFamily:"Arial",color:"#cccccc",testString:"123y2"}).setAlpha(.5).setOrigin(.5).setDepth(0),this.scoreDisplay.setPosition(l/2,o/2*.5),this.highScoreDisplay=this.add.text(l/2,10,`High Score: ${n.highScore}`,{fontSize:"32px",fontFamily:"Arial",color:"#000000"}).setOrigin(.5,0),this.objectManager.initial()}update(e,t){this.matter.world.setGravity(0,Math.min(.5*t/7,1.2)),this.currentBall!=r.chosenBall&&(this.currentBall=r.chosenBall,this.objectManager.changeBall(this.balls[this.currentBall])),n.score>n.highScore&&this.highScoreDisplay.setText(`HighScore: ${n.score}`),n.gameOver&&this.objectManager.handleGameOver(),this.objectManager.changeColor(),this.scoreDisplay.setText(`${n.score}`),this.objectManager.checkOutOfBound(),this.objectManager.update(t)}}class c extends Phaser.Scene{constructor(){super({key:"Game Over Scene"})}preload(){this.load.image("replay-button","assets/images/replay.png"),this.load.image("home-button","assets/images/home.png")}create(){const e=this.add.image(l/2,o/2,"replay-button").setInteractive().setScale(.2).on("pointerdown",(()=>{this.scene.switch("Play Scene")}));this.add.image(l/2,e.y+e.displayHeight/2+50,"home-button").setInteractive().setScale(.2).setOrigin(.5,0).on("pointerdown",(()=>{this.scene.switch("Start Scene")})),this.scoreDisplay=this.add.text(100,100,`Score: ${c.score}`,{fontSize:"32px",fontFamily:"Arial",color:"#000000",testString:"1234y",align:"center"}).setStroke("black",1).setInteractive().setOrigin(.5).setPosition(l/2,o/2*.5),this.highScoreDisplay=this.add.text(100,200,`High Score: ${n.highScore}`,{fontSize:"32px",fontFamily:"Arial",color:"#000000",testString:"1234y",align:"center"}).setStroke("black",1).setInteractive().setOrigin(.5).setPosition(l/2,o/2*.7)}update(){c.score>n.highScore&&(n.highScore=c.score,localStorage.setItem("highScore",n.highScore.toString())),this.scoreDisplay.setText(`Score: ${c.score}`),this.highScoreDisplay.setText(`High Score: ${n.highScore}`)}}class g extends Phaser.Scene{constructor(){super({key:"Start Scene"})}preload(){this.load.image("start-button","assets/images/start-button.png"),this.load.image("shop-button","assets/images/shop.png")}create(){const e=this.add.image(l/2,o/2,"start-button").setScale(.2).setInteractive(),t=this.add.image(l/2,e.y+e.displayHeight/2+50,"shop-button").setScale(.2).setOrigin(.5,0).setInteractive();e.on("pointerdown",(()=>{this.tweens.add({targets:e,scale:.1,duration:500,yoyo:!0,onComplete:()=>{this.tweens.add({targets:[this.text],y:-200,duration:1e3,yoyo:!1,alpha:0,onComplete:()=>{this.tweens.add({targets:[this.text],y:o/2*.5,duration:1e3,yoyo:!1,alpha:1}),this.scene.switch("Play Scene")}}),this.tweens.add({targets:[e,t],y:800,duration:1e3,alpha:0,yoyo:!0})}})})),t.on("pointerdown",(()=>{this.scene.switch("Shop Scene")})),this.text=this.add.text(60,100,"Bouncing\n   Ball 2",{fontSize:64*l/400+"px",fontFamily:"Arial",color:"#000000",testString:"1234y"}).setStroke("black",1).setOrigin(.5).setPosition(l/2,o/2*.5);const s=localStorage.getItem("chosenBall");r.chosenBall=s?parseInt(s):0;const i=localStorage.getItem("totalGem");r.playerGem=i?parseInt(i):0,localStorage.getItem("boughtBall")||localStorage.setItem("boughtBall","0");const a=localStorage.getItem("highScore");n.highScore=null!=a?parseInt(a):0}}const p={type:a().AUTO,width:l,height:o,backgroundColor:"#ebf9fa",parent:"game",physics:{default:"matter",matter:{enableSleeping:!0}},scene:[g,n,c,r]};class m{constructor(){new Phaser.Game(p)}}new class{constructor(){console.log("Game created"),new m}}}},s={};function i(e){var a=s[e];if(void 0!==a)return a.exports;var l=s[e]={exports:{}};return t[e].call(l.exports,l,l.exports,i),l.exports}i.m=t,e=[],i.O=(t,s,a,l)=>{if(!s){var o=1/0;for(c=0;c<e.length;c++){for(var[s,a,l]=e[c],r=!0,h=0;h<s.length;h++)(!1&l||o>=l)&&Object.keys(i.O).every((e=>i.O[e](s[h])))?s.splice(h--,1):(r=!1,l<o&&(o=l));if(r){e.splice(c--,1);var n=a();void 0!==n&&(t=n)}}return t}l=l||0;for(var c=e.length;c>0&&e[c-1][2]>l;c--)e[c]=e[c-1];e[c]=[s,a,l]},i.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return i.d(t,{a:t}),t},i.d=(e,t)=>{for(var s in t)i.o(t,s)&&!i.o(e,s)&&Object.defineProperty(e,s,{enumerable:!0,get:t[s]})},i.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{var e={179:0};i.O.j=t=>0===e[t];var t=(t,s)=>{var a,l,[o,r,h]=s,n=0;if(o.some((t=>0!==e[t]))){for(a in r)i.o(r,a)&&(i.m[a]=r[a]);if(h)var c=h(i)}for(t&&t(s);n<o.length;n++)l=o[n],i.o(e,l)&&e[l]&&e[l][0](),e[l]=0;return i.O(c)},s=self.webpackChunktype_project_template=self.webpackChunktype_project_template||[];s.forEach(t.bind(null,0)),s.push=t.bind(null,s.push.bind(s))})();var a=i.O(void 0,[216],(()=>i(261)));a=i.O(a)})();