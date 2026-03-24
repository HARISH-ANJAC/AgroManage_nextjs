import os from "os";

/**
 * Retrieves the hardware MAC address of the system running the server.
 * Note: Browser clients cannot access local MAC addresses, so this provides 
 * the 'Original System MAC' for the machine hosting the backend service.
 */
export function getSystemMacAddress(): string {
    const interfaces = os.networkInterfaces();
    for (const name in interfaces) {
        const networkInterface = interfaces[name];
        if (networkInterface) {
            for (const iface of networkInterface) {
                // Return the first non-internal, valid MAC address found
                if (!iface.internal && iface.mac && iface.mac !== "00:00:00:00:00:00") {
                    return iface.mac.toUpperCase();
                }
            }
        }
    }
    return "UNKNOWN-MAC";
}
