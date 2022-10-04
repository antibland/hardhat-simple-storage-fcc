import { run, network, ethers } from "hardhat";

// async main

async function main() {
  const simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
  console.log("Deploying contract...");
  const simpleStorage = await simpleStorageFactory.deploy();
  await simpleStorage.deployed();

  console.log(`Deploying contract to ${simpleStorage.address}`);

  if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
    console.log("waiting for 6 blocks to be mined...");
    await simpleStorage.deployTransaction.wait(6); // wait 6 blocks before verify check
    await verify(simpleStorage.address, []);
  }

  const currentValue = await simpleStorage.retrieve();
  console.log(`current value is: ${currentValue}`);

  // Update current value
  const transactionResponse = await simpleStorage.store(7);
  await transactionResponse.wait(1);
  const updatedValue = await simpleStorage.retrieve();
  console.log(`updated value is: ${updatedValue}`);
}

async function verify(contractAddress: string, args: any[]) {
  console.log("Verifying contract...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (error: any) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("Already verified");
    } else {
      console.log(error);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
