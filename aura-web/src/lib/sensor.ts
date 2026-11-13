// Aura Sensor: reads heart rate from a band that broadcasts the standard
// BLE Heart Rate service (e.g. Xiaomi Smart Band with "Heart rate sharing" on).
// Web Bluetooth only works in Chrome/Edge (desktop or Android), not Safari/iOS.

interface BluetoothLike {
  requestDevice(opts: unknown): Promise<{
    name?: string;
    gatt?: { connect(): Promise<GattServer> };
    addEventListener(t: string, cb: () => void): void;
  }>;
}
interface GattServer {
  getPrimaryService(s: string): Promise<{
    getCharacteristic(c: string): Promise<Characteristic>;
  }>;
}
interface Characteristic extends EventTarget {
  value?: DataView;
  startNotifications(): Promise<unknown>;
}

export function sensorSupported() {
  return typeof navigator !== 'undefined' && 'bluetooth' in navigator;
}

export async function connectSensor(
  onPulse: (bpm: number) => void,
  onDisconnect: () => void,
): Promise<string> {
  const bt = (navigator as unknown as { bluetooth: BluetoothLike }).bluetooth;
  const device = await bt.requestDevice({
    filters: [{ services: ['heart_rate'] }],
  });
  device.addEventListener('gattserverdisconnected', onDisconnect);
  const server = await device.gatt!.connect();
  const service = await server.getPrimaryService('heart_rate');
  const ch = await service.getCharacteristic('heart_rate_measurement');
  ch.addEventListener('characteristicvaluechanged', () => {
    const v = ch.value!;
    // Flags bit 0: 0 → uint8 value, 1 → uint16 value
    const bpm = v.getUint8(0) & 1 ? v.getUint16(1, true) : v.getUint8(1);
    if (bpm > 0) onPulse(bpm);
  });
  await ch.startNotifications();
  return device.name ?? 'Aura Sensor';
}
