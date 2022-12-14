import { ethers } from "hardhat";
import { assert } from "chai";
import { SimpleStorage, SimpleStorage__factory } from "../typechain-types";

describe("SimpleStorage", () => {
  let simpleStorageFactory: SimpleStorage__factory;
  let simpleStorage: SimpleStorage;

  beforeEach(async () => {
    simpleStorageFactory = (await ethers.getContractFactory(
      "SimpleStorage"
    )) as SimpleStorage__factory;
    simpleStorage = await simpleStorageFactory.deploy();
  });

  it("should start with a favorite number of 0", async () => {
    const currentValue = await simpleStorage.retrieve();
    const expectedValue = "0";
    assert.equal(currentValue.toString(), expectedValue);
  });

  it("should update when we call store", async () => {
    const expectedValue = "8";
    const transactionResponse = await simpleStorage.store(expectedValue);
    transactionResponse.wait(1);
    const updatedValue = await simpleStorage.retrieve();
    assert.equal(updatedValue.toString(), expectedValue);
  });

  it("should add a person and their favorite number", async () => {
    const expectedValue = "11";
    const expectedName = "John";
    const transactionResponse = await simpleStorage.addPerson(
      expectedName,
      expectedValue
    );
    transactionResponse.wait(6);

    const johnValue = await simpleStorage.nameToFavoriteNumber(expectedName);
    const peopleSize = await simpleStorage.peopleSize();

    assert.equal(peopleSize, 1);
    assert.equal(johnValue.toString(), expectedValue);
  });
});
