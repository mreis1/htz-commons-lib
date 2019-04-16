// The baud rate of the port to be opened. This should match one of the commonly available baud rates, such as 110, 300, 1200, 2400, 4800, 9600, 14400, 19200,
let acceptedBaudRates = [9600, 19200, 38400, 57600, 115200];
export function ensureValidBaudRate(value: number, defaultValue?) {
    if (acceptedBaudRates.indexOf(value) >= 0) {
        return value;
    } else {
        return defaultValue;
    }
}