document.getElementById('generateBtn').addEventListener('click', function () {
    const linkInput = document.getElementById('link').value;
    if (linkInput) {
        // Disable the button while generating
        document.getElementById('generateBtn').disabled = true;

        // Set a timeout of 2 seconds to simulate the cooldown
        setTimeout(() => {
            // Generate the QR code
            generateQRCode(linkInput);

            // Enable the button again
            document.getElementById('generateBtn').disabled = false;
        }, 2000);  // 2 seconds cooldown
    }
});

function generateQRCode(link) {
    const qrCodeContainer = document.getElementById('qrCodeContainer');
    qrCodeContainer.innerHTML = ''; // Clear any previous QR codes

    // Create QR code
    QRCode.toCanvas(document.createElement('canvas'), link, function (error, canvas) {
        if (error) {
            console.error(error);
            return;
        }
        
        // Append QR code to the container
        qrCodeContainer.appendChild(canvas);

        // Show the download button
        const downloadBtn = document.getElementById('downloadBtn');
        downloadBtn.style.display = 'inline-block';
        downloadBtn.onclick = function () {
            const dataUrl = canvas.toDataURL();
            const a = document.createElement('a');
            a.href = dataUrl;
            a.download = 'qr-code.png';
            a.click();
        };
    });
}
