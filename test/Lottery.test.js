const assert = require('assert');
const ganache = require('ganache-cli');
const { it } = require('mocha');
const Web3 = require('web3');
const { interface, bytecode } = require('../compile')

const web3 = new Web3(ganache.provider())

let lottery
let accounts

beforeEach(async () => {
  accounts = await web3.eth.getAccounts()

  lottery = await web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: '1000000'})
})