const assert = require('assert');
const ganache = require('ganache-cli');
const { it } = require('mocha');
const Web3 = require('web3');
const { abi, evm } = require('../compile')

const web3 = new Web3(ganache.provider())

let lottery
let accounts

console.log('Начинаю тесты');

beforeEach(async () => {
  accounts = await web3.eth.getAccounts()

  lottery = await new web3.eth.Contract(abi)
    .deploy({ data: evm.bytecode.object })
    .send({ from: accounts[0], gas: '1000000' })

})
describe('Lottery Contract', () => {
  it('deploys contract', () => {
    assert.ok(lottery.options.address)
  })

    it('allows enter to contract', async () => {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei('0.02', 'ether')
      })

      const players = await lottery.methods.getPlayers().call({
        from: accounts[0]
      })

      assert.equal(accounts[0], players[0])
      assert.equal(1, players.length)
    })
})