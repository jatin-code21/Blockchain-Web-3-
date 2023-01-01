// mocha is a testing framework and chain is an assertion library

const {expect} = require("chai");

// this is the syntax
// describe("Token contract", function() {
//     // what you want to test goes here
//     it("Deployment should assign the total supply of tokens to the owner", async function(){
//         const [owner] = await ethers.getSigners();

//         console.log("Signers object:", owner);

//         // for creating the instance of the contract
//         const Token = await ethers.getContractFactory("Token");

//         // for deploying the contract
//         const hardhatToken = await Token.deploy();

//         const ownerBalance = await hardhatToken.balanceOf(owner.address);
//         console.log("Owner Address:", owner.address);

//         expect(await hardhatToken.totalSupply()).to.equal(ownerBalance); // total Supply = 1000 hona chaychie owner ka 
//     })

//     it("Should transfer tokens between accounts", async function(){
//         const [owner, addr1, addr2] = await ethers.getSigners();

//         const Token = await ethers.getContractFactory("Token"); // for creating the instance of the contract
//         const hardhatToken = await Token.deploy();

//         // Transfer 50 tokens from owner to addr1
//         await hardhatToken.transfer(addr1.address, 50);
//         expect(await hardhatToken.balanceOf(addr1.address)).to.equal(50);

//         // Transfer 50 tokens from addr1 to addr2
//         // as trasnfering from addr1 to addr2, so we need to connect addr1 to the contract
//         await hardhatToken.connect(addr1).transfer(addr2.address, 50);
//         expect(await hardhatToken.balanceOf(addr2.address)).to.equal(50);
//     })
// })

// to decrease the above code, we can do it in the following way

describe("Token contract", function() {
    let Token;
    let hardhatToken;
    let owner;
    let addr1;
    let addr2;
    let addrs;

    beforeEach(async function(){
        Token = await ethers.getContractFactory("Token");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        hardhatToken = await Token.deploy(); // now in hardhatToken we have the instance of the contract so we can call the functions of the contract
    })

    describe("Deployment", function(){
        it("Should set the right owner", async function(){
            expect(await hardhatToken.owner()).to.equal(owner.address);
        })

        it("Should assign the total supply of tokens to the owner", async function(){
            const ownerBalance = await hardhatToken.balanceOf(owner.address);
            expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
        })
    })

    describe("Transactions", function(){
        it("Should transfer tokens between accounts", async function(){
            // trasnfer 50 tokens from owner to addr1
            await hardhatToken.transfer(addr1.address, 50);
            expect(await hardhatToken.balanceOf(addr1.address)).to.equal(50);

            // Transfer 50 tokens from addr1 to addr2 so we need to connect addr1 to the contract
            await hardhatToken.connect(addr1).transfer(addr2.address, 50);
            expect(await hardhatToken.balanceOf(addr2.address)).to.equal(50);
        })

        it("Should fail if sender doesn't have enough tokens", async function(){
            const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);

            // Try to send 1 token from addr1 (0 tokens) to owner (1000 tokens).
            // `require` will evaluate false and revert the transaction.
            await expect(hardhatToken.connect(addr1).transfer(owner.address, 1)).to.be.revertedWith("Not enough tokens");

            // Owner balance shouldn't have changed.
            expect(await hardhatToken.balanceOf(owner.address)).to.equal(initialOwnerBalance);
        })

        it("Should update balances after transfers", async function(){
            const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);
            await hardhatToken.transfer(addr1.address, 5);
            await hardhatToken.transfer(addr2.address, 10);

            const finalOwnerBalance = await hardhatToken.balanceOf(owner.address);
            expect(finalOwnerBalance).to.equal(initialOwnerBalance - 15);

            const addr1Balance = await hardhatToken.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(5);

            const addr2Balance = await hardhatToken.balanceOf(addr2.address);
            expect(addr2Balance).to.equal(10);
        })
    })
})