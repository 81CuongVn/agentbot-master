const quickdb = require("quick.db");
let db = new quickdb.table('ecnomy')
const fs = require('fs');
async function main(){
    let data = await db.all()
    console.log(data)
}
main()