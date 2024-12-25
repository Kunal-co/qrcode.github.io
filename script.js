let lastGenerateTime = 0;

function generateQRCode() {
    const linkInput = document.getElementById('linkInput').value;
    const qrCodeContainer = document.getElementById('qrCode');
    const downloadBtn = document.getElementById('downloadBtn');
    const errorMessage = document.getElementById('errorMessage');

    const currentTime = Date.now();

    if (currentTime - lastGenerateTime < 10000) {
        errorMessage.style.display = 'block';
        return;
    }

    errorMessage.style.display = 'none';

    if (linkInput.trim() === '') {
        alert('Please enter a URL');
        return;
    }

    qrCodeContainer.innerHTML = '';

    QRCode.toDataURL(linkInput, { errorCorrectionLevel: 'H' }, function (err, url) {
        if (err) {
            console.error(err);
            return;
        }

        const img = document.createElement('img');
        img.src = url;
        qrCodeContainer.appendChild(img);

        downloadBtn.style.display = 'inline-block';
        downloadBtn.setAttribute('data-url', url);

        lastGenerateTime = currentTime;
    });
}

function downloadQRCode() {
    const downloadBtn = document.getElementById('downloadBtn');
    const url = downloadBtn.getAttribute('data-url');

    const link = document.createElement('a');
    link.href = url;
    link.download = 'qrcode.png';
    link.click();
}
