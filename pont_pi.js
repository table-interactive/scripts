const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const axios = require('axios');

const port = new SerialPort({ path: '/dev/ttyUSB1', baudRate: 9600 });
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

console.log("Système prêt. En attente de badge RFID...");

parser.on('data', async (rfidTag) => {
    console.log(`Badge détecté : ${rfidTag}`);

    try {
        const response = await axios.post('http://ip:3000/api/scan', {
            uid: rfidTag,
            timestamp: new Date().toISOString(),
        });
        console.log('Envoyé avec succès:', response.status);
    } catch (error) {
        console.error('Erreur lors de l\'envoi:', error.message);
    }
});
