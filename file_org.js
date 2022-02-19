#!/usr/bin/env node
let fs = require("fs");
const { type } = require("os");
const { dirname } = require("path");

const path = require("path");
let input = process.argv.slice(2);
//console.log(input);

let command = input[0];
//console.log(command);
let types = {

    media : ["mp4", "mkv", "bmp"],
    archives: ["zip", "rar", "tar", "gz", "ar", "iso", "xz"],
    documents: ["docx", "doc", "pdf", "xlsx", "xls", "odt", "ods", "odp", "txt", "ps", "tex", "pptx", "rtf", "json"],
    app:["exe", "dmg", "pkg", "deb"]
}
switch(command){
    case "organize":organize(input[1]);
        break;
    case "tree":tree(input[1]);
        break;
    case "help":help();
        break;
    default:
        console.log("Enter the correct command");
}

function organize(dirPath){
    //console.log(dirPath);
    if(dirPath==undefined){
        // console.log("path undefined");
        // return;
        dirPath = process.cwd();
    }
    let  isDirectory = fs.statSync(dirPath).isDirectory();
    if(isDirectory){
        let orgDir = path.join(dirPath, "organized_folder");
        let orgPresent = fs.existsSync(orgDir);
        if(!orgPresent){
            fs.mkdirSync(orgDir);
            let folders = Object.keys(types);
            
            for(let i=0; i<folders.length; i++){
                let sub_folder = path.join(orgDir, folders[i]);
                fs.mkdirSync(sub_folder);
            }
        }
    }else{
        console.log("Enter valid dirPath of directory.");
        return;
    }
    organizeHelper(dirPath);    
}
function organizeHelper(src){
    let files = fs.readdirSync(src);
    for(let file in files){
        let f = files[file];
        let pth = path.join(src, f);
        let isFile = fs.lstatSync(pth);
        if(isFile.isFile()){
            //console.log(path.extname(pth).slice(1));
            if(path.extname(pth)){
            let type = get_type(path.extname(pth).slice(1));
            //console.log(type);
            //fs.copyFileSync(pth, path.join(src, type));
            moveFile(pth, src+"\\"+"organized_folder", type);
            }
            
        }
    }
}
function moveFile(srcFilePath, folderPath, type){
    //console.log(type, "\n", srcFilePath, "\n", folderPath);
    let fileName = path.basename(srcFilePath);
    let dest = path.join(folderPath, type);
    let dest2 = path.join(dest, fileName);
    //console.log(dest2);
    if(fs.existsSync(dest2)){
        console.log("File ", fileName, " already present in organized_folder->", type);
        return;
    }
    fs.copyFileSync(srcFilePath, dest2);
    console.log("Copied File ", fileName, " organized_folder -> ", type);
}
function get_type(ext){
    for(let type in types){
        let arr = types[type];
        for(let i=0; i<arr.length; i++){
            if(ext==arr[i]){
                let allTypes = Object.keys(types);
                return type;
                //console.log(allTypes);
                //console.log(type);
                
            }
        }
    }
}


function tree(dirPath){
    // console.log("Tree function");
    if(dirPath==undefined){
        dirPath = process.cwd();
    }
    let  isDirectory = fs.statSync(dirPath).isDirectory();
    if(isDirectory){
        let files = fs.readdirSync(dirPath);
        for(let i=0; i<files.length; i++){
            let file = path.join(dirPath, files[i]);
            treeHelper(file, "");
        }
    }else{
        console.log("Enter valid dirPath of directory.");
        return;
    }

}
function treeHelper(file, indent){
    let isFile = fs.lstatSync(file).isFile();
    if(isFile){
        let name = path.basename(file);
        console.log(indent, "|---->", name);
    }else{
        console.log(indent, "|_____", path.basename(file));
        let f = fs.readdirSync(file);
        for(let i=0; i<f.length; i++){
        let p = path.join(file, f[i]);
        treeHelper(p, indent+"         ");
        }
    }

}


function help(){
    console.log(`
    Use the following Commands:-
        //(help)
        1. node file_org.js help
        //(organize)
        2. node file_org.js organize "directorydirPath" 
        //(tree)
        3. node file_org.js tree "directorydirPath" 
    `);
}