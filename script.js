let qrCode = null;

function isValidHttpUrl(string) {
  try {
    const newUrl = new URL(string);
    return newUrl.protocol === 'http:' || newUrl.protocol === 'https:';
  } catch {
    return false;
  }
}

function generateQRCode() {
  const ticket = document.getElementById('ticket_input').value.trim();
  const realUrl = document.getElementById('input_text').value.trim();
  const errorCorrectionLevel = document.getElementById('input_error-correction').value;
  const margin = parseInt(document.getElementById('input_margin').value);
  const resolution = parseInt(document.getElementById('input_size').value);
  const qrCodeContainer = document.getElementById('qrcodeContainer');
  const downloadBtn = document.getElementById('downloadBtn');

  if (!ticket) return alert("Veuillez saisir un numéro de ticket.");
  if (!realUrl) return alert("Veuillez saisir une URL.");
  if (!isValidHttpUrl(realUrl)) return alert("Veuillez saisir une URL valide.");

  const qrUrl = `qrcode.html?ticket=${encodeURIComponent(ticket)}`;

  qrCodeContainer.innerHTML = "";

  qrCode = new QRCodeStyling({
    width: resolution,
    height: resolution,
    data: qrUrl,
    margin: margin,
    qrOptions: { errorCorrectionLevel },
    dotsOptions: { type: 'square', color: '#000000' },
    backgroundOptions: { color: 'transparent' }
  });

  qrCode.append(qrCodeContainer);
  downloadBtn.disabled = false;
}

document.getElementById('generateBtn').addEventListener('click', generateQRCode);

document.getElementById('downloadBtn').addEventListener('click', () => {
  const format = document.getElementById('input_extension').value;
  const ticket = document.getElementById('ticket_input').value.trim();

  if (!qrCode) {
    alert('Veuillez générer un QR code avant de télécharger.');
    return;
  }

  if (!ticket) {
    alert('Numéro de ticket manquant pour le nom du fichier.');
    return;
  }

  qrCode.download({ name: `qrcode-${ticket}`, extension: format });
});
