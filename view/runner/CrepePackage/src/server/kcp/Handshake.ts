export enum HandshakeType {
    CONNECT = 1,
    DISCONNECT = 2,
    SEND_BACK_CONV = 3,
    UNKNOWN = 4
}

export default class Handshake {
    private static readonly CONNECT: number[] = [0xff, 0xFFFFFFFF]
    private static readonly SEND_BACK_CONV: number[] = [0x145, 0x14514545]
    private static readonly DISCONNECT: number[] = [0x194, 0x19419494]

    public readonly conv: number;
    public readonly type: number[];
    public readonly handshakeType!: HandshakeType;
    public readonly token: number;
    public readonly data: number;

    public constructor(public readonly bytes: Buffer | HandshakeType) {
        if (Buffer.isBuffer(bytes)) {
            this.conv = bytes.readUInt32BE(4);
            this.token = bytes.readUInt32BE(8);
            this.data = bytes.readUInt32BE(12);
            this.type = [bytes.readUInt32BE(0), bytes.readUInt32BE(16)];
            this.handshakeType = this.decodeType();
        } else {
            this.conv = 0x69;
            this.token = 0x420;
            this.data = 0;
            this.type = Handshake.SEND_BACK_CONV;
            this.handshakeType = HandshakeType.SEND_BACK_CONV;
        }
    }

    public encode(): Buffer {
        const buf = Buffer.alloc(20);
        buf.writeUInt32BE(this.type[0]);
        buf.writeUInt32BE(this.conv, 4);
        buf.writeUInt32BE(this.token, 8);
        buf.writeUInt32BE(this.data, 12);
        buf.writeUInt32BE(this.type[1], 16);
        return buf;
    }

    public decodeType(): HandshakeType {
        if (this.type[0] == Handshake.CONNECT[0] && this.type[1] == Handshake.CONNECT[1]) {
            return HandshakeType.CONNECT;
        }
        if (this.type[0] == Handshake.SEND_BACK_CONV[0] && this.type[1] == Handshake.SEND_BACK_CONV[1]) {
            return HandshakeType.SEND_BACK_CONV
        }
        if (this.type[0] == Handshake.DISCONNECT[0] && this.type[1] == Handshake.DISCONNECT[1]) {
            return HandshakeType.DISCONNECT;
        }
        return HandshakeType.UNKNOWN;
    }
}