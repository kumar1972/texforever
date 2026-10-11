// Pre-defined Default Weaves (Without *10 formula)
const preDefinedDesigns = {
    defulat: {
        name: "Default Plain",
        formula: "(1-4)",
        matrix: [
            [0, 1, 0, 1],
            [1, 0, 1, 0],
            [0, 1, 0, 1],
            [1, 0, 1, 0]
        ]
    },
    w_44plain14: {
        name: "4/4 Plain",
        formula: "(1-4)",
        matrix: [
            [0, 1, 0, 1],
            [1, 0, 1, 0],
            [0, 1, 0, 1],
            [1, 0, 1, 0]
        ]
    },
    twill89: {
        name: "2/2 Twill",
        formula: "(1-4)",
        matrix: [
            [0, 0, 1, 1],
            [0, 1, 1, 0],
            [1, 1, 0, 0],
            [1, 0, 0, 1]
        ]
    },
    twill42: {
        name: "2/1 Twill",
        formula: "(1-3)",
        matrix: [
            [0, 1, 1],
            [1, 1, 0],
            [1, 0, 1]
        ]
    },
  "w_4framedesign149": {
    name: "4 frame - design 1",
    formula: "(1-4)",
    matrix: [
        [0, 1, 0, 1],
        [0, 1, 1, 0],
        [1, 0, 1, 0],
        [1, 0, 0, 1]
    ]
},
"w_4framedesign229": {
    name: "4 frame design - 2",
    formula: "(1-4)",
    matrix: [
        [1, 1, 0, 1],
        [0, 1, 1, 0],
        [1, 0, 1, 1],
        [1, 0, 0, 1]
    ]
},
"w_4framedesign380": {
    name: "4 frame design - 3",
    formula: "(1-4)",
    matrix: [
        [1, 1, 0, 0],
        [0, 1, 0, 1],
        [1, 0, 1, 0],
        [1, 0, 0, 1]
    ]
},
"w_4framedesign420": {
    name: "4 frame design - 4",
    formula: "(1-4)",
    matrix: [
        [1, 0, 1, 1],
        [1, 1, 0, 1],
        [1, 1, 0, 0],
        [0, 0, 1, 1]
    ]
},
  "w_4framedesign510": {
    name: "4 frame design - 5",
    formula: "(1-4)",
    matrix: [
        [0, 0, 1, 1],
        [1, 1, 0, 1],
        [1, 1, 0, 0],
        [0, 0, 1, 1]
    ]
},
  "w_4framedesign673": {
    name: "4 frame design - 6",
    formula: "(1-4)",
    matrix: [
        [0, 0, 1, 1],
        [1, 1, 0, 1],
        [1, 1, 0, 0],
        [0, 1, 1, 1]
    ]
},
  "w_4framedesign766": {
    name: "4 frame design - 7",
    formula: "(1-4)",
    matrix: [
        [0, 0, 1, 1],
        [1, 1, 0, 0],
        [0, 1, 0, 1],
        [0, 1, 1, 1]
    ]
},
  "w_4framedesign81": {
    name: "4 frame design - 8",
    formula: "(1-4)",
    matrix: [
        [0, 1, 1, 1],
        [1, 1, 1, 0],
        [1, 0, 0, 0],
        [0, 0, 0, 1]
    ]
},
  "w_4framedesign994": {
    name: "4 frame design - 9",
    formula: "(1-4)",
    matrix: [
        [1, 0, 1, 0],
        [1, 1, 1, 0],
        [0, 1, 0, 0],
        [1, 0, 0, 1]
    ]
},
  "w_4framedesign1082": {
    name: "4 frame design - 10",
    formula: "(1-4)",
    matrix: [
        [1, 0, 1, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 1],
        [0, 0, 0, 1]
    ]
},
  "w_5framedesign134": {
    name: "5 frame design - 1",
    formula: "(1-4)",
    matrix: [
        [1, 1, 0, 1, 1],
        [1, 0, 1, 0, 1],
        [1, 1, 0, 1, 1],
        [0, 0, 1, 0, 0]
    ]
},
  "w_5framedesign225": {
    name: "5 frame design - 2",
    formula: "(1-4)",
    matrix: [
        [1, 0, 0, 1, 0],
        [1, 0, 1, 0, 0],
        [0, 1, 1, 0, 1],
        [0, 1, 0, 1, 1]
    ]
},
  "w_5framedesign259": {
    name: "5 frame design - 3",
    formula: "(1-4)",
    matrix: [
        [0, 0, 0, 1, 1],
        [0, 1, 1, 0, 0],
        [0, 0, 1, 1, 0],
        [1, 1, 0, 0, 0]
    ]
},
  "w_5framedesign496": {
    name: "5 frame design - 4",
    formula: "(1-5)",
    matrix: [
        [1, 0, 0, 1, 1],
        [0, 1, 1, 1, 0],
        [1, 1, 0, 0, 1],
        [0, 0, 1, 1, 1],
        [1, 1, 1, 0, 0]
    ]
},
  "w_5framedesign575": {
    name: "5 frame design - 5",
    formula: "(1-5)",
    matrix: [
        [0, 1, 0, 1, 1],
        [1, 0, 1, 1, 0],
        [0, 1, 1, 0, 1],
        [1, 1, 0, 1, 0],
        [1, 0, 1, 0, 1]
    ]
},
  "w_5framedesign66": {
    name: "5 frame design - 6",
    formula: "(1-5)",
    matrix: [
        [1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0],
        [1, 0, 1, 0, 1],
        [0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1]
    ]
},
  "w_5framedesign775": {
    name: "5 frame design - 7",
    formula: "(1-5)",
    matrix: [
        [1, 1, 1, 0, 0],
        [1, 1, 1, 1, 0],
        [1, 1, 0, 1, 1],
        [0, 1, 1, 1, 1],
        [0, 0, 1, 1, 1]
    ]
},
  "w_5framedesign841": {
    name: "5 frame design - 8",
    formula: "(1-5)",
    matrix: [
        [0, 1, 1, 0, 0],
        [1, 1, 1, 1, 0],
        [1, 1, 0, 1, 1],
        [0, 1, 1, 1, 1],
        [0, 0, 1, 1, 0]
    ]
},
  "w_5framedesign938": {
    name: "5 frame design - 9",
    formula: "(1-5)",
    matrix: [
        [0, 1, 1, 0, 0],
        [1, 0, 1, 1, 0],
        [1, 1, 0, 1, 1],
        [0, 1, 1, 0, 1],
        [0, 0, 1, 1, 0]
    ]
},
  "w_5framedesign1049": {
    name: "5 frame design - 10",
    formula: "(1-5)",
    matrix: [
        [0, 0, 1, 0, 1],
        [0, 0, 1, 1, 0],
        [1, 1, 0, 1, 1],
        [0, 1, 1, 0, 0],
        [1, 0, 1, 0, 0]
    ]
},
  "w_6framedesign158": {
    name: "6 frame design - 1",
    formula: "(1-6)",
    matrix: [
        [1, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 1, 0],
        [0, 0, 0, 1, 0, 1],
        [1, 0, 1, 1, 0, 0],
        [0, 1, 0, 0, 0, 1],
        [1, 0, 1, 0, 1, 1]
    ]
},
  "w_6framedesign266": {
    name: "6 frame design - 2",
    formula: "(1-6)",
    matrix: [
        [1, 0, 0, 0, 0, 1],
        [0, 1, 1, 1, 1, 0],
        [0, 1, 1, 0, 0, 0],
        [0, 1, 0, 1, 0, 0],
        [0, 1, 0, 0, 1, 1],
        [1, 0, 0, 0, 1, 0]
    ]
},
  "w_6framedesign391": {
    name: "6 frame design - 3",
    formula: "(1-7)",
    matrix: [
        [0, 0, 0, 1, 0, 1],
        [0, 0, 1, 0, 1, 1],
        [0, 1, 0, 1, 1, 0],
        [1, 0, 1, 1, 0, 0],
        [0, 1, 1, 0, 0, 1],
        [1, 1, 0, 0, 1, 0],
        [1, 0, 1, 0, 0, 0]
    ]
},
  "w_6framedesign47": {
    name: "6 frame design - 4",
    formula: "(1-12)",
    matrix: [
        [0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 0],
        [1, 0, 1, 0, 0, 0],
        [0, 1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 1],
        [0, 0, 0, 1, 0, 1],
        [0, 0, 1, 1, 1, 0],
        [0, 1, 0, 1, 0, 0],
        [1, 1, 1, 0, 0, 0],
        [0, 1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 0]
    ]
},
  "w_6framedesign565": {
    name: "6 frame design - 5",
    formula: "(1-6)",
    matrix: [
        [0, 0, 0, 1, 0, 1],
        [0, 0, 1, 1, 1, 0],
        [0, 1, 0, 1, 0, 0],
        [1, 1, 1, 0, 0, 0],
        [0, 1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 0]
    ]
},
  "w_6framedesign687": {
    name: "6 frame design - 6",
    formula: "(1-6)",
    matrix: [
        [1, 0, 0, 1, 0, 1],
        [0, 1, 0, 0, 1, 0],
        [0, 0, 1, 1, 0, 1],
        [1, 0, 1, 1, 0, 0],
        [0, 1, 0, 0, 1, 0],
        [1, 0, 1, 0, 0, 1]
    ]
},
  "w_6framedesign739": {
    name: "6 frame design - 7",
    formula: "(1-6)",
    matrix: [
        [1, 0, 0, 1, 0, 1],
        [0, 0, 0, 0, 1, 0],
        [0, 0, 1, 0, 0, 1],
        [1, 0, 0, 1, 0, 0],
        [0, 1, 0, 0, 0, 0],
        [1, 0, 1, 0, 0, 1]
    ]
},
  "w_6framedesign819": {
    name: "6 frame design - 8",
    formula: "(1-6)",
    matrix: [
        [1, 0, 0, 0, 0, 1],
        [0, 1, 0, 0, 1, 0],
        [0, 0, 1, 0, 0, 0],
        [0, 0, 0, 1, 0, 0],
        [0, 1, 0, 0, 1, 0],
        [1, 0, 0, 0, 0, 1]
    ]
},
  "w_6framedesign915": {
    name: "6 frame design - 9",
    formula: "(1-6)",
    matrix: [
        [1, 0, 0, 0, 0, 0],
        [1, 1, 0, 0, 1, 0],
        [1, 1, 1, 0, 0, 0],
        [0, 0, 0, 1, 1, 1],
        [0, 1, 0, 0, 1, 1],
        [0, 0, 0, 0, 0, 1]
    ]
},
  "w_6framedesign1011": {
    name: "6 frame design - 10",
    formula: "(1-10)",
    matrix: [
        [1, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 1],
        [0, 0, 1, 0, 1, 0],
        [1, 0, 0, 1, 0, 0],
        [0, 1, 0, 0, 0, 1],
        [1, 0, 0, 1, 0, 0],
        [0, 0, 1, 0, 1, 0],
        [0, 1, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0]
    ]
},
  "w_7framedesign190": {
    name: "7 frame design - 1",
    formula: "(1-10)",
    matrix: [
        [1, 0, 0, 1, 0, 0, 1],
        [0, 1, 0, 0, 0, 1, 0],
        [1, 0, 0, 1, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [0, 1, 1, 0, 1, 1, 0],
        [0, 1, 0, 1, 0, 1, 0],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [0, 1, 0, 0, 0, 1, 0],
        [0, 0, 1, 0, 1, 0, 0]
    ]
},
  
};

let currentMatrix = [];
let copiedMatrix = null;

const weaveSelect = document.getElementById('weaveSelect');
const formulaInput = document.getElementById('formulaInput');
const gridContainer = document.getElementById('gridContainer');
const liveWeavePreview = document.getElementById('liveWeavePreview');

// 1. Dropdown Loader Function
function loadDropdown(selectedValue = 'defulat') {
    weaveSelect.innerHTML = '';
    
    for(let key in preDefinedDesigns) {
        let opt = document.createElement('option');
        opt.value = key;
        opt.textContent = preDefinedDesigns[key].name;
        weaveSelect.appendChild(opt);
    }
    
    weaveSelect.value = selectedValue;
}

// 2. Automatic Formula Sync (Without *10)
function updatePreStockFormula() {
    if (!currentMatrix || !currentMatrix.length) return;
    let totalPicks = currentMatrix.length;
    formulaInput.value = `(1-${totalPicks})`;
}

// 3. Render Functions (Graph & Live Preview)
function renderAll() {
    renderGrid();
    renderLivePreview();
}

function renderGrid() {
    if(!currentMatrix || currentMatrix.length === 0) return;
    
    let rowCount = currentMatrix.length;
    let colCount = currentMatrix[0].length;
    let html = '';

    html += '<div style="display:flex; gap:3px; justify-content:center; margin-bottom:6px;">';
    html += '<span style="width:24px;"></span>';
    for (let c = 0; c < colCount; c++) {
        html += `<span style="width:28px; font-size:10px; color:#60a5fa; text-align:center;">${c + 1}</span>`;
    }
    html += '<span style="width:26px;"></span></div>';

    for (let r = 0; r < rowCount; r++) {
        html += '<div style="display:flex; gap:3px; align-items:center; margin-bottom:3px; justify-content:center;">';
        html += `<span style="color:#f59e0b; width:24px; font-weight:bold; font-size:11px; text-align:right; padding-right:4px;">${rowCount - r}</span>`;
        
        for (let c = 0; c < colCount; c++) {
            let val = currentMatrix[r][c];
            let isWarpUp = (val === 1);
            let displaySymbol = isWarpUp ? 'X' : '0';
            let cls = isWarpUp ? 'cell-btn cell-x' : 'cell-btn cell-0';

            html += `<button class="${cls}" onclick="toggleCell(${r}, ${c})">${displaySymbol}</button>`;
        }
        
        html += `<button class="del-btn" title="Delete Row" onclick="deleteSingleRow(${r})">✕</button>`;
        html += '</div>';
    }
    gridContainer.innerHTML = html;
}

function renderLivePreview() {
    if(!currentMatrix || currentMatrix.length === 0) return;

    let rowCount = currentMatrix.length;
    let colCount = currentMatrix[0].length;
    let repeatCols = 16;
    liveWeavePreview.style.gridTemplateColumns = `repeat(${repeatCols}, 12px)`;

    let html = '';
    let totalPicks = Math.max(24, rowCount * 2);

    for (let r = 0; r < totalPicks; r++) {
        let patternRow = r % rowCount;
        for (let c = 0; c < repeatCols; c++) {
            let patternCol = c % colCount;
            let val = currentMatrix[patternRow][patternCol];
            let bg = val === 1 ? '#22c55e' : '#ffffff';
            html += `<div class="preview-pixel" style="background:${bg};"></div>`;
        }
    }
    liveWeavePreview.innerHTML = html;
}

// 4. Grid Controls
window.toggleCell = function(r, c) {
    currentMatrix[r][c] = currentMatrix[r][c] === 1 ? 0 : 1;
    renderAll();
};

window.deleteSingleRow = function(r) {
    if (currentMatrix.length > 2) {
        currentMatrix.splice(r, 1);
        updatePreStockFormula();
        renderAll();
    }
};

window.addRow = function() {
    if (currentMatrix.length < 24) {
        let colCount = currentMatrix[0].length;
        currentMatrix.unshift(new Array(colCount).fill(0));
        updatePreStockFormula();
        renderAll();
    }
};

window.removeRow = function() {
    if (currentMatrix.length > 2) {
        currentMatrix.shift();
        updatePreStockFormula();
        renderAll();
    }
};

window.addCol = function() {
    if (currentMatrix[0].length < 24) {
        currentMatrix.forEach(row => row.push(0));
        renderAll();
    }
};

window.removeCol = function() {
    if (currentMatrix[0].length > 2) {
        currentMatrix.forEach(row => row.pop());
        renderAll();
    }
};

window.copyGraph = function() {
    copiedMatrix = JSON.parse(JSON.stringify(currentMatrix));
    alert('Graph copied successfully!');
};

window.pasteGraph = function() {
    if (copiedMatrix) {
        currentMatrix = JSON.parse(JSON.stringify(copiedMatrix));
        updatePreStockFormula();
        renderAll();
    } else {
        alert('No graph copied yet.');
    }
};

// 5. Code Export Generator
window.generateSaveCode = function() {
    let designName = prompt("Pudhiya Weave Design-kku Oru Peyar Kodungal:");
    if (!designName || designName.trim() === "") return;

    let objKey = "w_" + designName.toLowerCase().replace(/[^a-z0-9]/g, '') + Math.floor(Math.random() * 100);

    let matrixStr = "[\n";
    currentMatrix.forEach((row, index) => {
        matrixStr += "        [" + row.join(", ") + "]";
        matrixStr += (index < currentMatrix.length - 1) ? ",\n" : "\n";
    });
    matrixStr += "    ]";

    let finalCode = `"${objKey}": {\n    name: "${designName}",\n    formula: "${formulaInput.value}",\n    matrix: ${matrixStr}\n},`;

    document.getElementById('exportCode').value = finalCode;
    document.getElementById('exportModal').style.display = 'flex';
};

window.copyExportCode = function() {
    let copyText = document.getElementById("exportCode");
    copyText.select();
    document.execCommand("copy");
    alert("Code Copy aagivitadhu!");
};

window.closeModal = function() {
    document.getElementById('exportModal').style.display = 'none';
};

// 6. Initial Load & Listeners
document.addEventListener("DOMContentLoaded", () => {
    loadDropdown('defulat');
    
    let defaultDesign = preDefinedDesigns['defulat'];
    if (defaultDesign) {
        formulaInput.value = defaultDesign.formula;
        currentMatrix = JSON.parse(JSON.stringify(defaultDesign.matrix));
    }
    
    renderAll();
});

weaveSelect.addEventListener('change', (e) => {
    let selected = preDefinedDesigns[e.target.value];
    if (selected) {
        formulaInput.value = selected.formula;
        currentMatrix = JSON.parse(JSON.stringify(selected.matrix));
        renderAll();
    }
});
