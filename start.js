const { ethers } = require('ethers');
const { FHEVM } = require('fhevmjs');

// Set up provider and wallet (replace with actual private keys and RPC URL)
const provider = new ethers.providers.JsonRpcProvider("YOUR_RPC_URL");
const player1 = new ethers.Wallet("PRIVATE_KEY_1", provider);
const player2 = new ethers.Wallet("PRIVATE_KEY_2", provider);

// Initialize FHEVM
const fhe = new FHEVM(provider);

// Game logic
let secretNumber = Math.floor(Math.random() * 100) + 1; // Random number between 1 and 100
let winner = null;

// Encrypt the secret number and players' guesses using FHEVM
const encrypt = async (number, player) => {
    return await fhe.encrypt(number, player.address);  // Encrypt using player's address as key
};

// Function to play a round
const playRound = async (player, guessedNumber) => {
    console.log(`${player.address} guesses: ${guessedNumber}`);

    // Encrypt the player's guess
    const encryptedGuess = await encrypt(guessedNumber, player);
    
    // Encrypt the secret number
    const encryptedSecretNumber = await encrypt(secretNumber, player);

    // Compare the encrypted guesses using homomorphic comparison
    const result = await fhe.compare(encryptedGuess, encryptedSecretNumber);

    if (result === 0) {
        winner = player.address;
        console.log(`🎉 ${winner} wins! The secret number was ${secretNumber}.`);
    } else {
        console.log("Wrong guess, try again!");
    }
};

// Main game loop
(async () => {
    // Player 1's guess
    await playRound(player1, 45);
    if (!winner) await playRound(player2, 70);

    // Continue until there is a winner
})();
