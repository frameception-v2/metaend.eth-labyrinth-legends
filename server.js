require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { generateDungeon } = require('./src/game/dungeon');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET = process.env.JWT_SECRET;

// JWT verification middleware
function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
}

app.use(cors());
app.use(express.json());

// Game initialization endpoint
app.post('/api/start', (req, res) => {
  try {
    const dungeon = generateDungeon();
    const token = jwt.sign({
      player: { hp: 100, atk: 10, def: 5 },
      dungeon,
      currentRoom: 0
    }, SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error('Start error:', error);
    res.status(500).json({ error: 'Failed to initialize game' });
  }
});

// Movement handling endpoint
app.post('/api/move', (req, res) => {
  try {
    const state = verifyToken(req.body.token);
    const direction = req.body.direction.toLowerCase();
    const currentRoom = state.dungeon[state.currentRoom];
    
    if (!currentRoom.exits.includes(direction)) {
      return res.status(400).json({ error: 'Invalid direction' });
    }

    state.currentRoom = (state.currentRoom + 1) % state.dungeon.length;
    
    const token = jwt.sign(state, SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Move error:', error);
    res.status(401).json({ error: 'Invalid session' });
  }
});

// Combat handling endpoint
app.post('/api/battle', (req, res) => {
  try {
    const state = verifyToken(req.body.token);
    
    // Simple damage calculation: player ATK - enemy DEF (min 1 damage)
    const damage = Math.max(1, state.player.atk - (state.enemy?.def || 0));
    state.enemy.hp -= damage;
    
    // Update and return new state
    const token = jwt.sign(state, SECRET, { expiresIn: '1h' });
    res.json({ token, damage });
  } catch (error) {
    console.error('Battle error:', error);
    res.status(401).json({ error: 'Invalid combat session' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
