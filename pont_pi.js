const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const axios = require('axios');

// --- CONFIGURATION ---
const API_URL = 'https://game-api-4dbs.onrender.com';
const USB_PORT = '/dev/ttyUSB1';

const port = new SerialPort({ path: USB_PORT, baudRate: 115200 });
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

console.log(`Pont démarré sur ${USB_PORT} vers ${API_URL}`);

parser.on('data', (line) => {
    const data = line.trim();
    let payload = null;

    if (data.startsWith("RFID:")) {
        console.log("Badge détecté -> Envoi Tour 1");
        payload = { towerId: "LECTEUR_PORTE_1" };
    } else if (data.startsWith("MOVE:")) {
        console.log("Mouvement détecté -> Envoi Tour 2");
      payload = { towerId: "LECTEUR_PORTE_2" };
    }

    if (payload) {
        // Envoi non-bloquant (pas de await)
        axios.post(`${API_URL}/tower/place`, payload, { timeout: 2000 })
            .catch(err => {
                console.error("Erreur:", err.message);
                if (err.response) console.error("Détail:", err.response.data);
            });
    }
});
