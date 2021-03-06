class Pipe{

    constructor(position, HEIGHT,boxHeight){
        this.upperHeight=HEIGHT/3;

        this.rect1Starting={
            x:position,
            y:0
        }

        this.rect2Starting={
            x:position,
            y:this.upperHeight+(boxHeight*5)
        }
        this.width=window.innerWidth/12;

        this.HEIGHT=HEIGHT;
        this.position=position;
        this.upperHeight=HEIGHT/3.5;
    }

    draw(context){
        context.fillStyle='#F2542D';
        context.fillRect(this.rect1Starting.x,this.rect1Starting.y,this.width,this.upperHeight);

       // context.fillStyle='#940a21';
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
        context.fillStyle='#562C2C';
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
var BestScore=0;
var startTime=0;
var flag=0;
var pausetime=0;
var totalPause=0;
var touchDetect=0;

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
    pausetime=0;
    totalPause=0;
}

function gameLoop(timestamp){
    if(flag==1){
        startTime=window.performance.now();
        flag=0;
    }

    if(Pipe.checkGameOver(pipeArr,box)){
        GAME_OVER=true;    
        context.fillStyle='#F5DFBB';
        context.fillRect(0,0,GAME_WIDTH,GAME_HEIGHT);
        context.font = "600 30px Georgia";
        context.fillStyle='#127475';
        if(timestamp-startTime-totalPause>BestScore){
            BestScore=timestamp-startTime-totalPause;
        }
        context.fillText(Math.floor((timestamp-startTime-totalPause)/1000)+" Seconds ", GAME_WIDTH/3.5, GAME_HEIGHT/2-20);
       // var text=context.measureText("Best: "+BestScore);
        context.fillText("Best: "+ Math.floor(BestScore/1000), GAME_WIDTH-120, 25);
        myCanvas.addEventListener('touchend',restartGame,false);

    }else{
        
        var deltaTime=timestamp-lastTime;
        lastTime=timestamp;
        context.fillStyle='#F5DFBB';
        context.fillRect(0,0,GAME_WIDTH,GAME_HEIGHT);

        box.update(deltaTime);

        Pipe.updateAll(pipeArr,deltaTime);

        Pipe.drawAll(pipeArr,context);
        box.draw(context);
        context.font = "600 30px Georgia";
        context.fillStyle='#127475';
        context.fillText(Math.floor((timestamp-startTime-totalPause)/1000)+" Second", 5, 25);
        context.fillText("Best: "+ Math.floor(BestScore/1000), GAME_WIDTH-120, 25);
        timestamp=0;
        requestAnimationFrame(gameLoop);
    }
}

function restartGame(ev){
    flag=1;
    GAME_OVER=false;
    GameOver();
    gameLoop();
    myCanvas.removeEventListener('touchend',restartGame);
}


function init(){
    context.canvas.width=GAME_WIDTH;
    context.canvas.height=GAME_HEIGHT;
    context.fillStyle='#F5DFBB';
    context.fillRect(0,0,GAME_WIDTH,GAME_HEIGHT);
}

function touchEVENT(timestamp){
    if(GAME_OVER)
        return true;
    var deltaTime=timestamp-prevTime;
    prevTime=timestamp;
    handle_one_touch(deltaTime);
    context.fillStyle='#F5DFBB';
    context.fillRect(0,0,GAME_WIDTH,GAME_HEIGHT);
    Pipe.drawAll(pipeArr,context);
    box.draw(context);
    context.font = "600 30px Georgia";
    context.fillStyle='#127475';
    context.fillText(Math.floor((timestamp-startTime-totalPause)/1000)+" Second", 5, 25);
    context.fillText("Best: "+ Math.floor(BestScore/1000), GAME_WIDTH-120, 25);
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

window.onblur=function(){
    pausetime=window.performance.now();
}

window.onfocus=function(){
    pausetime=window.performance.now()-pausetime;
    totalPause+=pausetime;
   // document.write(pausetime);
}
GameOver();
gameLoop();
