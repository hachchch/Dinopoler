const canvas=document.querySelector(".canvas");
canvas.style.border="2px solid";
var entity=[];
var camera=[0,0];
var obj=[];
var inst=[];
var zclicked=false;
var aspect=1;
var key="";
var initialized=false;
var isTitle=true;
var pose=false;
var angle=0;
var velocity=0;
var rotvelo=0;
var playerSeed;
var maxrotvelo=0.2;
var maxvelocity=0.01;
var p=new complex(0,0);
var mkeys={
    up:false,
    down:false,
    right:false,
    left:false,
    submit:false
};
var vertex=[];
const game={
    combo:{
        interval:100,
        timer:0,
        chain:0,
        scoreMultiplication:1.12,
        mulmax:3,
        sound:["てれん","てれれん","てれれれん"]
    },
    undesire:0.1,
    minradius:1,
    radius:5,
    enemy:0,
    maxEnemy:30,
    item:0,
    maxItem:10,
    hp:3,
    tidalpower:{
        speedmultiplication:4,
        value:100,
        max:100,
        range:0.1,
        regene:{
            interval:6,
            timer:0
        },
        consumption:{
            interval:2,
            timer:0
        }
    },
    hidan:{
        trigger:false,
        interval:7,
        timer:0
    },
    progression:0,
    needed:30,
    phase:0,
    pinkshell:0,
    redcoral:0,
    conch:0
}
var size=0.025;
function generateVertex(){
    const s=size/2;
    vertex=[
        -s,-s,
        s,-s,
        -s,s,
        s,s
    ]
}
function generateIndex(){
    return [
        0,1,2,2,1,0,
        1,2,3,3,2,1
    ]
}
function rect(xy,modelij,color,rot,info,seed,scale){
    if(!scale){
        scale=1;
    }
    obj.push({
        position:vec.prod(modelij,size),
        mov:xy,
        rot:rot,
        color:color,
        info:info,
        size:scale,
        seed:seed,
        direction:[1,1]
    });
}
window.addEventListener("keydown",e=>{
    key=e.code;
    if(e.code=="KeyW" || e.code=="ArrowUp"){
        mkeys.up=true;
    }
    if(e.code=="KeyA" || e.code=="ArrowLeft"){
        mkeys.left=true;
    }
    if(e.code=="KeyS" || e.code=="ArrowDown"){
        mkeys.down=true;
    }
    if(e.code=="KeyD" || e.code=="ArrowRight"){
        mkeys.right=true;
    }
    if(e.code=="KeyZ" || e.code=="Enter" || e.code=="Space"){
        if(!zclicked){
        submit();
        mkeys.submit=true;
        }
        zclicked=true;
    }
    if(e.code=="KeyQ"){
        pose=!pose;
        if(pose){
            play("てれれんアッパー",1);
        }else{
            play("てれれんダウナー",1);
        }
    }
});
window.addEventListener("keyup",e=>{
    if(e.code=="KeyW" || e.code=="ArrowUp"){
        mkeys.up=false;
    }
    if(e.code=="KeyA" || e.code=="ArrowLeft"){
        mkeys.left=false;
    }
    if(e.code=="KeyS" || e.code=="ArrowDown"){
        mkeys.down=false;
    }
    if(e.code=="KeyD" || e.code=="ArrowRight"){
        mkeys.right=false;
    }
    if(e.code=="KeyZ" || e.code=="Enter" || e.code=="Space"){
        mkeys.submit=false;
        zclicked=false;
    }
    key="";
});
function submit(){
    if(isTitle){
        gamestart();
    }
}
async function titleScreen(){
    initialized=true;
    add([-0.66,-0.5],"D",{});
    add([-0.5,-0.5],"i",{});
    add([-0.35,-0.5],"n",{});
    add([-0.15,-0.5],"o",{});
    add([0.05,-0.5],"p",{});
    add([0.25,-0.5],"o",{});
    add([0.45,-0.5],"l",{});
    add([0.53,-0.5],"e",{});
    add([0.73,-0.5],"r",{});
}
function gamestart(){
    isTitle=false;
    add([0,0],"otama0",{name:"otama",attribute:"player",hide:false});
    play("スタート",1);
    setBGM("katsuo",0.2);
}
function play(name,volume){
    const a=new Audio();
    a.src=`Sounds/${name}.wav`;
    a.type="audio/wav";
    a.volume=volume;
    a.play();
}
//アニメーションフレーム
function animation(){
    if(!initialized){
        titleScreen();
    }
aspect=window.innerHeight/window.innerWidth;
    if(!isTitle){
        if(!pose){
        playerAction();
        spawnAction();
        for(const e of entity){
            if(e.info.attribute!="player"){
            objecte(e.group,a=>{
        a.mov=e.mov.slice();
    });
}
            if(e.info.attribute=="enemy"){
                enemyAction(e);
            }
            if(e.info.attribute=="particle"){
                particleAction(e);
            }
            if(e.info.attribute=="point"){
                pointAction(e);
            }
            if(e.info.attribute=="item"){
                itemAction(e);
            }
        }
        utility();
    }
    }
}
//描画毎プレイヤー設定
function playerAction(){
    var move=false;
    var tidaldush=false;
    var s=0.01;
    if(mkeys.submit && game.tidalpower.value>0){
        timerevent(game.tidalpower.consumption,e=>{
            game.tidalpower.value--;
            particle(vec.prod(camera,-1),1,0.1);
        });
        if(game.tidalpower.value==0){
            mkeys.submit=false;
        }
        tidaldush=true;
        s=s*game.tidalpower.speedmultiplication;
        move=true;
    }else{
        timerevent(game.tidalpower.regene,e=>{
        game.tidalpower.value++;
        });
    }
    if(!tidaldush){
    if(mkeys.right || mkeys.left || mkeys.up || mkeys.down){
        move=true;
        p.real=0;
        p.imag=0;
    }
    if(mkeys.right){
        p.real++;
    }
    if(mkeys.left){
        p.real--;
    }
    if(mkeys.up){
        p.imag++;
    }
    if(mkeys.down){
        p.imag--;
    }
}
    var pag=math.mod(p.arg,2*Math.PI);
    angle=math.mod(angle,2*Math.PI);
    var anp=Math.abs(pag-angle+2*Math.PI)<Math.abs(pag-angle-2*Math.PI) || Math.abs(pag-angle)<Math.abs(pag-angle-2*Math.PI);
    var anv=Math.min(Math.abs(pag-angle),Math.abs(pag-angle-2*Math.PI),Math.abs(pag-angle+2*Math.PI));
    var hugou;
    if(Math.abs(pag-angle)<Math.abs(pag-angle+2*Math.PI)){
    hugou=Math.sign(pag-angle);
    }else{
    hugou=-Math.sign(pag-angle);
    }
    var rotspd=0.1;
    if(anv>rotspd && move){
    if(anp){
        angle+=hugou*rotspd;
    }else{
        angle-=hugou*rotspd;
    }
    }else if(anv>0.05){
        if(anp){
        angle+=hugou*0.05;
    }else{
        angle-=hugou*0.05;
    }
    }
    const a=math.mod(180*angle/Math.PI,360);
    const al=math.mod(a,180);
    if(inrange(35,al,55) || inrange(125,al,145)){
        modelchange(playerSeed,"otama45");
    }
    if(inrange(15,al,35) || inrange(145,al,155)){
        modelchange(playerSeed,"otama30");
    }
    if(inrange(55,al,65) || inrange(115,al,125)){
        modelchange(playerSeed,"otama60");
    }
    if(inrange(0,al,15) || inrange(155,al,180)){
        modelchange(playerSeed,"otama0");
    }
    if(inrange(65,al,115)){
        modelchange(playerSeed,"otama90");
    }
    if(inrange(90,a,270)){
        object("otama",e=>{
            e.direction[0]=-1;
        });
    }else{
        object("otama",e=>{
            e.direction[0]=1;
        });
    }
    if(inrange(180,a,360)){
        object("otama",e=>{
            e.direction[1]=-1;
        });
    }else{
        object("otama",e=>{
            e.direction[1]=1;
        });
    }
    if(move){
        if(anv>0.1){
        rotvelo+=hugou*0.005;
        }else{
            if(Math.abs(rotvelo)>0){
        rotvelo-=Math.sign(rotvelo)*0.001;
         if(Math.abs(rotvelo)<0.1){
            rotvelo=0;
         }
        }
        }
        if(Math.abs(rotvelo)>maxrotvelo){
            rotvelo=Math.sign(rotvelo)*maxrotvelo;
        }
        if(velocity<maxvelocity){
            velocity+=0.0003;
            if(velocity>maxvelocity){
                velocity=maxvelocity;
            }
        }else{
            velocity=maxvelocity;
        }
        s+=velocity;
        if(tidaldush){
            velocity=maxvelocity+0.01;
            camera=vec.sum(camera,[-s*Math.cos(angle),s*Math.sin(angle)]);
        }else{
    camera=vec.sum(camera,[-s*Math.cos(pag),s*Math.sin(pag)]);
        }
    }else{
        camera=vec.sum(camera,[-velocity*Math.cos(angle),velocity*Math.sin(angle)]);
        if(velocity>0){
        velocity-=0.0005;
         if(velocity<0){
            velocity=0;
         }
        }
        if(anp){
        angle+=rotvelo;
    }else{
        angle-=rotvelo;
    }
        if(Math.abs(rotvelo)>0){
        rotvelo-=Math.sign(rotvelo)*0.003;
         if(Math.abs(rotvelo)<0.1){
            rotvelo=0;
         }
        }
    }
    object("otama",e=>{
        e.mov=vec.prod(camera,-1).slice();
    });
}

function inrange(m,v,M){
    return m<=v && v<M;
}
function object(name,callback){
    for(const o of obj){
        if(o.info.name==name){
            callback(o);
        }
    }
}
function objects(seed,callback){
    for(const o of obj){
        if(o.seed==seed){
            callback(o);
        }
    }
}
function modelchange(seed,name){
    let id=entity.findIndex(e=>e.seed==seed);
    if(id!=-1){
    add(entity[id].mov,name,entity[id].info);
    deleteEntity(seed);
    }
}
function deleteObj(seed){
    obj=deleteIndex(obj,obj.findIndex(e=>e.seed==seed)).slice();
}
function timerevent(p,callback){
    if(p.timer>=p.interval){
        p.timer=0;
        callback(p);
    }
    p.timer++;
}
//enemy配列が必要。
function spawnAction(){
    for(const e of entity){
        if(e.info.attribute=="enemy"){
        if(vec.length(vec.dec(e.mov,vec.prod(camera,-1)))>game.radius){
        deleteEntity(e.seed);
        game.enemy--;
        }
    }
    }
    //スポーン
    if(game.enemy<game.maxEnemy){
        var pos=vec.dec([math.rand(-game.radius,game.radius),math.rand(-game.radius,game.radius)],camera);
    while(entity.findIndex(e=>e.info.attribute=="enemy" && vec.length(vec.dec(e.mov,pos))<=game.undesire)!=-1 || vec.length(vec.sum(camera,pos))<=game.minradius){
        pos=vec.dec([math.rand(-game.radius,game.radius),math.rand(-game.radius,game.radius)],camera);
    }
        add(pos,"circle",{
            name:"circle_enemy",
            attribute:"enemy",
            hide:false,
            movement:{interval:100,timer:math.rand(0,100),direction:[0,0],work:false},
            rotor:{interval:20,timer:0,count:0,value:["circle","circle_rot1","circle","circle_rot2"]},
            boom:{interval:10,timer:0,count:0,value:["circle_boom1","circle_boom2","circle_boom3","circle_boom3"]},
            boomed:false
        });
        game.enemy++;
    }
    //アイテム
    for(const e of entity){
        if(e.info.attribute=="item"){
        if(vec.length(vec.sum(e.mov,camera))>game.radius){
        deleteEntity(e.seed);
        game.item--;
        }
    }
    }
    //スポーン
    if(game.item<game.maxItem){
            ruledSpawn(cmath.polar(1,Math.random()*Math.PI*2),Math.ceil((game.maxItem-game.item)*0.3));
    }
}
function setBGM(name,volume){
    const a=new Audio();
    a.loop=true;
    a.src=`Sounds/BGM/${name}.mp3`;
    a.type="audio/mp3";
    a.volume=volume;
    a.play();
}
function deleteEntity(seed){
    for(const e of entity){
        if(e.seed==seed){
            for(let k=0; k<e.group.length; ++k){
                deleteObj(e.group[k]);
            }
            entity=deleteIndex(entity,entity.findIndex(ev=>ev.seed==seed)).slice();
        }
    }
}
function playercirclecollision(seed,range){
    for(const e of entity){
    if(e.seed==seed){
    if(vec.length(vec.sum(camera,e.mov))<range){
        return true;
    }
}
}
    return false;
}
//おもい
function playercollision(seed){
    const p=entity[entity.findIndex(e=>e.seed==playerSeed)];
    const e=entity[entity.findIndex(e=>e.seed==seed)];
    var P;
    var Q;
    for(let i=0; i<p.group.length; ++i){
        for(let j=0; j<e.group.length; ++j){
            for(const o of obj){
                if(o.seed==p.group[i]){
                    P=vec.dec(o.position,camera);
                }
                if(o.seed==e.group[j]){
                    Q=vec.sum(o.position,o.mov);
                }
            }
            if(Math.abs(P[0]-Q[0])<=size/2 && Math.abs(P[1]-Q[1])<=size/2){
                return true;
            }
        }
    }
    return false;
}
//敵の沸き、複素数のらせんから
function ruledSpawn(init,N){
    var z=init;
    let pos;
    let f=new complex(0,0);
    const items=["pinkshell","redcoral","conch"];
    const seed=math.randInt(0,2);
    for(k=0; k<N; ++k){
    f=cmath.sum(f,cmath.polar(2,Math.random()*Math.PI));
    pos=vec.dec([f.real,f.imag],camera);
    if(f.abs<game.radius){
    add(pos,items[seed],{name:"pinkshell_item",attribute:"item"},0.6);
    game.item++;
    }
    z=cmath.pow(init,z);
    }
}
function enemyAction(e){
    if(e.info.boomed){
timerevent(e.info.boom,a=>{
            a.count++;
            if(a.count>=a.value.length){
            deleteEntity(e.seed);
            }else{
                modelchange(e.seed,a.value[a.count]);
            }
        });
    }else{
    if(playercirclecollision(e.seed,game.tidalpower.range)){
        if(mkeys.submit && game.tidalpower.value>0){
        play(game.combo.sound[clamp(Math.floor(game.combo.chain/3),0,game.combo.sound.length-1)],1);
        game.combo.chain++;
        game.combo.timer=0;
        game.enemy--;
        play("はじける",1);
        e.info.boomed=true;
        point(e.mov,game.combo.chain,0.1);
        }
    }
    if(playercirclecollision(e.seed,0.1) && !e.info.boomed){
        if(!game.hidan.trigger){
        game.hidan.trigger=true;
        game.hidan.timer=0;
        game.hidan.anime=10;
        game.hp--;
        if(game.hp==0){
            pose=true;
        }
        }
    }
    //移動
    timerevent(e.info.movement,a=>{
        var r=math.rand(-Math.PI,Math.PI);
        if(Math.random()>0.9){
            a.direction=[0,0];
        }else{
        a.direction=[Math.cos(r),Math.sin(r)];
        }
    });
    e.mov=vec.sum(e.mov,vec.prod(e.info.movement.direction,0.005));
    timerevent(e.info.rotor,a=>{
        modelchange(e.seed,a.value[math.mod(a.count,a.value.length)]);
        a.count++;
    });
}
}
function utility(){
    if(game.combo.chain>0){
        timerevent(game.combo,e=>{
            e.chain=0;
        });
    }
    object("otama",E=>{
        E.info.hide=entity[entity.findIndex(e=>e.seed==playerSeed)].info.hide;
    });
    if(game.hidan.trigger){
        timerevent(game.hidan,e=>{
            for(const E of entity){
                if(E.seed==playerSeed){
                    E.info.hide=!E.info.hide;
                }
            }
            e.anime--;
            if(e.anime==0){
            e.trigger=false;
            }
        });
    }
}
function objecte(group,callback){
    for(const o of obj){
        if(group.indexOf(o.seed)!=-1){
            callback(o);
        }
    }
}
const particles=["あお粒子","みどり粒子"];
const points=["きぴかぴか","ぴかぴか","むらさき銀河"];
function point(pos,amount,radius){
    var theta;
    for(let k=0; k<amount; ++k){
        theta=Math.random()*2*Math.PI;
    add(vec.sum(pos,vecexp(radius,theta)),points[math.randInt(0,points.length-1)],{
        attribute:"point",
        direction:vecexp(1,theta),
        shine:false,
        speed:0.03,
        eraze:{
            interval:70,
            timer:0
        },
        scored:false
    },0.7);
}
}
function particle(pos,amount,radius){
    var theta;
    for(let k=0; k<amount; ++k){
        theta=Math.random()*2*Math.PI;
    add(vec.sum(pos,vecexp(radius,theta)),particles[math.randInt(0,particles.length-1)],{
        attribute:"particle",
        direction:vecexp(1,theta),
        shine:false,
        speed:0.03,
        eraze:{
            interval:70,
            timer:0
        }
    },0.5);
}
}
function vecexp(r,theta){
    return [r*Math.cos(theta),r*Math.sin(theta)];
}
function pointAction(e){
    if(e.info.scored){
        const t=Math.atan2(-e.mov[1]-camera[1],-e.mov[0]-camera[0]);
        e.mov=vec.sum(e.mov,vecexp(e.info.speed,t));
    e.info.speed*=1.01;
    if(playercirclecollision(e.seed,0.1)){
        deleteEntity(e.seed);
        game.progression++;
        if(game.progression>=game.needed){
            game.progression=0;
            game.needed+=20;
            game.phase++;
            game.maxEnemy+=5;
            play("チャイム",1);
        }
    }
    }else{
        timerevent(e.info.eraze,a=>{
            e.info.scored=true;
            e.info.speed=0.04;
    });
    e.mov=vec.sum(e.mov,vec.prod(e.info.direction,e.info.speed));
    e.info.speed*=0.95;
    }
}
function particleAction(e){
        timerevent(e.info.eraze,a=>{
            deleteEntity(e.seed);
    });
    e.mov=vec.sum(e.mov,vec.prod(e.info.direction,e.info.speed));
    e.info.speed*=0.95;
}
function itemAction(e){
    if(playercirclecollision(e.seed,0.2)){
        deleteEntity(e.seed);
    }
}