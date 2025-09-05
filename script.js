let qrCode = null;

function isValidHttpUrl(string) {
  try {
    const newUrl = new URL(string);
    return newUrl.protocol === "http:" || newUrl.protocol === "https:";
  } catch (err) {
    return false;
  }
}

function addRowToTable(ticket, realUrl, qrDataURL) {
  const tbody = document.querySelector("#historyTable tbody");
  const tr = document.createElement("tr");

  const tdTicket = document.createElement("td");
  tdTicket.textContent = ticket;

  const tdURL = document.createElement("td");
  tdURL.textContent = realUrl;

  const tdQR = document.createElement("td");
  const img = document.createElement("img");
  img.src = qrDataURL;
  img.width = 100;
  img.height = 100;
  tdQR.appendChild(img);

  tr.appendChild(tdTicket);
  tr.appendChild(tdURL);
  tr.appendChild(tdQR);
  tbody.appendChild(tr);
}

function generateQRCode() {
  const ticket = document.getElementById("ticket_input").value.trim();
  const realUrl = document.getElementById("input_text").value.trim();
  const errorCorrectionLevel = document.getElementById("input_error-correction").value;
  const margin = parseInt(document.getElementById("input_margin").value);
  const resolution = parseInt(document.getElementById("input_size").value);
  const qrCodeContainer = document.getElementById("qrcodeContainer");
  const downloadBtn = document.getElementById("downloadBtn");

  if (!ticket) return alert("Veuillez saisir un numéro de ticket.");
  if (!realUrl) return alert("Veuillez saisir une URL.");
  if (!isValidHttpUrl(realUrl)) return alert("Veuillez saisir une URL valide.");


  const baseUrl = "https://matthieusolente.github.io/qrcode-generator/"; 
  const qrUrl = `${baseUrl}qrcode.html?ticket=${encodeURIComponent(ticket)}`;

  qrCodeContainer.innerHTML = "";

  qrCode = new QRCodeStyling({
    width: resolution,
    height: resolution,
    data: qrUrl,
    margin: margin,
    qrOptions: { errorCorrectionLevel },
    dotsOptions: { type: "square", color: "#000000" },
    backgroundOptions: { color: "transparent" },
  });

  qrCode.append(qrCodeContainer);
  downloadBtn.disabled = false;

  setTimeout(() => {
    qrCode.getRawData("png").then((blob) => {
      const qrDataURL = URL.createObjectURL(blob);
      addRowToTable(ticket, realUrl, qrDataURL);

     
      console.log(
        `Ajoutez cette ligne dans qrMapping.json : "${ticket}": "${realUrl}"`
      );

      document.getElementById("input_text").value = "";
      document.getElementById("ticket_input").value = "";
    });
  }, 100);
}

// Événements
document.getElementById("generateBtn").addEventListener("click", generateQRCode);

document.getElementById("downloadBtn").addEventListener("click", () => {
  const format = document.getElementById("input_extension").value;
  const ticket = document.getElementById("ticket_input").value.trim();

  if (!qrCode) {
    alert("Veuillez générer un QR code avant de télécharger.");
    return;
  }

  if (!ticket) {
    alert("Numéro de ticket manquant pour le nom du fichier.");
    return;
  }

  qrCode.download({ name: `qrcode-${ticket}`, extension: format });
});
