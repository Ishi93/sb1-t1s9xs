import { GameState, CardEffect, AIState } from '../types/game';
import { Card } from '../types/cards';

export class CPUAI {
  private state: AIState;
  
  constructor(difficulty: AIState['difficulty'] = 'medium') {
    this.state = {
      difficulty,
      strategy: 'balanced',
      memory: {
        playerPlayStyle: [],
        cardsPlayed: [],
        successfulCombos: []
      }
    };
  }

  evaluateGameState(gameState: GameState): void {
    // Analyze current game state
    const playerHealth = gameState.players.player1?.life || 0;
    const cpuHealth = gameState.players.cpu?.life || 0;
    
    // Adjust strategy based on health difference
    if (cpuHealth < playerHealth * 0.5) {
      this.state.strategy = 'aggressive';
    } else if (cpuHealth > playerHealth * 1.5) {
      this.state.strategy = 'defensive';
    } else {
      this.state.strategy = 'balanced';
    }
  }

  calculateCardValue(card: Card, gameState: GameState): number {
    let value = 0;

    // Base value calculations
    if (card.type === 'creature') {
      value += (card.power || 0) + (card.defense || 0);
    }

    // Strategic value based on current strategy
    switch (this.state.strategy) {
      case 'aggressive':
        value += card.type === 'creature' ? (card.power || 0) * 1.5 : 0;
        break;
      case 'defensive':
        value += card.type === 'creature' ? (card.defense || 0) * 1.5 : 0;
        break;
      case 'balanced':
        // Consider both aspects equally
        break;
    }

    // Synergy calculations
    const synergies = this.calculateSynergies(card, gameState);
    value += synergies;

    return value;
  }

  private calculateSynergies(card: Card, gameState: GameState): number {
    let synergyValue = 0;
    const cpuField = gameState.players.cpu?.field || [];

    // Check for deck type synergies
    const sameTypeCards = cpuField.filter(c => c === card.deck).length;
    synergyValue += sameTypeCards * 0.5;

    // Check for successful combo history
    const hasSuccessfulCombo = this.state.memory.successfulCombos.includes(card.id);
    if (hasSuccessfulCombo) {
      synergyValue += 1;
    }

    return synergyValue;
  }

  selectBestPlay(hand: Card[], gameState: GameState): Card | null {
    if (hand.length === 0) return null;

    return hand.reduce((best, current) => {
      const currentValue = this.calculateCardValue(current, gameState);
      const bestValue = best ? this.calculateCardValue(best, gameState) : -1;
      return currentValue > bestValue ? current : best;
    }, null as Card | null);
  }

  selectAttackTarget(attackers: Card[], defenders: Card[], gameState: GameState): { attacker: Card, target: Card | 'player' } | null {
    if (attackers.length === 0) return null;

    // For each attacker, find the most advantageous attack
    const attacks = attackers.map(attacker => {
      if (defenders.length === 0) {
        return { attacker, target: 'player', value: this.evaluatePlayerAttack(attacker, gameState) };
      }

      const targets = defenders.map(defender => ({
        defender,
        value: this.evaluateCombat(attacker, defender, gameState)
      }));

      const bestTarget = targets.reduce((best, current) => 
        current.value > best.value ? current : best
      );

      return { attacker, target: bestTarget.defender, value: bestTarget.value };
    });

    // Select the most valuable attack
    const bestAttack = attacks.reduce((best, current) => 
      current.value > best.value ? current : best
    );

    return {
      attacker: bestAttack.attacker,
      target: bestAttack.target
    };
  }

  private evaluatePlayerAttack(attacker: Card, gameState: GameState): number {
    const playerHealth = gameState.players.player1?.life || 0;
    const damage = attacker.power || 0;

    // Higher value if can defeat player
    if (damage >= playerHealth) return 1000;

    // Base value is damage dealt
    return damage;
  }

  private evaluateCombat(attacker: Card, defender: Card, gameState: GameState): number {
    const attackerPower = attacker.power || 0;
    const attackerDefense = attacker.defense || 0;
    const defenderPower = defender.power || 0;
    const defenderDefense = defender.defense || 0;

    // Calculate trade value
    let value = 0;

    // Favorable trade (we kill them, they don't kill us)
    if (attackerPower >= defenderDefense && defenderPower < attackerDefense) {
      value += 100;
    }

    // Even trade (both die)
    if (attackerPower >= defenderDefense && defenderPower >= attackerDefense) {
      value += 50;
    }

    // Unfavorable trade (they kill us, we don't kill them)
    if (attackerPower < defenderDefense && defenderPower >= attackerDefense) {
      value -= 100;
    }

    // Adjust based on relative card values
    const attackerValue = this.calculateCardValue(attacker, gameState);
    const defenderValue = this.calculateCardValue(defender, gameState);
    value += (defenderValue - attackerValue) * 10;

    return value;
  }

  updateMemory(action: string, result: boolean): void {
    if (result) {
      this.state.memory.successfulCombos.push(action);
    }
  }
}