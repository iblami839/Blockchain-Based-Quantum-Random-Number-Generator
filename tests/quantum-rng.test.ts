import { describe, it, beforeEach, expect, vi } from 'vitest';

// Simulated contract state
let lastRandomNumber: number;
let nonce: number;
const CONTRACT_OWNER = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';

// Mock blockchain functions
const mockGetBlockInfo = vi.fn();
const mockPrincipalToUint256 = vi.fn();

// Simulated contract functions
function simulateQuantumEffect(): number {
  const blockHash = mockGetBlockInfo('id-header-hash', 0);
  return (blockHash.length + nonce) % 256;
}

function generateRandomNumber(sender: string, maxValue: number): { success: boolean; result?: number; error?: string } {
  if (maxValue <= 0) {
    return { success: false, error: "Invalid input" };
  }
  
  const quantumEffect = simulateQuantumEffect();
  const blockTime = mockGetBlockInfo('time', 0);
  const senderAddress = mockPrincipalToUint256(sender);
  
  const randomSeed = quantumEffect ^ blockTime ^ senderAddress;
  const randomNumber = randomSeed % maxValue;
  
  lastRandomNumber = randomNumber;
  nonce++;
  
  return { success: true, result: randomNumber };
}

function getLastRandomNumber(): number {
  return lastRandomNumber;
}

function resetNonce(sender: string): { success: boolean; error?: string } {
  if (sender !== CONTRACT_OWNER) {
    return { success: false, error: "Not authorized" };
  }
  nonce = 0;
  return { success: true };
}

function getNonce(): number {
  return nonce;
}

describe('Quantum Random Number Generator Contract', () => {
  beforeEach(() => {
    lastRandomNumber = 0;
    nonce = 0;
    mockGetBlockInfo.mockReset();
    mockPrincipalToUint256.mockReset();
  });
  
  it('should generate a random number within the specified range', () => {
    mockGetBlockInfo.mockReturnValueOnce('mock-block-hash');
    mockGetBlockInfo.mockReturnValueOnce(1234567);
    mockPrincipalToUint256.mockReturnValue(9876543);
    
    const maxValue = 100;
    const result = generateRandomNumber(CONTRACT_OWNER, maxValue);
    
    expect(result.success).toBe(true);
    expect(result.result).toBeDefined();
    expect(result.result).toBeGreaterThanOrEqual(0);
    expect(result.result).toBeLessThan(maxValue);
  });
  
  it('should fail to generate a random number with invalid input', () => {
    const result = generateRandomNumber(CONTRACT_OWNER, 0);
    
    expect(result.success).toBe(false);
    expect(result.error).toBe("Invalid input");
  });
  
  it('should update last random number after generation', () => {
    mockGetBlockInfo.mockReturnValueOnce('mock-block-hash');
    mockGetBlockInfo.mockReturnValueOnce(1234567);
    mockPrincipalToUint256.mockReturnValue(9876543);
    
    const maxValue = 100;
    const result = generateRandomNumber(CONTRACT_OWNER, maxValue);
    const lastNumber = getLastRandomNumber();
    
    expect(result.success).toBe(true);
    expect(lastNumber).toBe(result.result);
  });
  
  it('should increment nonce after generating a random number', () => {
    mockGetBlockInfo.mockReturnValueOnce('mock-block-hash');
    mockGetBlockInfo.mockReturnValueOnce(1234567);
    mockPrincipalToUint256.mockReturnValue(9876543);
    
    const initialNonce = getNonce();
    generateRandomNumber(CONTRACT_OWNER, 100);
    const newNonce = getNonce();
    
    expect(newNonce).toBe(initialNonce + 1);
  });
  
  it('should allow contract owner to reset nonce', () => {
    nonce = 10;
    const result = resetNonce(CONTRACT_OWNER);
    
    expect(result.success).toBe(true);
    expect(getNonce()).toBe(0);
  });
  
  it('should not allow non-owner to reset nonce', () => {
    nonce = 10;
    const result = resetNonce('ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG');
    
    expect(result.success).toBe(false);
    expect(result.error).toBe("Not authorized");
    expect(getNonce()).toBe(10);
  });
  
  it('should generate different numbers for different inputs', () => {
    mockGetBlockInfo.mockReturnValueOnce('mock-block-hash-1');
    mockGetBlockInfo.mockReturnValueOnce(1234567);
    mockPrincipalToUint256.mockReturnValue(9876543);
    
    const result1 = generateRandomNumber(CONTRACT_OWNER, 1000);
    
    mockGetBlockInfo.mockReturnValueOnce('mock-block-hash-2');
    mockGetBlockInfo.mockReturnValueOnce(7654321);
    mockPrincipalToUint256.mockReturnValue(3456789);
    
    const result2 = generateRandomNumber(CONTRACT_OWNER, 1000);
    
    expect(result1.result).not.toBe(result2.result);
  });
});

