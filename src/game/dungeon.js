function generateDungeon() {
  const roomCount = 3 + Math.floor(Math.random() * 4); // 3-6 rooms
  return Array.from({length: roomCount}, (_, i) => ({
    exits: ['north', 'south', 'east', 'west']
      .filter(() => Math.random() > 0.4) // 40% chance per direction
      .slice(0, Math.max(1, Math.floor(Math.random() * 3))) // 1-3 exits
  }));
}

module.exports = { generateDungeon };
