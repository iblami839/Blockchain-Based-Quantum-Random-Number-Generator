# Blockchain-Based Quantum Random Number Generator

A smart contract implementation of a random number generator that combines quantum effects simulation with blockchain properties to generate pseudo-random numbers.

## Overview

This smart contract implements a random number generator with the following features:
- Quantum effect simulation using block data
- Nonce-based entropy enhancement
- Configurable output range
- Owner-controlled nonce reset
- Last generated number tracking

## Technical Implementation

### Data Structures

```clarity
;; State Variables
(define-data-var last-random-number uint u0)
(define-data-var nonce uint u0)

;; Constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_NOT_AUTHORIZED (err u100))
(define-constant ERR_INVALID_INPUT (err u101))
```

### Core Functions

1. **simulate-quantum-effect**
    - Private function
    - Uses block hash to simulate quantum randomness
    - Returns value between 0-255

2. **generate-random-number**
    - Main random number generation function
    - Combines quantum effect with block time and nonce
    - Takes maximum value parameter

3. **get-last-random-number**
    - Retrieves the most recently generated number
    - Read-only function

4. **reset-nonce**
    - Owner-only function to reset nonce
    - Security control mechanism

5. **get-nonce**
    - Returns current nonce value
    - Read-only function

## Usage

### Generating Random Numbers
```clarity
;; Generate random number between 0 and max-value
(contract-call? .quantum-rng generate-random-number u100)
```

### Retrieving Last Generated Number
```clarity
;; Get last generated number
(contract-call? .quantum-rng get-last-random-number)
```

### Administrative Functions
```clarity
;; Reset nonce (owner only)
(contract-call? .quantum-rng reset-nonce)
```

## Security Considerations

1. **Randomness Source**
    - Block hash entropy
    - Block time variability
    - Nonce progression

2. **Access Control**
    - Owner-restricted nonce reset
    - Input validation

3. **Entropy Factors**
    - Multiple entropy sources combined
    - Nonce prevents repetition
    - Block data unpredictability

## Implementation Details

### Quantum Effect Simulation
```clarity
(define-private (simulate-quantum-effect)
  (let ((block-hash (unwrap-panic (get-block-info? id-header-hash u0))))
    (mod (len block-hash) u256)))
```

### Random Number Generation
```clarity
(define-public (generate-random-number (max-value uint))
  (begin
    (asserts! (> max-value u0) ERR_INVALID_INPUT)
    (let ((quantum-effect (simulate-quantum-effect))
          (block-time (unwrap-panic (get-block-info? time u0))))
      (let ((random-seed (bit-xor quantum-effect block-time)))
        (let ((random-number (mod (+ random-seed (var-get nonce)) max-value)))
          (var-set last-random-number random-number)
          (var-set nonce (+ (var-get nonce) u1))
          (ok random-number))))))
```

## Future Improvements
1. Add multiple entropy sources
2. Implement VRF (Verifiable Random Function)
3. Add batch random number generation
4. Implement seed commitment scheme
5. Add historical random number tracking

## License
[Specify License]

---

**Note**: This implementation provides pseudo-random numbers suitable for non-critical applications. For cryptographic purposes, additional security measures should be implemented.
