import * as React from "react";
import QRCode from "qrcode";
import "./URLInput.css";

const predefinedLogos = [
  { path: "/borkmr-logo.png", name: "BorkMR" },
  { path: "/BORKTECH-Square-web.png", name: "Bork.Tech" },
  { path: "/megusta.jpg", name: "MeGusta" },
];

export default function URLInput() {
  const [state, setState] = React.useState({
    url: "https://borkmr.app",
    slug: "",
    qrCodeUrl: "",
    customTld: "",
    selectedLogo: "", // Add state for selected logo
  });

  function handleChange(evt: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) {
    const value = evt.target.value;
    const name = evt.target.name;

    if (name === "url" && value === "custom") {
      setState((prevState) => ({
        ...prevState,
        customTld: "",
        url: value,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }

    evt.preventDefault();
  }

  function handleLogoChange(evt: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) {
    const value = evt.target.files ? URL.createObjectURL(evt.target.files[0]) : evt.target.value;
    setState((prevState) => ({
      ...prevState,
      selectedLogo: value,
    }));
  }

  React.useEffect(() => {
    const baseUrl = state.url === "custom" ? state.customTld : state.url;
    if (state.slug && baseUrl) {
      const fullUrl = `${baseUrl}/${state.slug}`;
      const qrOptions = {
        errorCorrectionLevel: 'H', // High error correction level to ensure readability even with a logo
        type: 'image/png',
        quality: 1,
        margin: 1,
        width: 1024, // Generate a high-resolution QR code
      };
      QRCode.toDataURL(fullUrl, qrOptions)
        .then((qrCodeUrl) => {
          if (state.selectedLogo) {
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");

            if (context) {
              const image = new Image();
              image.src = qrCodeUrl;
              image.onload = () => {
                canvas.width = image.width;
                canvas.height = image.height;
                context.drawImage(image, 0, 0, canvas.width, canvas.height);

                const logo = new Image();
                logo.src = state.selectedLogo;
                logo.onload = () => {
                  const logoSize = canvas.width / 3.5; // Adjust the logo size proportionally
                  const logoX = (canvas.width - logoSize) / 2;
                  const logoY = (canvas.height - logoSize) / 2;
                  context.drawImage(logo, logoX, logoY, logoSize, logoSize);
                  setState((prevState) => ({
                    ...prevState,
                    qrCodeUrl: canvas.toDataURL(),
                  }));
                };
                logo.onerror = () => {
                  setState((prevState) => ({
                    ...prevState,
                    qrCodeUrl: qrCodeUrl,
                  }));
                };
              };
            }
          } else {
            setState((prevState) => ({
              ...prevState,
              qrCodeUrl: qrCodeUrl,
            }));
          }
        })
        .catch((error) => {
          console.error("Error generating QR code:", error);
        });
    }
  }, [state.url, state.customTld, state.slug, state.selectedLogo]);

  function downloadQRCode() {
    if (state.qrCodeUrl) {
      const link = document.createElement("a");
      link.href = state.qrCodeUrl;
      link.download = "qrcode.png";
      link.click();
    }
  }

  return (
    <div className="url-input-container">
      <div className="input-group mb-3">
        <select
          className="form-select input-group-text col-6"
          id="urlSelect"
          name="url"
          value={state.url}
          onChange={handleChange}
        >
          <option value="https://borkmr.app">borkmr.app</option>
          <option value="https://bork.tech">bork.tech</option>
          <option value="custom">Custom</option>
        </select>

        {state.url === "custom" ? (
          <input
            type="text"
            name="customTld"
            placeholder="Enter custom TLD"
            value={state.customTld}
            className="form-control col-6"
            onChange={handleChange}
          />
        ) : null}

        <input
          type="text"
          name="slug"
          placeholder="slug"
          value={state.slug}
          className="form-control col-6"
          id="basic-url"
          aria-describedby="basic-addon3"
          onChange={handleChange}
        />
      </div>

      <div className="logo-selection">
        <select name="selectedLogo" value={state.selectedLogo} onChange={handleLogoChange} className="form-select mb-3">
          <option value="">Select a logo</option>
          {predefinedLogos.map((logo, index) => (
            <option key={index} value={logo.path}>{logo.name}</option>
          ))}
        </select>
        <input type="file" name="customLogo" accept="image/*" onChange={handleLogoChange} className="form-control mb-3" />
      </div>

      <h1 className="url-display">
        {(state.url === "custom" ? state.customTld : state.url)}/{state.slug}
      </h1>
      {state.qrCodeUrl && (
        <div className="qr-code-container">
          <img src={state.qrCodeUrl} alt="Generated QR Code" className="qr-code" />
          <button onClick={downloadQRCode} className="btn-download">Download QR Code</button>
        </div>
      )}
    </div>
  );
}
