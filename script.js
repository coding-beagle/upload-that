import QrScanner from './qr-scanner.min.js';

document.addEventListener('DOMContentLoaded', () => {
    if (isMobile()) {
      document.getElementById('scan-qr').classList.remove('d-none');
    }
  });
  
  function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
  
  document.getElementById('generate-qr').addEventListener('click', () => {
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
  
  let qrScanner;
  
  document.getElementById('scan-qr').addEventListener('click', () => {
    $('#scan-modal').modal('show');
  
    const videoElement = document.getElementById('qr-reader');
    qrScanner = new QrScanner(videoElement, (decodedText) => {
      const targetUrl = `https://upload-that.onrender.com/share.html?id=${decodedText}`;
      window.location.href = targetUrl;
    });
  
    qrScanner.start();
  });
  
  $('#scan-modal').on('hidden.bs.modal', () => {
    if (qrScanner) {
      qrScanner.stop();
    }
  });
  