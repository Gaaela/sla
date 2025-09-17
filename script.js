const grid = document.getElementById('grid');

for (let row = 0; row < 10; row++) {
  for (let col = 0; col < 20; col++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    grid.appendChild(cell);
  }
}
