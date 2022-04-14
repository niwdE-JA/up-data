import {fork} from 'child_process'
import { argv , pid} from 'process'
import {existsSync, createReadStream} from 'fs'
const {createHash} = await import('crypto')

const filename = argv[2]

let oldHash
let child = fork(filename)
let newHash

const getFileHash = (filename)=>{
    const hash = createHash('sha256')

    var hashedString = ''
    const input = createReadStream(filename)
    input.on('readable', () => {
    // Only one element is going to be produced by the
    // hash stream.
    const data = input.read()
    if (data){
        hash.update(data)
    }else {
        hashedString = hash.digest('hex')
        // console.log(`${hash.digest('hex')} ${filename}`)
        //console.log(hashedString)
        newHash = hashedString//Updates global hash template
        // if(!oldHash){oldHash = newHash}
    }
    });
    
}



const callBack = ()=>{
    
    if (oldHash != newHash){
        oldHash = newHash
        console.log(newHash)
        
        console.log( "File changed!!")
        child.kill('SIGKILL')
        
        // console.log(child.killed)

        if(child.killed){
            console.log("Process killed successfully. Creating new...")
            child = fork(filename)
        }else{
            console.error("ERROR! Failed to kill process.")
        }

    }else{
        getFileHash(filename)
    }

}

console.log(`This process is ${pid}`) 



if(existsSync(filename)){
    setInterval(callBack, 2000)//start watching file
}else{
    console.error("ERROR! file does not exist")
}

//Possibly use the pid to kill desired process <i>specifically</i>
//In the special case where formerly bad code that didn't run just got fixed...
//...take note of this and handle the killing and starting of new processes accordingly.


//new process is created twice at the start of the program. Fix this!
console.log("I am updater!")