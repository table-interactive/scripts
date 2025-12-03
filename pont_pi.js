const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const axios = require('axios');

const API_URL = 'http://192.168.1.50:3000';
const port = new SerialPort({ path: '/dev/ttyUSB0', baudRate: 115200 });
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

parser.on('data', (line) => {
    const data = line.trim();
    let payload = null;

    if (data.startsWith("RFID:")) {
        payload = {
            type: 'rfid',
            uid: data.split(':')[1],
            device_id: 'PI_LOBBY_01'
        };
    } else if (data.startsWith("MOVE:")) {
        payload = {
            type: 'motion',
            status: 'detected',
            device_id: 'PI_LOBBY_01'
        };
    }

    if (payload) {
        axios.post(`${API_URL}/api/scan`, payload, { timeout: 2000 })
            .catch(err => console.error(err.message));
    }
});
