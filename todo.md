- [x] Task 1: Create POST /api/start endpoint  
  File: server.js  
  Action: Create endpoint with JWT response  
  Description: Generate initial GameState with player stats and first room  
  ```javascript
  app.post('/api/start', (req, res) => {
    const dungeon = generateDungeon(); // From Step 3
    const token = jwt.sign({
      player: { hp:100, atk:10, def:5 },
      dungeon,
      currentRoom: 0
    }, SECRET);
    res.json({ token });
  });
  ```

- [x] Task 2: Implement POST /api/move endpoint  
  File: server.js  
  Action: Add direction validation and room updates  
  Description: Handle north/south/east/west inputs  
  ```javascript
  app.post('/api/move', (req, res) => {
    const state = verifyToken(req.body.token);
    const direction = req.body.direction;
    state.currentRoom = getNewRoomIndex(state.currentRoom, direction);
    res.json({ token: jwt.sign(state, SECRET) });
  });
  ```

- [x] Task 3: Create dungeon generator  
  File: src/game/dungeon.js  
  Action: Create module with random room generation  
  ```javascript
  function generateDungeon() {
    const roomCount = 3 + Math.floor(Math.random() * 4);
    return Array.from({length: roomCount}, () => ({
      exits: ['north', 'south', 'east', 'west']
        .filter(() => Math.random() > 0.4)
        .slice(0, Math.max(1))
    }));
  }
  ```

- [x] Task 4: Build combat endpoint  
  File: server.js  
  Action: Add damage calculation logic  
  ```javascript
  app.post('/api/battle', (req, res) => {
    const state = verifyToken(req.body.token);
    const damage = Math.max(1, state.player.atk - (state.enemy?.def || 0));
    state.enemy.hp -= damage;
    const token = jwt.sign(state, SECRET, { expiresIn: '1h' });
    res.json({ token, damage });
  });
  ```

- [ ] Task 5: Implement StartScreen component  
  File: src/components/StartScreen.jsx  
  Action: Create UI with stats display  
  ```jsx
  function StartScreen() {
    return (
      <div>
        <h2>HP: 100 | ATK: 10 | DEF: 5</h2>
        <button onClick={() => fetch('/api/start')}>
          Enter Dungeon
        </button>
      </div>
    );
  }
  ```

- [ ] Task 6: Create RoomScreen navigation  
  File: src/components/RoomScreen.jsx  
  Action: Render directional buttons  
  ```jsx
  function RoomScreen({ exits }) {
    return (
      <div>
        {exits.map(dir => (
          <button 
            key={dir}
            onClick={() => postMove(dir)}
          >
            Go {dir}
          </button>
        ))}
      </div>
    );
  }
  ```

- [ ] Task 7: Add encounter system  
  File: server.js  
  Action: Modify /api/move endpoint  
  ```javascript
  // In /api/move handler:
  const encounterTypes = ['enemy','trap','chest'];
  state.encounter = Math.random() < 0.4 ? 'enemy' : 
    encounterTypes[Math.floor(Math.random() * 3)];
  ```

- [ ] Task 8: Build BattleScreen UI  
  File: src/components/BattleScreen.jsx  
  Action: Create combat interface  
  ```jsx
  function BattleScreen({ enemy }) {
    return (
      <div>
        <h3>{enemy.name} (HP: {enemy.hp})</h3>
        <button onClick={() => postBattle('attack')}>⚔️ Attack</button>
        <button onClick={() => postBattle('defend')}>🛡 Defend</button>
      </div>
    );
  }
  ```

- [ ] Task 9: Implement JWT validation  
  File: middleware/auth.js  
  Action: Create session checker  
  ```javascript
  function validateJWT(req, res, next) {
    try {
      req.gameState = jwt.verify(req.body.token, SECRET);
      next();
    } catch {
      res.status(401).send('Invalid session');
    }
  }
  ```

- [ ] Task 10: Add GameOver conditions  
  File: src/components/GameOver.jsx  
  Action: Create restart flow  
  ```jsx
  function GameOver({ outcome }) {
    return (
      <div>
        <h2>{outcome === 'win' ? 'Escaped!' : 'Defeated!'}</h2>
        <button onClick={restartGame}>Play Again</button>
      </div>
    );
  }
  ```

**Order Logic**:  
1. API endpoints first (Tasks 1-4) enable core functionality  
2. UI components next (Tasks 5-8) for user interaction  
3. State security (Task 9) ensures persistence  
4. Win/lose conditions (Task 10) complete game loop  

**Verification Examples**:  
- Task 1: `curl -X POST localhost:3000/api/start` returns JWT  
- Task 6: UI buttons match current room's exit directions  
- Task 8: Battle buttons reduce enemy HP when clicked  
- Task 9: Tampered tokens return 401 errors
