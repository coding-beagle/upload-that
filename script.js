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
  