### 1. Core Functionality
**Main User Flow**  
1. Start game with character stats (HP/ATK/DEF)  
2. Navigate dungeon rooms via directional buttons  
3. Encounter random events (combat/trap/treasure)  
4. Resolve combat with attack/defend choices  
5. Collect loot and progress until death/escape  

**Required API Endpoints**  
- `POST /api/start`: Initialize new game state  
- `POST /api/move`: Handle room transitions  
- `POST /api/battle`: Process combat mechanics  

**Key Data Structures**  
```typescript
type GameState = {
  player: {
    hp: number
    atk: number
    def: number
    inventory: string[]
  }
  currentRoom: number
  dungeon: Room[]
}

interface Room {
  exits: Direction[]
  encounter?: 'enemy' | 'trap' | 'chest'
  enemy?: EnemyStats
  treasure?: string
}

type Direction = 'north' | 'south' | 'east' | 'west'
```

### 2. Implementation Approach  
**Frame Structure**  
- Start Screen: Character stats + "Enter Dungeon" button  
- Room Screen: Description + movement buttons  
- Encounter Screen: Enemy stats + action buttons (⚔️ Attack/🛡 Defend)  
- Game Over Screen: Result + restart button  

**External Integration**  
- Decentralized dungeon generation using `Math.random()`  
- Optional: NFT metadata for special loot (via OpenSea API)  

**State Management**  
- Use Frame v2 `signed_message` for JWT-encoded game state  
- Session storage pattern:  
  ```ts
  // Serialization example
  const serializeState = (state: GameState) => 
    Buffer.from(JSON.stringify(state)).toString('base64')
  ```

### 3. Technical Considerations  
**Authentication**  
- Frame message signature validation for state integrity  
- No external API credentials needed for core gameplay  

**Critical Error Scenarios**  
1. Invalid/missing state token  
   - Recovery: Reset game with error message frame  
2. No valid exits in current room  
   - Prevention: Generate at least 1 exit during room creation  
3. Missing encounter resolution  
   - Fallback: Default to "enemy fled" outcome  

**Combat Resolution Logic**  
```typescript
const calculateDamage = (attackerATK: number, defenderDEF: number) => {
  const baseDamage = attackerATK - defenderDEF
  return Math.max(1, baseDamage + Math.floor(Math.random() * 3))
}
```  

This spec focuses on delivering core dungeon crawl mechanics while leveraging Frame v2's state management capabilities. The design allows expansion with additional encounter types and loot systems while maintaining compatibility with Farcaster's security model.