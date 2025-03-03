### Step 1: Initialize Game State and Start API
```text
- Build: POST /api/start endpoint that creates initial GameState with player stats (HP:100, ATK:10, DEF:5) and first room with 1+ exits
- Outcome: Curl test returns 200 with JWT containing valid initial state:
  curl -X POST http://localhost:3000/api/start
```

### Step 2: Basic Room Navigation and Move API
```text
- Build: POST /api/move endpoint handling direction input, updating currentRoom index
- Outcome: After 2 moves via curl, state shows currentRoom increments/decrements based on direction
```

### Step 3: Dungeon Generation with Random Exits
```text
- Build: Room generator creating 3-6 rooms with random exits (minimum 1 exit/room) using Math.random()
- Outcome: Moving through 5 rooms shows different exit configurations in state.dungeon
```

### Step 4: Combat Resolution System
```text
- Build: POST /api/battle endpoint implementing calculateDamage() for attack/defend actions
- Outcome: Attack reduces enemy HP by ATK-DEF±1, Defend reduces damage by 30% in state
```

### Step 5: Start Screen Frame
```text
- Build: Initial frame showing character stats and "Enter Dungeon" button triggering /api/start
- Outcome: Visual confirmation of stats display and button starting new game
```

### Step 6: Core Room Navigation UI
```text
- Build: Room screen showing exits as directional buttons that POST to /api/move
- Outcome: Can navigate 3+ rooms through UI buttons with state-preserved progression
```

### Step 7: Basic Encounter Handling
```text
- Build: Random encounter generation (40% enemy, 30% trap, 30% chest) when entering rooms
- Outcome: State.encounter populated appropriately, UI shows encounter type after move
```

### Step 8: Combat UI and Flow
```text
- Build: Battle frame with enemy stats, ⚔️/🛡 buttons that POST to /api/battle
- Outcome: Complete combat sequence possible through UI with HP updates visible
```

### Step 9: State Serialization and Validation
```text
- Build: JWT state encoding using Frame's signed_message with session validation middleware
- Outcome: Modified JWT tokens get rejected, valid sessions persist through 5+ actions
```

### Step 10: Game Over Conditions
```text
- Build: HP<=0 detection and escape condition (reach room 5) with restart button
- Outcome: Dying or escaping shows game over screen and restart creates fresh state
```