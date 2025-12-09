#include <SPI.h>
#include <MFRC522.h>

#define SS_PIN 10
#define RST_PIN 9
#define TRIG_PIN 8
#define ECHO_PIN 7

MFRC522 rfid(SS_PIN, RST_PIN);
unsigned long lastMoveTime = 0;
const long interval = 3000;

void setup() {
  Serial.begin(115200);
  SPI.begin();
  rfid.PCD_Init();
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
}

void loop() {
  if (rfid.PICC_IsNewCardPresent() && rfid.PICC_ReadCardSerial()) {
    String content = "";
    for (byte i = 0; i < rfid.uid.size; i++) {
       content.concat(String(rfid.uid.uidByte[i] < 0x10 ? " 0" : " "));
       content.concat(String(rfid.uid.uidByte[i], HEX));
    }
    content.toUpperCase();
    Serial.print("RFID:");
    Serial.println(content.substring(1));
    //delay(1000);
    rfid.PICC_HaltA();
    rfid.PCD_StopCrypto1();
  }

  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  long duration = pulseIn(ECHO_PIN, HIGH);
  int distance = duration * 0.034 / 2;

  if (distance > 0 && distance < 50) {
    if (millis() - lastMoveTime > interval) {
      Serial.println("MOVE:DETECTED");
      lastMoveTime = millis();
    }
  }
  //delay(50);
}
