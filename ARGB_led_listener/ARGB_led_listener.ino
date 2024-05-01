#include <FastLED.h>
#include <WiFiNINA.h>

char ssid[] = "";            //  your network SSID (name) between the " "
char pass[] = "";            // your network password between the " "
int keyIndex = 0;            // your network key Index number (needed only for WEP)
int status = WL_IDLE_STATUS; // connection status
WiFiServer server(80);       // server socket

WiFiClient client = server.available();

#define LED_PIN 7
#define NUM_LEDS 20

CRGB leds[NUM_LEDS];

void setup()
{
  Serial.begin(9600);
  while (!Serial)
    ;

  enable_WiFi();
  connect_WiFi();

  server.begin();
  printWifiStatus();
  FastLED.addLeds<WS2812, LED_PIN, GRB>(leds, NUM_LEDS);
}

void loop()
{
  client = server.available();
  if (!client)
    return;

  handleRequest();

  leds[0] = CRGB(255, 0, 0);
  FastLED.show();
  delay(500);
  leds[1] = CRGB(0, 255, 0);
  FastLED.show();
  delay(500);
  leds[2] = CRGB(0, 0, 255);
  FastLED.show();
  delay(500);
  leds[5] = CRGB(150, 0, 255);
  FastLED.show();
  delay(500);
  leds[9] = CRGB(255, 200, 20);
  FastLED.show();
  delay(500);
  leds[14] = CRGB(85, 60, 180);
  FastLED.show();
  delay(500);
  leds[19] = CRGB(50, 255, 20);
  FastLED.show();
  delay(500);
}

void printWifiStatus()
{
  // print the SSID of the network you're attached to:
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());

  // print your board's IP address:
  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);

  // print the received signal strength:
  long rssi = WiFi.RSSI();
  Serial.print("signal strength (RSSI):");
  Serial.print(rssi);
  Serial.println(" dBm");

  Serial.print("To see this page in action, open a browser to http://");
  Serial.println(ip);
}

void enable_WiFi()
{
  // check for the WiFi module:
  if (WiFi.status() == WL_NO_MODULE)
  {
    Serial.println("Communication with WiFi module failed!");
    // don't continue
    while (true)
      ;
  }

  String fv = WiFi.firmwareVersion();
  if (fv < "1.0.0")
  {
    Serial.println("Please upgrade the firmware");
  }
}

void connect_WiFi()
{
  // attempt to connect to Wifi network:
  while (status != WL_CONNECTED)
  {
    Serial.print("Attempting to connect to SSID: ");
    Serial.println(ssid);
    // Connect to WPA/WPA2 network. Change this line if using open or WEP network:
    status = WiFi.begin(ssid, pass);

    // wait 10 seconds for connection:
    delay(10000);
  }
}

void handleRequest()
{
  if (!client)
    return;

  Serial.println("new client"); // print a message out the serial port
  String currentLine = "";      // make a String to hold incoming data from the client
  String action = "";
  while (client.connected())
  { // loop while the client's connected
    if (client.available())
    {                         // if there's bytes to read from the client,
      char c = client.read(); // read a byte, then
      Serial.write(c);        // print it out the serial monitor
      if (c == '\n')
      { // if the byte is a newline character

        // if the current line is blank, you got two newline characters in a row.
        // that's the end of the client HTTP request, so send a response:
        if (currentLine.length() == 0)
        {
          if (action == "GET /health")
          {
            // HTTP headers always start with a response code (e.g. HTTP/1.1 200 OK)
            // and a content-type so the client knows what's coming, then a blank line:
            client.println("HTTP/1.1 200 OK");
            client.println("Content-type:text/html");
            client.println();
            client.print("<body>Hello world!</body>");
            // The HTTP response ends with another blank line:
            client.println();
            // break out of the while loop:
            break;
          }
          else if (action == "POST /color")
          {
            // HTTP headers always start with a response code (e.g. HTTP/1.1 200 OK)
            // and a content-type so the client knows what's coming, then a blank line:
            client.println("HTTP/1.1 501 Not Implemented");
            client.println("Content-type:text/plain");
            client.println();
            client.print("Color setting will come in future");
            // The HTTP response ends with another blank line:
            client.println();
            // break out of the while loop:
            break;
          }
          else
          {
            // HTTP headers always start with a response code (e.g. HTTP/1.1 200 OK)
            // and a content-type so the client knows what's coming, then a blank line:
            client.println("HTTP/1.1 400 Bad Request");
            client.println("Content-type:text/plain");
            client.println();
            client.print("Arduino Uno cannot not process the request");
            // The HTTP response ends with another blank line:
            client.println();
            // break out of the while loop:
            break;
          }
        }
        else
        { // if you got a newline, then clear currentLine:
          currentLine = "";
        }
      }
      else if (c != '\r')
      {                   // if you got anything else but a carriage return character,
        currentLine += c; // add it to the end of the currentLine
      }

      if (currentLine.endsWith("POST /color"))
      {
        action = "POST /color";
      }
      if (currentLine.endsWith("GET /health"))
      {
        action = "GET /health";
      }
    }
  }
  // close the connection:
  client.stop();
  Serial.println("client disconnected");
}