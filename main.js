class Pipe{

    constructor(position, HEIGHT,boxHeight){
        this.upperHeight=HEIGHT/3;

        this.rect1Starting={
            x:position,
            y:0
        }

        this.rect2Starting={
            x:position,
            y:this.upperHeight+(boxHeight*4)
        }
        this.width=window.innerWidth/12;

        this.HEIGHT=HEIGHT;
        this.position=position;
        this.upperHeight=HEIGHT/3.5;
    }

    draw(context){
        context.fillStyle='#940a21';
        context.fillRect(this.rect1Starting.x,this.rect1Starting.y,this.width,this.upperHeight);

        context.fillStyle='#940a21';
        context.fillRect(this.rect2Starting.x,this.rect2Starting.y,this.width,this.HEIGHT);
    }

    update(deltaTime){
        if(!deltaTime)
            return;
        this.rect1Starting.x-=this.width/deltaTime;
        this.rect2Starting.x-=this.width/deltaTime;

        if(this.rect1Starting.x+this.width<=0){
            this.rect1Starting.x=window.innerWidth;
            this.rect2Starting.x=window.innerWidth;
        }
    }

    getResetPosition(){
        return this.positionReset;
    }

    static drawAll(pipeArr,context){
        for(var i =0;i<pipeArr.length;i++){
            pipeArr[i].draw(context);
        }
    }

    upshiftWindow()
    {
        this.upperHeight-=(window.innerWidth/6);
        this.rect2Starting.y-=(window.innerWidth/6);

    }

    downshiftWindow(){
        this.upperHeight+=(window.innerWidth/6);
        this.rect2Starting.y+=(window.innerWidth/6);
    }

    static updateAll(pipeArr,deltaTime){
        for(var i =0;i<pipeArr.length;i++){
             pipeArr[i].update(deltaTime);
        }
    }

    intersects(box){
        if(box.position.y<this.upperHeight){
            return true;
        }
        if(box.position.y+box.width<this.upperHeight){
            return true;
        }
        if(box.position.y>=this.rect2Starting.y){
            return true;
        }
        if(box.position.y+box.width>=this.rect2Starting.y){
            return true;
        }
    }

    inbounds(box){
        if(box.position.x>=this.rect1Starting.x&&box.position.x<=(this.rect1Starting.x+this.width)){
            return true;
        }
        if(box.position.x+box.width>=this.rect1Starting.x&&box.position.x+box.width<=(this.rect1Starting.x+this.width)){
            return true;
        }
        if(box.position.x>=this.rect2Starting.x&&box.position.x<=(this.rect2Starting.x+this.width)){
            return true;
        }
        if(box.position.x+box.width>=this.rect2Starting.x&&box.position.x+box.width<=(this.rect2Starting.x+this.width)){
            return true;
        }
    }

    static checkGameOver(pipeArr,box){
        for(var i =0;i<pipeArr.length;i++){
            if(pipeArr[i].inbounds(box)&&pipeArr[i].intersects(box)){
                return true;
            }
       }
       return false;
    }
}

class Box{
    
    constructor(positionX , positionY){
        this.width=window.innerWidth/12;
        this.height=window.innerWidth/12;

        this.position={
            x:positionX,
            y:positionY
        };
        this.jumper=0;
    }

    draw(context){
        context.fillStyle='#2b2a26';
        context.fillRect(this.position.x,this.position.y,this.width,this.height);
    }

    update(deltaTime){
        if(!deltaTime)
            return;
        if(this.position.y+this.width<window.innerHeight){   
            this.position.y+= (this.width*2)/deltaTime;
        }
    }

    getJumper(){
        return this.jumper;
    }

    resetJumper(){
        this.jumper=0;
    }

    jump(deltaTime){
        //doucument.write("jumper ki value")
        if(!deltaTime)
            return;
        if(this.position.y>0){
            this.position.y-= 150/deltaTime;
        }else{
            this.jumper=100;
        }
        this.jumper+=150/deltaTime;
    }
    getHeight(){
        return  this.height;
    }
}

var myCanvas= document.getElementById('myCanvas');
var context= myCanvas.getContext('2d');
var GAME_WIDTH;
var GAME_HEIGHT;
var GAME_OVER=false;
var box;
var pipe0;
var pipe1;
var pipe2;
var pipeArr;
var lastTime;
var prevTime;

function GameOver(){
    GAME_WIDTH= window.innerWidth;
    GAME_HEIGHT=window.innerHeight;
    GAME_OVER=false;
    
    box=new Box(GAME_WIDTH/10,GAME_WIDTH/10);
    
    pipe0= new Pipe(GAME_WIDTH,GAME_HEIGHT,box.getHeight());
    pipe1= new Pipe(GAME_WIDTH+window.innerWidth/2.7,GAME_HEIGHT,box.getHeight());
    pipe2= new Pipe(GAME_WIDTH+window.innerWidth/2.7+window.innerWidth/2.7,GAME_HEIGHT,box.getHeight());
    
    pipe1.downshiftWindow();
    pipe2.upshiftWindow();

    pipeArr=[pipe0,pipe1,pipe2];

    prevTime=0;
    lastTime=0;
}

function gameLoop(timestamp){

    if(Pipe.checkGameOver(pipeArr,box)){
        GAME_OVER=true;    
        context.fillStyle='#32a879';
        context.fillRect(0,0,GAME_WIDTH,GAME_HEIGHT);
        context.font = "30px Georgia bolder";
        context.fillStyle='#000000';
        context.fillText("GAME OVER", GAME_WIDTH/4, GAME_HEIGHT/2);
        myCanvas.addEventListener('touchstart',restartGame,false);
    }else{
        var deltaTime=timestamp-lastTime;
        lastTime=timestamp;
        context.fillStyle='#32a879';
        context.fillRect(0,0,GAME_WIDTH,GAME_HEIGHT);

        box.update(deltaTime);

        Pipe.updateAll(pipeArr,deltaTime);

         Pipe.drawAll(pipeArr,context);
         box.draw(context);
        requestAnimationFrame(gameLoop);
    }
}

function restartGame(){
    GAME_OVER=false;
    GameOver();
    gameLoop(0);
    myCanvas.removeEventListener('touchstart',restartGame);
}


function init(){
    context.canvas.width=GAME_WIDTH;
    context.canvas.height=GAME_HEIGHT;
    context.fillStyle='#32a879';
    context.fillRect(0,0,GAME_WIDTH,GAME_HEIGHT);
}

function touchEVENT(timestamp){
    if(GAME_OVER)
        return true;
    var deltaTime=timestamp-prevTime;
    prevTime=timestamp;
    handle_one_touch(deltaTime);
    context.fillStyle='#32a879';
    context.fillRect(0,0,GAME_WIDTH,GAME_HEIGHT);
    Pipe.drawAll(pipeArr,context);
    box.draw(context);
    if(box.getJumper()<100)
     requestAnimationFrame(touchEVENT);
    else
        box.resetJumper();
        return;

}
function handle_one_touch(deltaTime){
    box.jump(deltaTime);
}


window.onload=function(){
    init()
    window.addEventListener('resize',init,false);   
}
myCanvas.addEventListener('touchstart',touchEVENT,false);

GameOver();
gameLoop();
