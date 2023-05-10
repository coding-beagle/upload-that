const API_BASE_URL = 'https://uploadthat-service.onrender.com';
const urlParams = new URLSearchParams(window.location.search);
const randomBase64 = urlParams.get('id');
const socket = io(API_BASE_URL);
const link = `${window.location.origin}/share.html?id=${randomBase64}`;

socket.on("connect", async() => {
  socket.emit("joinRoom", randomBase64);
  const files = await fetchFiles(randomBase64);
  files.forEach(file => {
    displayFile(file.file_name, file.file_size, file.file_type, file.id);
  });
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
  const fileElement = document.querySelector(`.file-item[data-file-id="${fileId}"]`);
  if (fileElement) {
    fileElement.remove();
  }
});

socket.on('showLoadingElement', () =>{
  document.getElementById('loader-container').style.display = 'flex';
})

socket.on('hideLoadingElement', () => {
  document.getElementById('loader-container').style.display = 'none';
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
  const maxFileSize = 25 * 1024 * 1024; // 25 MB in bytes
  const file = fileList[0];
  document.getElementById('loader-container').style.display = 'flex';

  if (fileList.length > 0) {
    if (file.size > maxFileSize) {
      // Create a pop-up that shakes and tells the user the file size is too large
      const errorMessage = 'File size is too large. Please upload a file smaller than 25 MB.';

      const oldErrorPopup = document.getElementById('errorPopup');
      if (oldErrorPopup) {
        oldErrorPopup.remove(); // remove the old message
      }
      const errorPopup = document.createElement('div');
      errorPopup.id = 'errorPopup'; // add an ID
      errorPopup.textContent = errorMessage;
      errorPopup.style.position = 'fixed';
      errorPopup.style.top = '50%';
      errorPopup.style.left = '50%';
      errorPopup.style.transform = 'translate(-50%, -50%)';
      errorPopup.style.backgroundColor = 'lightcoral';
      errorPopup.style.color = 'black'; // this line changes the text color to black
      errorPopup.style.padding = '20px';
      errorPopup.style.borderRadius = '10px';
      errorPopup.style.animation = 'fadeInShake 1s ease both';
      errorPopup.style.animationIterationCount = '1';
      errorPopup.style.zIndex = '1000';
      document.body.appendChild(errorPopup);

      // Remove the error popup after 5 seconds
      setTimeout(() => {
        errorPopup.remove();
      }, 5000);

      return;
    }

    socket.emit("fileUploading");
    const fileId = await uploadFile(file);
    displayFile(file.name, file.size, file.type, fileId);
    
    document.getElementById('loader-container').style.display = 'none';
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
  const existingFiles = document.querySelectorAll('.file-item');

  // Loop through them and check if any has the same name and size
  for (let i = 0; i < existingFiles.length; i++) {
    const existingFileName = existingFiles[i].querySelector('.file-name').textContent;
    const existingFileSize = Number(existingFiles[i].getAttribute('data-file-size'));
  
    if (existingFileName === fileDisplayName && existingFileSize === fileSize) {
      return;
    }
  }

  const existingFile = document.querySelector(`.file-item[data-file-id="${fileId}"]`);
  if (existingFile) {
    console.log(`File with ID ${fileId} already exists in the list.`);
    return;
  }

  const fileElement = document.createElement('div');
  fileElement.className = 'file-item';
  fileElement.setAttribute('data-file-id', fileId);
  fileElement.setAttribute('data-file-size', fileSize);

  const fileNameElement = document.createElement('p');
  fileNameElement.className = 'file-name';

  let maxFileNameLength = 13;
  let fileName = fileDisplayName;
  let fileExtension = fileName.split('.').pop();

  if (fileName.length > maxFileNameLength + fileExtension.length + 1) {
    fileName = fileName.substring(0, maxFileNameLength) + '...' + fileExtension;
  }

  fileNameElement.textContent = fileName;

  const fileContentElement = document.createElement('div');
  fileContentElement.className = 'file-content';
  fileContentElement.appendChild(fileNameElement);

  // Create a download link for all file types
  const downloadButton = document.createElement('button');
  downloadButton.className = 'btn btn-primary btn-sm ml-2';
  downloadButton.innerHTML = '<i class="fas fa-download"></i>';
  downloadButton.style.display = 'flex';
  downloadButton.style.justifyContent = 'center';
  downloadButton.style.alignItems = 'center';
  downloadButton.addEventListener('click', () => {
    window.location.href = `${API_BASE_URL}/download/${fileId}`;
  });

  const removeButton = document.createElement('button');
  removeButton.className = 'btn btn-danger btn-sm ml-2';
  removeButton.innerHTML = '<i class="fas fa-times"></i>';
  removeButton.style.display = 'flex';
  removeButton.style.justifyContent = 'center';
  removeButton.style.alignItems = 'center';
  removeButton.addEventListener('click', async () => {
    try {
      await deleteFile(fileId);
      socket.emit("fileDeleted", randomBase64, fileId);
      fileElement.remove();
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  });

  const buttonsElement = document.createElement('div');
  buttonsElement.className = 'buttons';
  buttonsElement.appendChild(downloadButton);
  buttonsElement.appendChild(removeButton);

  fileElement.appendChild(fileContentElement);
  fileElement.appendChild(buttonsElement);

  document.querySelector('.file-list').appendChild(fileElement);

  createImagePreview(fileId, fileType, fileElement);

  fileElement.style.animation = "grow 1s cubic-bezier(0.68, -0.55, 0.265, 1.55)";
}

async function createImagePreview(fileId, fileType, fileElement) {
  const fileUrl = `${API_BASE_URL}/download/${fileId}`;

  if (fileType.startsWith('image/')) {
    const image = new Image();
    image.src = fileUrl;
    image.className = 'file-thumbnail'; // Add this line
    fileElement.querySelector('.file-content').appendChild(image);
  } else {
    const fileTypeIcon = getFileTypeIcon(fileType);
    const iconElement = document.createElement('img');
    iconElement.src = fileTypeIcon;
    iconElement.alt = fileType + ' icon';
    iconElement.className = 'file-icon';  // You might want to style the icon
    fileElement.querySelector('.file-content').appendChild(iconElement);
  }
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
  window.location.href = `https://upload-that.com/share.html?id=${randomBase64}`;
});

function getFileTypeIcon(fileType) {
  switch (fileType) {
    case 'application/pdf':
      return 'pdf.svg';
    case 'application/msword':
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return 'word.svg';
    case 'application/vnd.ms-excel':
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      return 'excel.svg';
    case 'application/vnd.ms-powerpoint':
    case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
      return 'powerpoint.svg';
    case 'text/plain':
      return 'text.svg';
    // Add more cases as needed
    default:
      return 'default.svg';
  }
}

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

document.getElementById('loader-container').style.display = 'none';

// drag and drop shenangians:

let dropArea = document.getElementById('file-upload-area');

  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false)
  });

  function preventDefaults (e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false)
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false)
  });

  function highlight(e) {
    dropArea.style.color = '#4CAF50';
    dropArea.style.borderColor = '#4CAF50';
  }

  function unhighlight(e) {
    dropArea.style.color = '#333';
    dropArea.style.borderColor = '#4CAF50';
  }

  dropArea.addEventListener('drop', async (event) => {
    preventDefaults(event);
    unhighlight(event);
  
    const fileList = event.dataTransfer.files;
    const maxFileSize = 25 * 1024 * 1024; // 25 MB in bytes
    const file = fileList[0];
    document.getElementById('loader-container').style.display = 'flex';
  
    if (fileList.length > 0) {
      if (file.size > maxFileSize) {
        // Create a pop-up that shakes and tells the user the file size is too large
      const errorMessage = 'File size is too large. Please upload a file smaller than 25 MB.';

      const oldErrorPopup = document.getElementById('errorPopup');
      if (oldErrorPopup) {
        oldErrorPopup.remove(); // remove the old message
      }
      const errorPopup = document.createElement('div');
      errorPopup.id = 'errorPopup'; // add an ID
      errorPopup.textContent = errorMessage;
      errorPopup.style.position = 'fixed';
      errorPopup.style.top = '50%';
      errorPopup.style.left = '50%';
      errorPopup.style.transform = 'translate(-50%, -50%)';
      errorPopup.style.backgroundColor = 'lightcoral';
      errorPopup.style.color = 'black'; // this line changes the text color to black
      errorPopup.style.padding = '20px';
      errorPopup.style.borderRadius = '10px';
      errorPopup.style.animation = 'fadeInShake 1s ease both';
      errorPopup.style.animationIterationCount = '1';
      errorPopup.style.zIndex = '1000';
      document.body.appendChild(errorPopup);

      // Remove the error popup after 5 seconds
      setTimeout(() => {
        errorPopup.remove();
      }, 5000);
        return;
      }
  
      socket.emit("fileUploading");
      const fileId = await uploadFile(file);
      displayFile(file.name, file.size, file.type, fileId);
      
      document.getElementById('loader-container').style.display = 'none';
      // Notify the server that a new file was uploaded
      socket.emit("fileUploaded", randomBase64);
    }
  }, false);

  function handleDrop(e) {
    let dt = e.dataTransfer;
    let files = dt.files;
    handleFiles(files);
  }

  function handleFiles(files) {
    ([...files]).forEach(uploadFile);
}

dropArea.addEventListener('click', () => {
    document.getElementById('file-input').click();
  }, false);
  
  document.getElementById('file-input').addEventListener('change', async (event) => {
    const fileList = event.target.files;
    const maxFileSize = 25 * 1024 * 1024; // 25 MB in bytes
    const file = fileList[0];
    document.getElementById('loader-container').style.display = 'flex';
  
    if (fileList.length > 0) {
      if (file.size > maxFileSize) {
          // Create a pop-up that shakes and tells the user the file size is too large
      const errorMessage = 'File size is too large. Please upload a file smaller than 25 MB.';

      const oldErrorPopup = document.getElementById('errorPopup');
      if (oldErrorPopup) {
        oldErrorPopup.remove(); // remove the old message
      }
      const errorPopup = document.createElement('div');
      errorPopup.id = 'errorPopup'; // add an ID
      errorPopup.textContent = errorMessage;
      errorPopup.style.position = 'fixed';
      errorPopup.style.top = '50%';
      errorPopup.style.left = '50%';
      errorPopup.style.transform = 'translate(-50%, -50%)';
      errorPopup.style.backgroundColor = 'lightcoral';
      errorPopup.style.color = 'black'; // this line changes the text color to black
      errorPopup.style.padding = '20px';
      errorPopup.style.borderRadius = '10px';
      errorPopup.style.animation = 'fadeInShake 1s ease both';
      errorPopup.style.animationIterationCount = '1';
      errorPopup.style.zIndex = '1000';
      document.body.appendChild(errorPopup);

      // Remove the error popup after 5 seconds
      setTimeout(() => {
        errorPopup.remove();
      }, 5000);
        return;
      }
  
      socket.emit("fileUploading");
      const fileId = await uploadFile(file);
      displayFile(file.name, file.size, file.type, fileId);
  
      document.getElementById('loader-container').style.display = 'none';
      // Notify the server that a new file was uploaded
      socket.emit("fileUploaded", randomBase64);
    }
  });
  