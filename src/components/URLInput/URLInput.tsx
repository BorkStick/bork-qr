import * as React from "react";
import QRCode from "qrcode";

const predefinedLogos = [
  { path: "/borkmr-logo.png", name: "BorkMR" },
  { path: "/BORKTECH-Square-web.png", name: "Bork.Tech" },
  { path: "/megusta.jpg", name: "MeGusta" },
  { path: "custom", name: "Custom Logo" },
];

export default function URLInput() {
  const [state, setState] = React.useState({
    url: "https://borkmr.app",
    slug: "",
    qrCodeUrl: "",
    customTld: "",
    selectedLogo: "",
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
        errorCorrectionLevel: 'H',
        type: 'image/png',
        quality: 1,
        margin: 1,
        width: 512,
        height: 512,
      };
      QRCode.toDataURL(fullUrl, qrOptions)
        .then((qrCodeUrl) => {
          if (state.selectedLogo && state.selectedLogo !== "custom") {
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
                  const logoSize = canvas.width / 3;
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
    <div className="container mt-2 url-input-container">
      <h2 className="text-center mb-4">Enter URL</h2>
      <div className="row g-3 mb-3 justify-content-center align-items-center">
        <div className="col-12 col-md-8">
          <select
            className="form-select wide-select"
            id="urlSelect"
            name="url"
            value={state.url}
            onChange={handleChange}
          >
            <option value="https://borkmr.app">borkmr.app</option>
            <option value="https://bork.tech">bork.tech</option>
            <option value="custom">Custom</option>
          </select>
        </div>
      </div>
      {state.url === "custom" ? (
        <div className="row g-3 mb-3 justify-content-center align-items-center">
          <div className="col-12 col-md-8">
            <div className="input-group">
              <input
                type="text"
                name="customTld"
                placeholder="Enter custom TLD"
                value={state.customTld}
                className="form-control wide-input"
                onChange={handleChange}
              />
              <span className="input-group-text">/</span>
              <input
                type="text"
                name="slug"
                placeholder="slug"
                value={state.slug}
                className="form-control wide-input"
                id="basic-url"
                aria-describedby="basic-addon3"
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="row g-3 mb-3 justify-content-center align-items-center">
          <div className="col-12 col-md-8">
            <div className="input-group">
              <span className="input-group-text">{state.url}</span>
              <span className="input-group-text">/</span>
              <input
                type="text"
                name="slug"
                placeholder="slug"
                value={state.slug}
                className="form-control wide-input"
                id="basic-url"
                aria-describedby="basic-addon3"
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      )}

      <div className="logo-selection row g-3 mb-2 justify-content-center">
        <div className="col-12 col-md-8">
          <select
            name="selectedLogo"
            value={state.selectedLogo}
            onChange={handleLogoChange}
            className="form-select wide-select mb-3"
          >
            <option value="">Select a logo</option>
            {predefinedLogos.map((logo, index) => (
              <option key={index} value={logo.path}>
                {logo.name}
              </option>
            ))}
          </select>
        </div>
        {state.selectedLogo === "custom" && (
          <div className="col-12 col-md-8">
            <input
              type="file"
              name="customLogo"
              accept="image/*"
              onChange={handleLogoChange}
              className="form-control wide-input mb-3"
            />
          </div>
        )}
      </div>

      <div className="text-center">
        <h1 className="url-display">
          <a
            href={`${state.url === "custom" ? state.customTld : state.url}/${state.slug}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {(state.url === "custom" ? state.customTld : state.url)}/{state.slug}
          </a>
        </h1>
      </div>
      {state.qrCodeUrl && (
        <div className="text-center">
          <img
            src={state.qrCodeUrl}
            alt="Generated QR Code"
            className="qr-code mb-3 img-fluid"
          />
          <div>
            <button
              onClick={downloadQRCode}
              className="btn btn-primary btn-download"
            >
              Download QR Code
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
