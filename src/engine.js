export const START_BALANCE = 10000;
export function randomInt(max) {
  if (!Number.isInteger(max) || max < 1 || max > 4294967296) throw new Error('Invalid range');
  const limit = Math.floor(4294967296 / max) * max;
  const sample = new Uint32Array(1);
  do { globalThis.crypto.getRandomValues(sample); } while (sample[0] >= limit);
  return sample[0] % max;
}
export function validateBet(bet, balance) { return Number.isFinite(bet) && bet >= 1 && bet <= 1000 && Number.isInteger(bet) && bet <= balance; }
export function settle(balance, bet, multiplier) {
  if (!validateBet(bet, balance) || !Number.isFinite(multiplier) || multiplier < 0) throw new Error('Invalid settlement');
  const payout = Math.round(bet * multiplier * 100) / 100;
  return {balance: Math.round((balance - bet + payout) * 100) / 100, payout, profit: Math.round((payout - bet) * 100) / 100};
}
export const RED = new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);
export function rouletteMultiplier(number, choice) {
  if (!Number.isInteger(number) || number < 0 || number > 36) throw new Error('Invalid roulette result');
  if (choice === 'zero') return number === 0 ? 36 : 0;
  if (number === 0) return 0;
  return ((choice === 'red' && RED.has(number)) || (choice === 'black' && !RED.has(number))) ? 2 : 0;
}
export function diceMultiplier(roll, threshold) { if (threshold < 10 || threshold > 90) throw new Error('Invalid threshold'); return roll < threshold ? 0.97 * 100 / threshold : 0; }
export function slotMultiplier(symbols) { return symbols.every(s => s === symbols[0]) ? (symbols[0] === '💎' ? 20 : 8) : (symbols[0] === symbols[1] || symbols[1] === symbols[2] || symbols[0] === symbols[2]) ? 1.5 : 0; }
export function mineMultiplier(safeCount, mines = 3) { let probability = 1; for(let i=0;i<safeCount;i++) probability *= (25-mines-i)/(25-i); return safeCount === 0 ? 1 : 0.97 / probability; }
export function blackjackScore(hand) { let total=0, aces=0; for(const c of hand) { if(c.rank===1){total+=11;aces++;}else total+=Math.min(c.rank,10); } while(total>21 && aces>0){total-=10;aces--;} return total; }
export function blackjackMultiplier(player, dealer) { const p=blackjackScore(player), d=blackjackScore(dealer); if(p>21)return 0; if(d>21 || p>d)return 2; return p===d?1:0; }
export function shuffledDeck() { const deck = []; for(const suit of ['♠','♥','♣','♦']) for(let rank=1;rank<=13;rank++)deck.push({suit,rank}); for(let i=deck.length-1;i>0;i--){const j=randomInt(i+1);[deck[i],deck[j]]=[deck[j],deck[i]];}return deck; }
