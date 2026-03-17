const fs = require('fs');
const code = fs.readFileSync('.next/server/chunks/419.js', 'utf8');
const lines = code.split('\n');
const line = lines[195]; 
console.log("CHUNK ARGS:");
console.log(line.substring(97800, 97900));
