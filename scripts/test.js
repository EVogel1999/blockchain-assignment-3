const main = async () => {
    const [owner, randomPerson] = await hre.ethers.getSigners();
    const CareerFairFactory = await hre.ethers.getContractFactory('CareerFair');
    const careerFairContract = await CareerFairFactory.deploy();
    await careerFairContract.deployed();
    console.log('Contract deployed to:', careerFairContract.address);
  
    await testEnroll(careerFairContract);
    await testAdd(careerFairContract, randomPerson);
    careerFairContract.connect(owner);
    await testGetAttendees(careerFairContract);
    await testUnenroll(careerFairContract);
  };
  
  async function testEnroll(contract) {
    console.log('Testing enroll():');

    await contract.enroll().then(_ => console.log('1. Enrolled correctly'));
    await contract.enroll().catch(_ => console.log('2. Could not enroll because already enrolled'));
    console.log();
  }
  
  async function testAdd(contract, notOwner) {
    console.log('Testing add(companyName):');

    await contract.add('Audius').then(_ => console.log('1. Added company that doesn\'t exist'));
    await contract.add('Google').catch(_ => console.log('2. Could not add company that already exists'));
    await contract.connect(notOwner).add('CACI').catch(_ => console.log('3. Caught random person trying to add a company'));
    console.log();
  }
  
  async function testGetAttendees(contract) {
    console.log('Testing getAttendees():');

    await contract.getAttendees().then(result => console.log('1. Got a list of registered students\n', result));
    console.log();
  }
  
  async function testUnenroll(contract) {
    console.log('Testing unenroll():');

    await contract.unenroll().then(_ => console.log('1. Unenrolled correctly'));
    await contract.unenroll().catch(_ => console.log('2. Could not unenroll because already unenrolled'));
  }
  
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