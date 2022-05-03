const { assert } = require('chai')

const Donation = artifacts.require('./Donation.sol')

require('chai').use(require('chai-as-promised')).should()

contract('Donation', ([deployer, author, tipper]) => {
  let donation

  before(async () => {
    donation = await Donation.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await donation.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await donation.name()
      assert.equal(name, 'Donation')
    })
  })

  describe('event', async () => {
    let result, eventCount
    const hash = 'abcd123'

    before(async () => {
      result = await donation.uploadEvent(hash, 'testTitle', 'testDesc', {
        from: author,
      })
      eventCount = await donation.eventCount()
    })

    it('create an event', async () => {
      const event = result.logs[0].args

      //Success Scenarios
      assert.equal(eventCount, 1)
      assert.equal(event.id.toNumber(), eventCount.toNumber(), 'ID is correct')
      assert.equal(event.hash, hash, 'Hash is correct')
      assert.equal(event.title, 'testTitle', 'Title is correct')
      assert.equal(event.description, 'testDesc', 'Description is correct')
      assert.equal(event.tipAmount, '0', 'Tip is correct')
      assert.equal(event.author, author, 'Author is correct')

      //Failure Scenarios
      await donation.uploadEvent('', 'testTitle', 'testDesc', { from: author })
        .should.be.rejected
      await donation.uploadEvent('abcd123', '', 'testDesc', { from: author })
        .should.be.rejected
      await donation.uploadEvent('abcd123', 'testTitle', '', { from: author })
        .should.be.rejected
    })

    it('lists events', async () => {
      const event = await donation.events(eventCount)
      assert.equal(event.id.toNumber(), eventCount.toNumber(), 'ID is correct')
      assert.equal(event.hash, hash, 'Hash is correct')
      assert.equal(event.title, 'testTitle', 'Title is correct')
      assert.equal(event.description, 'testDesc', 'Description is correct')
      assert.equal(event.tipAmount, '0', 'Tip is correct')
      assert.equal(event.author, author, 'Author is correct')
    })

    it('tip event', async () => {
      let oldAuthorBalance
      oldAuthorBalance = await web3.eth.getBalance(author)
      oldAuthorBalance = new web3.utils.BN(oldAuthorBalance)

      result = await donation.tipEventOwner(eventCount, {
        from: tipper,
        value: web3.utils.toWei('1', 'Ether'),
      })
      const event = result.logs[0].args

      //Success Scenarios
      assert.equal(event.id.toNumber(), eventCount.toNumber(), 'ID is correct')
      assert.equal(event.hash, hash, 'Hash is correct')
      assert.equal(event.title, 'testTitle', 'Title is correct')
      assert.equal(event.description, 'testDesc', 'Description is correct')
      assert.equal(event.tipAmount, '1000000000000000000', 'Tip is correct')
      assert.equal(event.author, author, 'Author is correct')

      //Check that author received funds
      let newAuthorBalance
      newAuthorBalance = await web3.eth.getBalance(author)
      newAuthorBalance = new web3.utils.BN(newAuthorBalance)

      let tipEventOwner
      tipEventOwner = web3.utils.toWei('1', 'Ether')
      tipEventOwner = new web3.utils.BN(tipEventOwner)

      const expectedBalance = oldAuthorBalance.add(tipEventOwner)

      assert.equal(newAuthorBalance.toString(), expectedBalance.toString())

      //Failure Scenarios
      await donation.tipEventOwner(99, {
        from: tipper,
        value: web3.utils.toWei('1', 'Ether'),
      }).should.be.rejected
    })
  })
})
