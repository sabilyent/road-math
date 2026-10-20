// MathEngine.js - Penjana soalan matematik adaptif untuk kanak-kanak umur 4-7 tahun

const EMOJIS = ['🍎', '🌟', '🚗', '🧁', '⚽', '🍦', '🍩', '🎈'];

export class MathEngine {
  constructor(saveManager) {
    this.saveManager = saveManager;
  }

  getRandomEmoji() {
    return EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
  }

  // Menjana soalan mengikut operasi dan tahap kesukaran pemain
  generateQuestion(operationType = 'random', specificDiff = null) {
    const profile = this.saveManager.data.mathProfile;
    const availableOps = ['addition', 'subtraction', 'multiplication', 'division'];
    
    let op = operationType;
    if (op === 'random') {
      // Untuk tahap awal (level 1), lebihkan tambah & tolak
      if (profile.level === 1) {
        op = Math.random() < 0.65 ? 'addition' : 'subtraction';
      } else {
        op = availableOps[Math.floor(Math.random() * availableOps.length)];
      }
    }

    const diff = specificDiff || (profile.operations[op]?.difficulty || 1);
    let a, b, answer, symbol, textFormula, visualAid = '';
    const emoji = this.getRandomEmoji();

    switch (op) {
      case 'addition':
        symbol = '+';
        if (diff === 1) {
          // Tambah asas 1 hingga 5
          a = Math.floor(Math.random() * 4) + 1;
          b = Math.floor(Math.random() * 4) + 1;
        } else if (diff === 2) {
          // Tambah hingga 10
          a = Math.floor(Math.random() * 6) + 2;
          b = Math.floor(Math.random() * 6) + 1;
        } else {
          // Tambah hingga 20
          a = Math.floor(Math.random() * 10) + 5;
          b = Math.floor(Math.random() * 9) + 2;
        }
        answer = a + b;
        textFormula = `${a} + ${b} = ?`;
        visualAid = `${emoji.repeat(a)}  ➕  ${emoji.repeat(b)}`;
        break;

      case 'subtraction':
        symbol = '-';
        if (diff === 1) {
          // Tolak nombor kecil, hasil sentiasa positif
          b = Math.floor(Math.random() * 3) + 1;
          answer = Math.floor(Math.random() * 4) + 1;
          a = answer + b; // Memastikan a > b
        } else if (diff === 2) {
          b = Math.floor(Math.random() * 5) + 1;
          answer = Math.floor(Math.random() * 7) + 1;
          a = answer + b;
        } else {
          b = Math.floor(Math.random() * 9) + 2;
          answer = Math.floor(Math.random() * 10) + 2;
          a = answer + b;
        }
        textFormula = `${a} - ${b} = ?`;
        visualAid = `Ada ${emoji.repeat(a)}, tolak ${b} ${emoji}! Berapa baki?`;
        break;

      case 'multiplication':
        symbol = '×';
        if (diff === 1) {
          // Sifir 2 & 3 mudah
          a = Math.floor(Math.random() * 2) + 2; // 2 atau 3
          b = Math.floor(Math.random() * 3) + 1; // 1 hingga 3
        } else {
          a = Math.floor(Math.random() * 4) + 2; // 2 hingga 5
          b = Math.floor(Math.random() * 5) + 1; // 1 hingga 5
        }
        answer = a * b;
        textFormula = `${a} × ${b} = ?`;
        visualAid = `${a} kumpulan ${emoji.repeat(b)}`;
        break;

      case 'division':
        symbol = '÷';
        // Pembahagian sentiasa menghasilkan integer bersih
        const divisor = (diff === 1) ? 2 : (Math.floor(Math.random() * 3) + 2); // bahagi 2 atau 3
        answer = Math.floor(Math.random() * 4) + 1;
        a = answer * divisor;
        b = divisor;
        textFormula = `${a} ÷ ${b} = ?`;
        visualAid = `Bahagikan ${emoji.repeat(a)} sama rata kepada ${b} kawan!`;
        break;
    }

    // Bina 3 pilihan jawapan yang berbeza dan munasabah
    const choices = this.generateChoices(answer);

    return {
      id: 'q_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      operation: op,
      symbol: symbol,
      operandA: a,
      operandB: b,
      answer: answer,
      textFormula: textFormula,
      visualAid: visualAid,
      emoji: emoji,
      choices: choices,
      hint: `Cuba kira dengan teliti: Jawapannya berdekatan dengan nombor ${Math.max(1, answer - 1)} hingga ${answer + 1}!`
    };
  }

  // Menjana soalan pengiraan baki kedai (Shopping)
  generateShoppingQuestion(itemCost, playerCoins) {
    const change = playerCoins - itemCost;
    const choices = this.generateChoices(change);
    return {
      id: 'shop_q_' + Date.now(),
      operation: 'shopping',
      symbol: '-',
      operandA: playerCoins,
      operandB: itemCost,
      answer: change,
      textFormula: `Baki: ${playerCoins} - ${itemCost} = ?`,
      visualAid: `Duit anda: 🪙 ${playerCoins} | Harga: 🪙 ${itemCost}`,
      choices: choices,
      hint: `Tolak harga item daripada jumlah syiling anda!`
    };
  }

  generateChoices(correctAnswer) {
    const choices = new Set([correctAnswer]);
    const deltas = [-2, -1, 1, 2, 3, -3];

    // Shuffle deltas
    for (let i = deltas.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deltas[i], deltas[j]] = [deltas[j], deltas[i]];
    }

    for (const d of deltas) {
      const candidate = correctAnswer + d;
      if (candidate >= 0 && !choices.has(candidate)) {
        choices.add(candidate);
      }
      if (choices.size >= 4) break;
    }

    // Fallback jika belum cukup 4
    let extra = 1;
    while (choices.size < 4) {
      if (!choices.has(correctAnswer + extra) && (correctAnswer + extra) >= 0) {
        choices.add(correctAnswer + extra);
      }
      extra++;
    }

    // Tukar ke array dan shuffle susunan butang
    const choiceArray = Array.from(choices);
    for (let i = choiceArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [choiceArray[i], choiceArray[j]] = [choiceArray[j], choiceArray[i]];
    }
    return choiceArray;
  }
}
