#include <SoftwareSerial.h>  // Include SoftwareSerial library

#define BLUETOOTH_RX_PIN 10  // Define RX pin for Bluetooth
#define BLUETOOTH_TX_PIN 11  // Define TX pin for Bluetooth

// Initialize SoftwareSerial for Bluetooth communication
SoftwareSerial BTSerial(BLUETOOTH_RX_PIN, BLUETOOTH_TX_PIN);

void setup() {
  // put your setup code here, to run once:
   Serial.begin(9600);
   BTSerial.begin(9600);
   Serial.println("KKK");
   BTSerial.println("KKK");
}

void loop() {
  if (Serial.available() > 0) {
    String command = Serial.readStringUntil("\n");  //read the string

    command.trim();

    if (command.equals("NIGGA")) {  //unity will send this message to identify
      Serial.println("KKK");
    } else {
      Serial.println("yo what");
    }
  }
  if (BTSerial.available() > 0) {
    String command = BTSerial.readStringUntil("\n");  //read the string

    command.trim();

    if (command.equals("NIGGA")) {  //unity will send this message to identify
      BTSerial.println("KKK");
    } else {
      BTSerial.println(command);
    }
  }
  // Send some data to Python
  int micValue = analogRead(A0);  // Read data from an analog pin (e.g., microphone)
  float digitalValue = digitalRead(8);
  Serial.println(micValue);  // Send data to Python
  BTSerial.println(micValue);  // Send data to Python
  delay(100);  // Wait for half a second

}
