import { ethers } from 'ethers'
import { ENS } from '..'
import { hexEncodeName } from '../utils/hexEncodedName'
import setup from './setup'

let ENSInstance: ENS
let revert: Awaited<ReturnType<typeof setup>>['revert']
let createSnapshot: Awaited<ReturnType<typeof setup>>['createSnapshot']
let provider: ethers.providers.JsonRpcProvider

beforeAll(async () => {
  ;({ ENSInstance, revert, createSnapshot, provider } = await setup())
})

afterAll(async () => {
  await revert()
})

describe('setResolver', () => {
  beforeEach(async () => {
    await revert()
  })
  it('should return a transaction to the registry and set successfully', async () => {
    const tx = await ENSInstance.setResolver(
      'parthtejpal.eth',
      'registry',
      '0xAEfF4f4d8e2cB51854BEa2244B3C5Fb36b41C7fC',
    )
    expect(tx).toBeTruthy()
    await tx.wait()

    const universalResolver =
      await ENSInstance.contracts!.getUniversalResolver()!
    const [result] = await universalResolver.findResolver(
      hexEncodeName('parthtejpal.eth'),
    )
    expect(result).toBe('0xAEfF4f4d8e2cB51854BEa2244B3C5Fb36b41C7fC')
  })
  it('should return a transaction to the namewrapper and set successfully', async () => {
    const accounts = await provider.listAccounts()
    const wrapNameTx = await ENSInstance.wrapName(
      'parthtejpal.eth',
      accounts[0],
    )
    await wrapNameTx.wait()
    const tx = await ENSInstance.setResolver(
      'parthtejpal.eth',
      'nameWrapper',
      '0xAEfF4f4d8e2cB51854BEa2244B3C5Fb36b41C7fC',
    )
    expect(tx).toBeTruthy()
    await tx.wait()

    const universalResolver =
      await ENSInstance.contracts!.getUniversalResolver()!
    const [result] = await universalResolver.findResolver(
      hexEncodeName('parthtejpal.eth'),
    )
    expect(result).toBe('0xAEfF4f4d8e2cB51854BEa2244B3C5Fb36b41C7fC')
  })
})