const dotenv = require ("dotenv");
const TronWeb = require('tronweb')
const fs = require("fs");
dotenv.config();

async function main() {
    let tronWeb = new TronWeb({fullHost: "https://api.shasta.trongrid.io", privateKey: process.env.PRIVATE_KEY_SHASTA});
    let saverAddress = process.env.SAVER;
    let saverContract = await tronWeb.contract().at(saverAddress);
    
    async function storeImagePart(imagePart) {
        return await saverContract.storeImagePart(imagePart).send(
            {
                shouldPollResponse: true,
            });
        }

    async function storeImage(imagePartArray) {
        return await saverContract.storeImage(imagePartArray).send(
            {
                shouldPollResponse: true,
            });
        }
        
    async function getImage(hash) {
        return await saverContract.getImage(hash).call();
    }
    
    async function images(hash) {
        return await saverContract.images(hash).call();
    }
    
    function readFile(path) {
        var raw = fs.readFileSync(path);
        var rawBytes = new Uint8Array(raw);
        var hex = "";
        for (var cycle = 0 ; cycle < raw.byteLength ; cycle++) {
            hex += rawBytes[cycle].toString(16);
        }
        return hex;
    }
        
    tronWeb.setPrivateKey(process.env.PRIVATE_KEY_SHASTA);
    let raw = readFile("./img/mouse.jpg");
    let chuncks = raw.match(/.{1,20000}/g);
    let partsHash = [];
    for (part of chuncks) {
        let hash = await storeImagePart("0x" + part);
        partsHash.push(hash);
        console.log(hash);
    };
    let imageHash = await storeImage(partsHash);
    let imageHash = await storeImage(partsHash);
    let result = await getImage(imageHash);
    console.log(result);
}


main().then(() => {
    console.log("END\n");
});