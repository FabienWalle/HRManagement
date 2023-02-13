let bcrypt = require('bcrypt');

let saltRounds = 5

let hashPassword = async function(password){ 
    let salt = await bcrypt.genSalt(saltRounds)
    return await bcrypt.hash(password, salt);
 }
 
 let comparePassword = async function(plainPass, hashword) { 
    let compare = bcrypt.compare(plainPass, hashword);
    return compare;
 };
 
module.exports = {
    hashPassword,
    comparePassword
}