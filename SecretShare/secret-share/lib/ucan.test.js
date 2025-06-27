import { describe, it, expect } from 'vitest'
import { generateUCAN } from './ucan.js'
import * as UCAN from '@ucanto/core'
import * as Signer from '@ucanto/principal/ed25519'

describe('generateUCAN', () => {
  it('test_generateUCAN_valid_parameters', async () => {
    // Generate a valid audience DID
    const audienceSigner = await Signer.generate()
    const audience = audienceSigner.did()
    const cid = 'bafybeigdyrzt4x2l5w4q6j7z6y5k3z6w5w4q6j7z6y5k3z6w5w4q6j7z6y'
    const expiresInSeconds = 3600
    const usageLimit = 5

    const encodedUCAN = await generateUCAN({
      audience,
      cid,
      expiresInSeconds,
      usageLimit
    })

    // Decode the UCAN to verify its structure
    const decodedUCAN = UCAN.decode(encodedUCAN)

    expect(decodedUCAN.payload.aud).toBe(audience)
    expect(decodedUCAN.payload.exp).toBeGreaterThan(Math.floor(Date.now() / 1000))
    expect(decodedUCAN.payload.att).toBeInstanceOf(Array)
    expect(decodedUCAN.payload.att[0].with).toBe(`storage://${cid}`)
    expect(decodedUCAN.payload.att[0].can).toBe('access/secret')
    expect(decodedUCAN.payload.att[0].nb.usage).toBe(usageLimit)
    expect(decodedUCAN.payload.att[0].nb.expiration).toBe(decodedUCAN.payload.exp)
  })

  it('test_generateUCAN_token_contains_expected_capabilities_and_expiration', async () => {
    // Arrange
    const audienceSigner = await Signer.generate()
    const audience = audienceSigner.did()
    const cid = 'bafybeihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku'
    const expiresInSeconds = 7200
    const usageLimit = 10

    // Act
    const encodedUCAN = await generateUCAN({
      audience,
      cid,
      expiresInSeconds,
      usageLimit
    })
    const decodedUCAN = UCAN.decode(encodedUCAN)

    // Assert
    expect(decodedUCAN.payload.aud).toBe(audience)
    expect(decodedUCAN.payload.exp).toBeGreaterThan(Math.floor(Date.now() / 1000))
    expect(decodedUCAN.payload.att).toBeInstanceOf(Array)
    expect(decodedUCAN.payload.att[0].with).toBe(`storage://${cid}`)
    expect(decodedUCAN.payload.att[0].can).toBe('access/secret')
    expect(decodedUCAN.payload.att[0].nb.usage).toBe(usageLimit)
    expect(decodedUCAN.payload.att[0].nb.expiration).toBe(decodedUCAN.payload.exp)
  })
})