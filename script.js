document.getElementById('generateBtn').addEventListener('click', function () {
    const linkInput = document.getElementById('link').value;
    if (linkInput) {

        document.getElementById('generateBtn').disabled = true;


        setTimeout(() => {

            generateQRCode(linkInput);


            document.getElementById('generateBtn').disabled = false;
        }, 2000);  
    }
});

function generateQRCode(link) {
    const qrCodeContainer = document.getElementById('qrCodeContainer');
    qrCodeContainer.innerHTML = '';



    QRCode.toCanvas(document.createElement('canvas'), link, function (error, canvas) {
        if (error) {
            console.error(error);
            return;
        }
        

        qrCodeContainer.appendChild(canvas);


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
