const API_BASE_URL = 'https://uploadthat-service.onrender.com';
const urlParams = new URLSearchParams(window.location.search);
const randomBase64 = urlParams.get('id');
const socket = io(API_BASE_URL);
const link = `${window.location.origin}/share.html?id=${randomBase64}`;

socket.on("connect", () => {
  socket.emit("joinRoom", randomBase64);
});

socket.on("fetchFiles", async () => {
  const files = await fetchFiles(randomBase64);
  files.forEach(file => {
    displayFile(file.file_name, file.file_size, file.file_type, file.id);
  });
});

socket.on('userJoined', () => {
  createPopup('A device has joined the session', 'lightgreen');

  $(document).ready(function () {
    $("#qrCodeModal").modal("hide");
  });
});

socket.on('userLeft', () => {
  createPopup('A device has left the session', 'lightcoral');
});

socket.on('fileDeletion', async (fileId) => {
  // Remove the deleted file from the displayed files
  const fileElement = document.querySelector(`.file[data-file-id="${fileId}"]`);
  if (fileElement) {
    fileElement.remove();
  }
});

// Generate the QR code and display it in the qr-code div
const qrCodeElement = document.getElementById("qr-code");
const qrCodeModalElement = document.getElementById("qr-code-modal");
const qrCodeLink = document.getElementById("qr-code-link");

qrCodeElement.style.display = "none";
new QRCode(qrCodeModalElement, link);
qrCodeLink.value = link;

document.getElementById("copy-link-btn").addEventListener("click", () => {
  const qrCodeLink = document.getElementById("qr-code-link");
  qrCodeLink.select();
  document.execCommand("copy");
  alert("Link copied to clipboard!");
});

function createQRCode() {
  const link = `${window.location.origin}/join?id=${randomBase64}`;
  const qrCodeElement = document.getElementById("qr-code");
  new QRCode(qrCodeElement, link);
}

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
    displayFile(file.name, file.size, file.type, fileId);
    
    // Notify the server that a new file was uploaded
    socket.emit("fileUploaded", randomBase64);
  }
});

window.addEventListener('beforeunload', () => {
  socket.emit('leaveRoom', randomBase64);
});

async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('qr_code_id', `${randomBase64}`);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('An error occurred while uploading the file');
  }

  const responseText = await response.text();
  const result = JSON.parse(responseText);
  return result.file_id;
}

function displayFile(fileDisplayName, fileSize, fileType, fileId) {
  const existingFile = document.querySelector(`.file-item[data-file-id="${fileId}"]`);
  if (existingFile) {
    console.log(`File with ID ${fileId} already exists in the list.`);
    return;
  }

  const fileElement = document.createElement('div');
  fileElement.className = 'file-item';
  fileElement.setAttribute('data-file-id', fileId); // Add this line

  const fileNameElement = document.createElement('p'); // Rename this variable
  fileNameElement.textContent = fileDisplayName; // Update the reference here
  fileElement.appendChild(fileNameElement);

  if (fileType.startsWith('image/')) {
    createImagePreview(fileId, fileElement);
  } else {
    const downloadLink = document.createElement('a');
    downloadLink.textContent = 'Download';
    downloadLink.href = `${API_BASE_URL}/download/${fileId}`;
    downloadLink.download = fileDisplayName; // Update the reference here
    fileElement.appendChild(downloadLink);
  }

  // Create a download link for all file types
  const downloadButton = document.createElement('button');
  downloadButton.className = 'btn btn-primary btn-sm ml-2';
  downloadButton.innerHTML = '<i class="fas fa-download"></i>';
  downloadButton.addEventListener('click', () => {
    window.location.href = `${API_BASE_URL}/download/${fileId}`;
  });
  fileElement.appendChild(downloadButton);

  const removeButton = document.createElement('button');
  removeButton.className = 'btn btn-danger btn-sm ml-2';
  removeButton.innerHTML = '<i class="fas fa-times"></i>';
  removeButton.addEventListener('click', async () => {
    try {
      await deleteFile(fileId);
      socket.emit("fileDeleted", randomBase64, fileId);
      fileElement.remove();
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  });
  
  fileElement.appendChild(removeButton);

  document.querySelector('.file-list').appendChild(fileElement);
}

async function createImagePreview(fileId, fileElement) {
  const imageUrl = `${API_BASE_URL}/download/${fileId}`;

  const image = new Image();
  image.src = imageUrl;
  image.width = 200;

  fileElement.appendChild(image);
}

async function deleteFile(fileId) {
  try {
    const response = await fetch(`${API_BASE_URL}/delete/${fileId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete file');
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}

function createPopup(message, bgColor) {
  const popup = document.createElement('div');
  popup.className = 'popup';
  popup.style.position = 'fixed';
  popup.style.bottom = '20px';
  popup.style.left = '20px';
  popup.style.padding = '10px';
  popup.style.backgroundColor = bgColor;
  popup.style.color = 'white';
  popup.style.borderRadius = '5px';
  popup.style.opacity = '1';
  popup.style.transition = 'opacity 5s';
  popup.textContent = message;
  
  document.body.appendChild(popup);

  setTimeout(() => {
    popup.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(popup);
    }, 10000);
  }, 100);
}

document.getElementById("new-session-button").addEventListener("click", () => {
  const randomBase64 = generateRandomBase64(16);
  window.location.href = `https://upload-that.onrender.com/share.html?id=${randomBase64}`;
});

function generateRandomBase64(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  let result = '';

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}

function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

createQRCode();


if(!(isMobile())) {
  $(document).ready(function () {
    $("#qrCodeModal").modal("show");
  });
}

