const API_BASE_URL = 'http://upload-that.onrender.com';

document.getElementById('file-input').addEventListener('change', async (event) => {
  const fileList = event.target.files;

  if (fileList.length > 0) {
    const file = fileList[0];
    const fileId = await uploadFile(file);
    displayFile(file, fileId);
  }
});

async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('qr_code_id', 'your_qr_code_id_here');

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('An error occurred while uploading the file');
  }

  const result = await response.json();
  return result.file_id;
}

function displayFile(file, fileId) {
  const fileElement = document.createElement('div');
  fileElement.className = 'file-item';

  const fileName = document.createElement('p');
  fileName.textContent = file.name;
  fileElement.appendChild(fileName);

  if (file.type.startsWith('image/')) {
    createImagePreview(file, fileElement);
  } else {
    const downloadLink = document.createElement('a');
    downloadLink.textContent = 'Download';
    downloadLink.href = `${API_BASE_URL}/download/${fileId}`;
    downloadLink.download = file.name;
    fileElement.appendChild(downloadLink);
  }

  const removeButton = document.createElement('button');
  removeButton.className = 'btn btn-danger btn-sm ml-2';
  removeButton.innerHTML = '<i class="fas fa-times"></i>';
  removeButton.addEventListener('click', () => {
    fileElement.remove();
  });
  fileElement.appendChild(removeButton);

  document.querySelector('.file-list').appendChild(fileElement);
}

function createImagePreview(file, fileElement) {
  const img = document.createElement('img');
  img.src = URL.createObjectURL(file);
  img.onload = () => URL.revokeObjectURL(img.src);
  img.width = 200;
  img.height = 200;

  fileElement.appendChild(img);
}