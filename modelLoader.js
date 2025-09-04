const model=[];
async function loadModel(name,fix){
    const res=await fetch(`model/${name}.json`);
    if(!res.ok){
        console.error(`${name}のフェッチに失敗しました。`);
        return;
    }
    console.log(`${name}のフェッチに成功しました。`);
    const data=await res.json();
    const u=[];
    for(const d of data){
        if(!d.alpha){
        u.push({
            position:vec.dec([d.i,d.j],fix),
            color:math.hsl2rgb(180*Math.atan2(d.z.imag,d.z.real)/Math.PI,parseFloat(d.w)/100,Math.hypot(d.z.real,d.z.imag)/100)
        })
        }
    }
    model.push({
        data:u,
        name:name
    });
}
function clamp(v,min,max){
    if(v<min){
        return min;
    }
    if(v>max){
        return max;
    }
    return v;
}
function add(position,modelname,info,size){
    if(!size){
        size=1;
    }
    const f=Math.random();
    if(info.name=="otama"){
        playerSeed=f;
    }
    entity.push({name:modelname,rot:0,seed:f,group:[],mov:position,info:info,scale:size});
    const rand=Math.random();
    for(const m of model){
        if(m.name==modelname){
        for(const d of m.data){
        rect(position,d.position.slice(),d.color.slice(),0,info,rand,size,f);
        entity[entity.length-1].group.push(rand);
        }
        }
    }
}
async function parsemodels(){
    for(const m of modelnames){
        if(!m.preload){
        sintyoku();
        await loadModel(m.name,m.pos);
        }
    }
}
async function preload(){
    for(const m of modelnames){
        if(m.preload){
        await loadModel(m.name,m.pos);
        }
    }
    preloaded=true;
}
const modelnames=[];
function addModel(name,pos,pre){
    modelnames.push({name:name,pos:pos,preload:pre});
}
function sintyoku(){
    for(const e of entity){
        deleteEntity(e.seed);
    }
    printL("numbers",[0,0.2],false,union(numbers(Math.round(100*model.length/modelnames.length)),["percent"]));
    prints("print",[0,0],false,union(union(["sentan"],longhire(Math.round(100*model.length/modelnames.length))),["atama"]));
}
function longhire(amount){
    const res=[];
    for(let k=0; k<amount; ++k){
        res.push("hire");
    }
    return res;
}
addModel("sentan",[3,8],true);
addModel("atama",[7,8],true);
addModel("hire",[4,8],true);
addModel("tatecircle",[8,8]);
addModel("tate",[13,8]);
addModel("redcoral",[8,8]);
addModel("pinkshell",[8,8]);
addModel("conch",[8,8]);
addModel("otama90",[8,8]);
addModel("otama90_2",[8,8]);
addModel("otama90_3",[8,8]);
addModel("otama45",[8,8]);
addModel("otama45_2",[8,8]);
addModel("otama45_3",[8,8]);
addModel("otama0",[8,8]);
addModel("otama0_1",[8,8]);
addModel("otama0_2",[8,8]);
addModel("otama0_3",[8,8]);
addModel("otama0_4",[8,8]);
addModel("otama0_5",[8,8]);
addModel("otama0_6",[8,8]);
addModel("otama30",[8,8]);
addModel("otama60",[8,8]);
addModel("otama_damaged",[8,8]);
addModel("circle",[8,8]);
addModel("circle_rot1",[8,8]);
addModel("circle_rot2",[8,8]);
addModel("circle_boom1",[8,8]);
addModel("circle_boom2",[8,8]);
addModel("circle_boom3",[8,8]);
addModel("あお粒子",[8,8]);
addModel("きぴかぴか",[8,8]);
addModel("ぴかぴか",[8,8]);
addModel("みどり粒子",[8,8]);
addModel("むらさき銀河",[8,8]);
addModel("D",[8,8]);
addModel("i",[8,8]);
addModel("n",[8,8]);
addModel("o",[8,8]);
addModel("p",[8,8]);
addModel("l",[8,8]);
addModel("e",[8,8]);
addModel("r",[8,8]);
addModel("0",[8,8],true);
addModel("1",[8,8],true);
addModel("2",[8,8],true);
addModel("3",[8,8],true);
addModel("4",[8,8],true);
addModel("5",[8,8],true);
addModel("6",[8,8],true);
addModel("7",[8,8],true);
addModel("8",[8,8],true);
addModel("9",[8,8],true);
addModel("percent",[8,8],true);
addModel("cube",[8,8]);
addModel("cubepink",[8,8]);
addModel("cube_gray",[8,8]);
addModel("cube2",[8,8]);
addModel("cube_gray2",[8,8]);
addModel("egg",[8,8]);
addModel("Nb",[8,8]);
addModel("Eb",[8,8]);
addModel("Xb",[8,8]);
addModel("Tb",[8,8]);
addModel("Lb",[8,8]);
addModel("Vb",[8,8]);
addModel("heart",[8,8]);
addModel("ス",[8,8]);
addModel("コ",[8,8]);
addModel("ア",[8,8]);
addModel("ク",[8,8]);
addModel("リ",[8,8]);
addModel("ッ",[8,8]);
addModel("プ",[8,8]);
addModel("ボ",[8,8]);
addModel("ー",[8,8]);
addModel("ド",[8,8]);
addModel("に",[8,8]);
addModel("ほ",[8,8]);
addModel("ぞ",[8,8]);
addModel("ん",[8,8]);
addModel("T",[8,8]);
addModel("キ",[8,8]);
addModel("semic",[8,8]);
addModel("hoya",[8,8]);
addModel("hoya2",[8,8]);
addModel("hoya3",[8,8]);
addModel("泡",[8,8]);
addModel("きらめき",[8,8]);
addModel("きらめき2",[8,8]);
addModel("あかるい",[34,32]);
addModel("jelly1",[8,8]);
addModel("jelly2",[8,8]);
addModel("jelly3",[8,8]);
addModel("jelly4",[8,8]);
addModel("golden1",[8,8]);
addModel("golden2",[8,8]);
addModel("golden3",[8,8]);
addModel("golden4",[8,8]);
preload();
