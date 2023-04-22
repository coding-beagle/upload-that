// Add this code snippet to the top of your script.js file
document.addEventListener('DOMContentLoaded', () => {
    if (isMobile()) {
      document.getElementById('scan-qr').classList.remove('d-none');
    }
  });
  
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

document.getElementById('generate-qr').addEventListener('click', () => {
    const randomBase64 = generateRandomBase64(16); // 16 is the length of the random string
    const qrElement = document.getElementById('qr-code');
    
    // Clear previous QR code if any
    qrElement.innerHTML = '';
  
    // Create a new QR code with the random base64 string
    const qrCode = new QRCode(qrElement, {
      text: randomBase64,
      width: 256,
      height: 256,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
    });
  });
  
  function generateRandomBase64(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let result = '';
  
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
  
    return result;
  }

  // Replace the previous event listener in your script.js file with this one
document.getElementById('scan-qr').addEventListener('click', () => {
    const videoElement = document.createElement('video');
    videoElement.style.width = '100%';
    videoElement.id = 'qr-reader'; // Add this line
    document.body.appendChild(videoElement);

    $('#scan-modal').modal('show');
  
    const qrScanner = new Html5Qrcode('qr-reader', { fps: 10, qrbox: 250 });
    
    qrScanner.start(
        { facingMode: 'environment' },
        (decodedText) => {
          alert('Scanned QR code: ' + decodedText);
          qrScanner.stop().then(() => {
            document.body.removeChild(videoElement);
          });
        },
        (error) => {
          alert('Error: ' + error);
        }
      )
      .catch((error) => {
        alert('Error: ' + error);
      });
  });

  $('#scan-modal').on('hidden.bs.modal', () => {
    qrScanner.stop().catch((error) => {
      console.error('Error stopping the scanner:', error);
    });
  });
  