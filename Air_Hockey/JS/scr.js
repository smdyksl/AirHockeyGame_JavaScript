const cvs = document.getElementById('game');
const ctx = cvs.getContext('2d');

const drawRect = (x,y,w,h,color) => {
    ctx.fillStyle=color,
    ctx.fillRect(x,y,w,h)
}

const drawCircleF = (x,y,r,color) =>{
    ctx.fillStyle = color,
    ctx.beginPath(),
    ctx.arc(x,y,r,0,2 * Math.PI,false),
    ctx.closePath(),
    ctx.fill()
}

const drawCircleS = (x,y,r,w,color) =>{
    ctx.strokeStyle = color,
        ctx.lineWidth=w,
        ctx.beginPath(),
        ctx.arc(x,y,r,0,2 * Math.PI),
        ctx.closePath(),
        ctx.stroke()
}

const drawText = (text,x,y,color)=>{
    ctx.fillStyle=color,
    ctx.font='50px sans-serif',
    ctx.fillText(text,x,y)
}
const drawText2 = (text,x,y,color)=>{
    ctx.fillStyle=color,
        ctx.font='30px sans-serif',
        ctx.fillText(text,x,y)
}

const user = {
    x:20,
    y:cvs.height/2 -50,
    w:15,
    h:150,
    color:'#00395d',
    score:0
}

const com = {
    x:cvs.width-30,
    y:cvs.height/2 -50,
    w:15,
    h:150,
    color:'#00395d',
    score:0
}

const ball={
    x:cvs.width/2,
    y:cvs.height/2,
    r:13,
    color:'#aea400',
    speed:8,
    velocityX:-8,
    velocityY:-10,
    stop:true
}
const movePaddle = (e) =>{
    let rect = cvs.getBoundingClientRect()
    user.y = e.clientY - rect.top - user.h/2
    ball.stop=false;
}
cvs.addEventListener('mousemove',movePaddle);
const collision=(b,p)=>{
    b.top = b.y - b.r
    b.bottom = b.y + b.r
    b.left = b.x - b.r
    b.right = b.x + b.r

    p.top=p.y
    p.bottom=p.y+p.h
    p.left=p.x
    p.right=p.x+p.w

    return (b.top<p.bottom && b.bottom > p.top && b.left < p.right && b.right>p.left)
}

const resetBall = (spd)=>{
    ball.x = cvs.width/2
    ball.y = cvs.height/2
    ball.speed = 8
    ball.velocityX=spd*8
    ball.velocityY=spd*10
    ball.stop=true
}

const update = () =>{
    if(!ball.stop){
        ball.x += ball.velocityX
        ball.y += ball.velocityY
    }


    if(ball.y + ball.r  > cvs.height -10 || ball.y - ball.r < 10) {
        ball.velocityY = -ball.velocityY;
    }

    let comLvl = 0.15;
    com.y += (ball.y-(com.y+com.h/2)) * comLvl;

    let player = (ball.x < cvs.width/2) ? user : com
    if(collision(ball,player)){
        let intersetY = ball.y - (player.y + player.h/2);
        intersetY /=player.h/2;

        let maxBounceRate = Math.PI / 3;
        let bounceAngle = intersetY * maxBounceRate;

        let direction = (ball.x < cvs.width/2) ? 1:-1;
        ball.velocityX =direction * ball.speed * Math.cos(bounceAngle);
        ball.velocityY =ball.speed * Math.sin(bounceAngle);

        ball.speed += 3;
    }

    if(ball.x > cvs.width){
        user.score++;
        resetBall(1);
    }else if(ball.x <0){
        com.score++;
        resetBall(-1);
    }
}
const pitchColor="#4d4f53"
const render = ()=>{
    drawRect(0,0,cvs.width,cvs.height,'#dbebfa')
    drawRect(cvs.width/2 - 2,0,4,cvs.height,pitchColor)
    drawCircleF(cvs.width/2,cvs.height/2,8,pitchColor)
    drawCircleS(cvs.width/2,cvs.height/2,150,4,pitchColor)
    drawText2("Player",cvs.width/4-30,40,'#231f20')
    drawText2("Computer",3*cvs.width/4 -50,40,'#231f20')
    drawText(user.score,cvs.width/4,100,'#2d364c')
    drawText(com.score,3*cvs.width/4,100,'#2d364c')

    // side lines
    drawRect(0,0,cvs.width,10,pitchColor)
    drawRect(0,890,cvs.width,10,pitchColor)

    // goal lines
    drawRect(0,0,5,1000,pitchColor)
    drawRect(1895,0,5,1000,pitchColor)

    drawRect(user.x,user.y,user.w,user.h,user.color)
    drawRect(com.x,com.y,com.w,com.h,com.color)
    drawCircleF(ball.x,ball.y,ball.r,ball.color)
}

const game=()=>{
    update()
    render()
}

const fps=50;
setInterval(game,1000/fps);