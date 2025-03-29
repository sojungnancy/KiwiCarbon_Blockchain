import serial
import serial.tools.list_ports
import time
import requests
from datetime import datetime

# Global constants and configuration
CALL_SLAVE = "NIGGA"
EXPECTED_RESPONSE_CONTROL = "yes master"
EXPECTED_RESPONSE_ATTACK = "KKK"
BAUD_RATE = 9600
SERIAL_TIMEOUT = 2  # Use a shorter per-read timeout for responsiveness
VALIDATION_TIMEOUT = 5  # Total timeout (in seconds) per port validation
BACKEND_URL = "http://localhost:3001"
authtoken = ""
# ----------------------------
# Port Detection & Validation
# ----------------------------

def list_ports():
    """List available serial port names."""
    ports = list(serial.tools.list_ports.comports())
    return [port.device for port in ports]

def validate_port2(port, call_message, expected_response, timeout=VALIDATION_TIMEOUT):
    """
    Open the port, send the call_message, and wait for the expected response.
    Returns True if the expected response is received within the timeout.
    """
    try:
        with serial.Serial(port, BAUD_RATE, timeout=SERIAL_TIMEOUT) as ser:
            ser.reset_input_buffer()
            ser.write((call_message + "\n").encode('utf-8'))
            print((call_message + "\n").encode('utf-8'), flush=True)
            start_time = time.time()
            print(f"Start time: {start_time}", flush=True)
            while time.time() - start_time < timeout:
                # Print debug info every iteration (or adjust the interval as needed)
                elapsed = time.time() - start_time
                print(f"Waiting for response on {port}... ({elapsed:.1f}s elapsed)", flush=True)
                if ser.in_waiting:
                    response = ser.readline().decode('utf-8').strip()
                    print(f"Response on {port}: {response}", flush=True)
                    if response == expected_response:
                        return True
                time.sleep(0.1)  # Short delay to avoid busy waiting
        return False
    except Exception as e:
        print(f"Error validating port {port}: {e}", flush=True)
        return False

def validate_port(port, call_message, expected_response, timeout=VALIDATION_TIMEOUT):
    print(f"Attempting to open port {port}", flush=True)
    try:
        ser = serial.Serial(
            port=port,
            baudrate=9600,
            timeout=1,
            write_timeout=1,
            rtscts=False,
            dsrdtr=False
        )
        print(f"Successfully opened port {port}", flush=True)
        ser.reset_input_buffer()
        print(f"Cleared input buffer for {port}", flush=True)
        ser.write((call_message + "\n").encode('utf-8'))
        print(f"Sent message to {port}: {(call_message + '\n').encode('utf-8')}", flush=True)
        start_time = time.time()
        print(f"Start time: {start_time}", flush=True)
        while time.time() - start_time < timeout:
            elapsed = time.time() - start_time
            print(f"Waiting for response on {port}... ({elapsed:.1f}s elapsed)", flush=True)
            if ser.in_waiting:
                response = ser.readline().decode('utf-8').strip()
                print(f"Response on {port}: {response}", flush=True)
                if response == expected_response:
                    ser.close()
                    return True
            time.sleep(0.1)
        ser.close()
        return False
    except Exception as e:
        print(f"Error validating port {port}: {e}", flush=True)
        return False

def find_valid_ports():
    """
    Automatically scan available ports and validate them.
    Returns a tuple (control_port, attack_port) if found.
    """
    control_port = None
    attack_port = None
    ports = list_ports()
    print("Available ports:", ports)
    for port in ports:
        print(f"Testing port: {port}")
        # Test for control device first
        if validate_port(port, CALL_SLAVE, EXPECTED_RESPONSE_CONTROL):
            print(f"Port {port} validated as Control port.")
            control_port = port
        elif validate_port(port, CALL_SLAVE, EXPECTED_RESPONSE_ATTACK):
            print(f"Port {port} validated as Attack port.")
            attack_port = port
        # If both ports are found, exit early
        if control_port and attack_port:
            break
    return control_port, attack_port

# ----------------------------
# Global Authentication Function
# ----------------------------

def authenticate():
    """
    Authenticate with the backend and update the global authtoken.
    """
    global authtoken
    logindata = {
        "name": "comp",
        "password": "1234"
    }
    try:
        authResponse = requests.post(BACKEND_URL + "/api/auth/login", json=logindata)
        if authResponse.status_code == 200:
            authtoken = authResponse.json()["token"]
            print("Login successful. Token:", authtoken, flush=True)
            return True
        else:
            print("Login failed with status code:", authResponse.status_code, flush=True)
            return False
    except Exception as e:
        print("Error during authentication:", e, flush=True)
        return False

# ----------------------------
# Data Transmission Functions
# ----------------------------

def post_data(data_batch):
    """Send the buffered data to the backend server via HTTP POST."""
    global authtoken
    # Ensure we have a valid token
    if not authtoken:
        if not authenticate():
            print("Authentication failed. Cannot post data.", flush=True)
            return

    testPayload = {
        "sensorId": 11,
        "readingValue": 1
    }
    
    headers = {
        "Authorization": f"Bearer {authtoken}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(BACKEND_URL + '/api/sensors/report_reading', json=testPayload, headers=headers)
        if response.status_code == 201:
            print("Data posted successfully:", response.json(), flush=True)
        else:
            print(f"Failed to post data. Status code: {response.status_code}", flush=True)
    except Exception as e:
        print(f"Error posting data: {e}", flush=True)

# ----------------------------
# Serial Connection Functions
# ----------------------------

def open_serial_connection(port):
    """Open a serial connection on the given port."""
    try:
        ser = serial.Serial(port, BAUD_RATE, timeout=SERIAL_TIMEOUT)
        print(f"Opened serial connection on {port}")
        return ser
    except Exception as e:
        print(f"Error opening serial connection on {port}: {e}")
        return None

def read_sensor_value(ser, timeout=3):
    """
    Read lines from the serial connection until a numeric value is obtained 
    or until the timeout expires.
    Returns the sensor value as a float, or None if no valid reading is found.
    """
    start_time = time.time()
    while time.time() - start_time < timeout:
        try:
            # Read one line from the serial port
            line = ser.readline().decode('utf-8').strip()
            if not line:
                continue  # skip empty lines
            try:
                # Try to convert the line to float
                value = float(line)
                return value
            except ValueError:
                # If conversion fails, log and ignore the non-numeric line
                print(f"Ignoring non-numeric reading: {line}", flush=True)
                continue
        except Exception as e:
            print(f"Error reading sensor value: {e}", flush=True)
            return None
    # If no valid reading is found within the timeout
    return None

# ----------------------------
# Data Transmission Functions
# ----------------------------

def post_data(average_value):
    """Send the average sensor reading to the backend server via HTTP POST."""
    global authtoken
    # Ensure we have a valid token
    if not authtoken:
        if not authenticate():
            print("Authentication failed. Cannot post data.", flush=True)
            return

    payload = {
        "sensorId": 15,
        "readingValue": min(max(average_value - 360, 0), 1000)/1000
    }
    
    headers = {
        "Authorization": f"Bearer {authtoken}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(BACKEND_URL + '/api/sensors/report_reading', json=payload, headers=headers)
        if response.status_code == 201:
            print("Data posted successfully:", response.json(), flush=True)
        else:
            print(f"Failed to post data. Status code: {response.status_code}", flush=True)
    except Exception as e:
        print(f"Error posting data: {e}", flush=True)

# ----------------------------
# Testing Functions
# ----------------------------

def test_port_detection():
    """Test the port detection functionality."""
    control_port, attack_port = find_valid_ports()
    print("Control Port:", control_port)
    print("Attack Port:", attack_port)

def test_readings():
    """Test reading one sensor value from each validated port."""
    control_port, attack_port = find_valid_ports()
    if not (control_port and attack_port):
        print("Not enough valid ports found.")
        return
    ser_control = open_serial_connection(control_port)
    ser_attack = open_serial_connection(attack_port)
    if ser_control is None or ser_attack is None:
        print("Error opening serial connections.")
        return
    try:
        control_val = read_sensor_value(ser_control)
        attack_val = read_sensor_value(ser_attack)
        print(f"Control reading: {control_val}")
        print(f"Attack reading: {attack_val}")
        if control_val is not None and attack_val is not None:
            total = control_val + attack_val
            print(f"Total Emission: {total}")
    finally:
        ser_control.close()
        ser_attack.close()

def test_posting():
    """Test data posting by sending an average sensor reading to the backend."""
    # Example average value
    average_value = 150
    post_data(average_value)

# ----------------------------
# Main Loop Functionality
# ----------------------------

def main_loop():
    """
    Main loop: open two serial connections, continuously read sensor values,
    sum them, buffer 12 readings, calculate the average, and post that average value.
    If an Arduino disconnects, attempt to reconnect.
    """
    control_port, attack_port = find_valid_ports()
    if not (control_port and attack_port):
        print("Not enough valid ports found. Exiting.", flush=True)
        return

    ser_control = open_serial_connection(control_port)
    ser_attack = open_serial_connection(attack_port)
    if ser_control is None or ser_attack is None:
        print("Error opening serial connections. Exiting.", flush=True)
        return

    sensor_values = []  # Buffer for total readings
    control_fail_count = 0
    attack_fail_count = 0
    FAIL_THRESHOLD = 3  # Number of consecutive failures before reconnection

    try:
        while True:
            # Read from control Arduino
            val_control = read_sensor_value(ser_control)
            if val_control is None:
                control_fail_count += 1
                print(f"Control reading failed {control_fail_count} times.", flush=True)
                if control_fail_count >= FAIL_THRESHOLD:
                    print("Reconnecting control Arduino...", flush=True)
                    try:
                        ser_control.close()
                    except Exception:
                        pass
                    time.sleep(1)
                    ser_control = open_serial_connection(control_port)
                    control_fail_count = 0
                    continue  # Skip this iteration
            else:
                control_fail_count = 0

            # Read from attack Arduino
            val_attack = read_sensor_value(ser_attack)
            if val_attack is None:
                attack_fail_count += 1
                print(f"Attack reading failed {attack_fail_count} times.", flush=True)
                if attack_fail_count >= FAIL_THRESHOLD:
                    print("Reconnecting attack Arduino...", flush=True)
                    try:
                        ser_attack.close()
                    except Exception:
                        pass
                    time.sleep(1)
                    ser_attack = open_serial_connection(attack_port)
                    attack_fail_count = 0
                    continue  # Skip this iteration
            else:
                attack_fail_count = 0

            # Only process if both values are available
            if val_control is not None and val_attack is not None:
                total = val_control + val_attack
                sensor_values.append(total)
                print(f"Read total value: {total}", flush=True)
            else:
                print("One or both readings are None.", flush=True)

            # When 12 readings are collected, average and post
            if len(sensor_values) >= 12:
                avg_value = int(sum(sensor_values) / len(sensor_values))
                print(f"Posting average value: {avg_value}", flush=True)
                post_data(avg_value)
                sensor_values.clear()

            time.sleep(0.1)  # Adjust delay as needed
    finally:
        try:
            ser_control.close()
        except Exception:
            pass
        try:
            ser_attack.close()
        except Exception:
            pass
# ----------------------------
# Main Function for Testing
# ----------------------------

def main():
    print("Select functionality to test:")
    print("1. Test Port Detection")
    print("2. Test Readings")
    print("3. Test Data Posting")
    print("4. Run Main Loop")
    choice = input("Enter choice (1-4): ")
    if choice == "1":
        test_port_detection()
    elif choice == "2":
        test_readings()
    elif choice == "3":
        test_posting()
    elif choice == "4":
        main_loop()
    else:
        print("Invalid choice.")

if __name__ == "__main__":
    main()
