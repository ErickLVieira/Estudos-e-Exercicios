document.getElementById('add-to-list').addEventListener('click', addToList);
document.getElementById('split-pdf').addEventListener('click', splitPdf);

let pdfBytes;

document.getElementById('pdf-file').addEventListener('change', async function(event) {
  const file = event.target.files[0];
  pdfBytes = await file.arrayBuffer();
});

function addToList() {
  const pdfName = document.getElementById('pdf-name').value;
  const pdfInterval = document.getElementById('pdf-interval').value;
  
  const listItem = document.createElement('li');
  listItem.textContent = `${pdfInterval}: ${pdfName}`;
  
  const removeButton = document.createElement('button');
  removeButton.textContent = 'Excluir';
  removeButton.addEventListener('click', function() {
    listItem.remove();
  });
  
  listItem.appendChild(removeButton);
  document.getElementById('pdf-list').appendChild(listItem);
  
  // Limpar campos do formulário
  document.getElementById('pdf-name').value = '';
  document.getElementById('pdf-interval').value = '';
}

async function splitPdf() {
  const listItems = document.querySelectorAll('#pdf-list li');
  
  const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
  const totalPages = pdfDoc.getPageCount();
  const selectedPages = new Set();

  for (const listItem of listItems) {
    const [pdfInterval] = listItem.textContent.split(': ');
    const intervals = pdfInterval.split(',').map(interval => {
      const [start, end] = interval.split('-').map(Number);
      return { start, end: end || start };
    });

    intervals.forEach(({ start, end }) => {
      for (let i = start; i <= end; i++) {
        selectedPages.add(i);
      }
    });
  }

  const missingPages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (!selectedPages.has(i)) {
      missingPages.push(i);
    }
  }

  if (missingPages.length > 0) {
    const confirmContinue = confirm(`As seguintes páginas estão faltando: ${missingPages.join(', ')}. Deseja continuar?`);
    if (!confirmContinue) {
      return;
    }
  }

  const zip = new JSZip();
  
  for (const listItem of listItems) {
    const [pdfInterval, pdfName] = listItem.textContent.split(': ');
    const intervals = pdfInterval.split(',').map(interval => {
      const [start, end] = interval.split('-').map(Number);
      return { start, end: end || start };
    });

    const newPdf = await PDFLib.PDFDocument.create();
    for (const { start, end } of intervals) {
      for (let i = start - 1; i < end; i++) {
        const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
        newPdf.addPage(copiedPage);
      }
    }
    
    const newPdfBytes = await newPdf.save();
    const filename = `${pdfInterval.replace(/,/g, '_').replace(/-/g, 'to')}_${pdfName.trim()}.pdf`;
    zip.file(filename, newPdfBytes);
  }
  
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  download(zipBlob, 'pdfs.zip', 'application/zip');
}

function download(data, filename, type) {
  const blob = new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}