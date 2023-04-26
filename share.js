const API_BASE_URL = 'https://uploadthat-service.onrender.com';
const urlParams = new URLSearchParams(window.location.search);
const randomBase64 = urlParams.get('id');
const socket = io(API_BASE_URL);

socket.on("connect", () => {
  console.log("Connected to server:", socket.id);
  socket.emit("joinRoom", randomBase64);
});

socket.on("fetchFiles", async () => {
  console.log("New file uploaded, fetching files...");
  const files = await fetchFiles(randomBase64);
  files.forEach((file) => {
    // Check if the file is already displayed
    const existingFileElement = document.querySelector(`.file-item[data-file-id="${file.id}"]`);
    if (!existingFileElement) {
      displayFile(file, file.id);
    }
  });
});

// Generate the QR code and display it in the qr-code div
const qrElement = document.getElementById('qr-code');
const qrCode = new QRCode(qrElement, {
  text: `https://upload-that.onrender.com/share.html?id=${randomBase64}`,
  width: 256,
  height: 256,
  colorDark: "#000000",
  colorLight: "#ffffff",
  correctLevel: QRCode.CorrectLevel.H,
});

async function fetchFiles(qrCodeId) {
  try {
    const response = await fetch(`${API_BASE_URL}/files/${qrCodeId}`);

    if (!response.ok) {
      throw new Error('An error occurred while fetching the files');
    }

    const files = await response.json();
    return files;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

document.getElementById('file-input').addEventListener('change', async (event) => {
  const fileList = event.target.files;

  if (fileList.length > 0) {
    const file = fileList[0];
    const fileId = await uploadFile(file);
    displayFile(file, fileId);
    
    // Notify the server that a new file was uploaded
    socket.emit("fileUploaded", randomBase64);
  }
});

async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('qr_code_id', `${randomBase64}`);

  console.log(formData);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('An error occurred while uploading the file');
  }

  const responseText = await response.text();
  console.log("Server response:", responseText);
  const result = JSON.parse(responseText);
  return result.file_id;
}

function displayFile(file, fileId) {
  const fileElement = document.createElement('div');
  fileElement.className = 'file-item';
  fileElement.setAttribute('data-file-id', fileId); // Add this line

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