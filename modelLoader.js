const model=[];
async function loadModel(name,fix){
    const res=await fetch(`model/${name}.json`);
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
    entity.push({name:modelname,seed:f,group:[],mov:position,info:info});
    const rand=Math.random();
    for(const m of model){
        if(m.name==modelname){
        for(const d of m.data){
        rect(position,d.position.slice(),d.color.slice(),0,info,rand,size);
        entity[entity.length-1].group.push(rand);
        }
        }
    }
}
loadModel("tate",[8,8]);
loadModel("redcoral",[8,8]);
loadModel("pinkshell",[8,8]);
loadModel("makigai",[8,8]);
loadModel("otama90",[8,8]);
loadModel("otama45",[8,8]);
loadModel("otama0",[8,8]);
loadModel("otama30",[8,8]);
loadModel("otama60",[8,8]);
loadModel("circle",[8,8]);
loadModel("circle_rot1",[8,8]);
loadModel("circle_rot2",[8,8]);
loadModel("circle_boom1",[8,8]);
loadModel("circle_boom2",[8,8]);
loadModel("circle_boom3",[8,8]);
loadModel("あお粒子",[8,8]);
loadModel("きぴかぴか",[8,8]);
loadModel("ぴかぴか",[8,8]);
loadModel("みどり粒子",[8,8]);
loadModel("むらさき銀河",[8,8]);
loadModel("D",[8,8]);
loadModel("i",[8,8]);
loadModel("n",[8,8]);
loadModel("o",[8,8]);
loadModel("p",[8,8]);
loadModel("l",[8,8]);
loadModel("e",[8,8]);
loadModel("r",[8,8]);