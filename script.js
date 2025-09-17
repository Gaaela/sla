const grid = document.getElementById('grid');

// Cria a grade de 10 linhas por 20 colunas
for (let row = 0; row < 10; row++) {
  for (let col = 0; col < 20; col++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.row = row;
    cell.dataset.col = col;
    grid.appendChild(cell);
  }
}

let draggedBuilding = null;

document.querySelectorAll('.building').forEach(building => {
  building.addEventListener('dragstart', () => {
    draggedBuilding = building;
  });
});

document.querySelectorAll('.cell').forEach(cell => {
  cell.addEventListener('dragover', e => e.preventDefault());

  cell.addEventListener('drop', () => {
    if (!draggedBuilding) return;

    const startRow = parseInt(cell.dataset.row);
    const startCol = parseInt(cell.dataset.col);
    const width = parseInt(draggedBuilding.dataset.width);
    const height = parseInt(draggedBuilding.dataset.height);

    if (startCol + width > 20 || startRow + height > 10) {
      alert('Essa construção não cabe aqui!');
      return;
    }

    // Verifica se espaço está livre
    let canPlace = true;
    for (let r = startRow; r < startRow + height; r++) {
      for (let c = startCol; c < startCol + width; c++) {
        const target = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
        if (!target || target.children.length > 0) {
          canPlace = false;
          break;
        }
      }
    }

    if (!canPlace) {
      alert('Esse espaço já está ocupado!');
      return;
    }

    // Cria bloco único
    const block = document.createElement('div');
    block.style.position = 'absolute';
    block.style.width = `${width * 40}px`;
    block.style.height = `${height * 40}px`;
    block.style.backgroundColor = draggedBuilding.style.backgroundColor;
    block.style.border = '2px solid #000';
    block.innerText = draggedBuilding.innerText;
    block.style.color = '#000';
    block.style.fontSize = '12px';
    block.style.textAlign = 'center';
    block.style.lineHeight = `${height * 40}px`;

    block.addEventListener('click', () => {
      if (confirm('Remover esta construção?')) {
        block.remove();
      }
    });

    const targetCell = document.querySelector(`.cell[data-row="${startRow}"][data-col="${startCol}"]`);
    targetCell.appendChild(block);
  });
});
function resetGrid() {
  document.querySelectorAll('.cell').forEach(cell => {
    cell.innerHTML = '';
  });
}

function saveLayout() {
  const layout = [];

  document.querySelectorAll('.cell').forEach(cell => {
    if (cell.children.length > 0) {
      const block = cell.children[0];
      layout.push({
        row: cell.dataset.row,
        col: cell.dataset.col,
        text: block.innerText,
        color: block.style.backgroundColor,
        width: block.style.width,
        height: block.style.height
      });
    }
  });

  localStorage.setItem('spiritfarerLayout', JSON.stringify(layout));
  alert('Layout salvo com sucesso!');
}

function loadLayout() {
  resetGrid();

  const layout = JSON.parse(localStorage.getItem('spiritfarerLayout'));
  if (!layout) {
    alert('Nenhum layout salvo encontrado.');
    return;
  }

  layout.forEach(item => {
    const cell = document.querySelector(`.cell[data-row="${item.row}"][data-col="${item.col}"]`);
    const block = document.createElement('div');
    block.style.position = 'absolute';
    block.style.width = item.width;
    block.style.height = item.height;
    block.style.backgroundColor = item.color;
    block.style.border = '2px solid #000';
    block.innerText = item.text;
    block.style.color = '#000';
    block.style.fontSize = '12px';
    block.style.textAlign = 'center';
    block.style.lineHeight = item.height;

    block.addEventListener('click', () => {
      if (confirm('Remover esta construção?')) {
        block.remove();
      }
    });

    cell.appendChild(block);
  });
}
function exportLayout() {
  html2canvas(document.getElementById('grid')).then(canvas => {
    const link = document.createElement('a');
    link.download = 'spiritfarer-layout.png';
    link.href = canvas.toDataURL();
    link.click();
  });
}
