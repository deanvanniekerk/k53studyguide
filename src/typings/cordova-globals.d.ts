declare const device: device.Device;

declare namespace device {
    export interface Device {
        name: string;
        version: string;
        uuid: string;
        platform: string;
    }
}
