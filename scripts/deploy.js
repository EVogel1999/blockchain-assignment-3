const main = async () => {
    const [deployer] = await hre.ethers.getSigners();
    const balance = await deployer.getBalance();
  
    console.log("Deploying contracts with account: ", deployer.address);
    console.log("Account balance: ", balance.toString());
  
    const contractFactory = await hre.ethers.getContractFactory("CareerFair");
    const contract = await contractFactory.deploy();
    await contract.deployed();
  
    console.log("Career Fair Contract address: ", contract.address);
};
  
const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
};
  
runMain();