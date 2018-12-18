class Path{
    constructor(dist,input){
        this.dist = dist;
        this.input = input;
    }
    travel(input,index){
        this.dist.index = index +1;
        return this.dist.take_path(input);
    }
}
class State{
    constructor(name){
        this.name = name;
        this.index = 0;
        this.paths=[];
        this.final = false;
        this.initial = false;
    }
    add_path(path){
        //check for DFA
        var added = false;
        var existing = this.paths.find((epath)=> epath.input == path.input);
        if(existing==undefined)
        {
            this.paths.push(path);
            added= true;
        }
        return added;
    }
    take_path(input){
        if(this.index >= input.length){
            return this.final;
        }else{
            var path = this.paths.find(path=>path.input==input.charAt(this.index));
            return path.travel(input,this.index);
        }
    }
    set_final(){
        this.final = true;
    }
    unset_final(){
        this.final = false;
    }
    set_init(init){
        this.initial = init;
    }
    remove_paths(){
        this.paths=[];
    }
    toString(){
        return this.name + this.paths.length>0?(" => paths => " + this.paths.reduce((c,n)=>c+"\n" + next.input + " -> " + next.dist.name)):"";
    }

}


