;; Blockchain-Based Quantum Random Number Generator

;; Define data vars
(define-data-var last-random-number uint u0)
(define-data-var nonce uint u0)

;; Define constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_NOT_AUTHORIZED (err u100))
(define-constant ERR_INVALID_INPUT (err u101))

;; Simulate quantum effect
(define-private (simulate-quantum-effect)
  (let ((block-hash (unwrap-panic (get-block-info? id-header-hash u0))))
    (mod (+ (len block-hash) (var-get nonce)) u256)))

;; Generate random number
(define-public (generate-random-number (max-value uint))
  (begin
    (asserts! (> max-value u0) ERR_INVALID_INPUT)
    (let ((quantum-effect (simulate-quantum-effect))
          (block-time (unwrap-panic (get-block-info? time u0)))
          (sender-address (unwrap-panic (principal-to-uint256 tx-sender))))
      (let ((random-seed (xor quantum-effect (xor block-time sender-address))))
        (let ((random-number (mod random-seed max-value)))
          (var-set last-random-number random-number)
          (var-set nonce (+ (var-get nonce) u1))
          (ok random-number))))))

;; Get the last generated random number
(define-read-only (get-last-random-number)
  (ok (var-get last-random-number)))

;; Reset the nonce (only contract owner)
(define-public (reset-nonce)
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_NOT_AUTHORIZED)
    (var-set nonce u0)
    (ok true)))

;; Get the current nonce
(define-read-only (get-nonce)
  (ok (var-get nonce)))

