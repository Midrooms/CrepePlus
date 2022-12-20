import _KCP from 'node-kcp-token';
import Logger from "../../util/Logger";
import { Socket, createSocket, RemoteInfo } from "dgram";
import Session from "./Session";
import Config from "../../util/Config";
import Handshake, { HandshakeType } from "./Handshake";
const KCP = _KCP.KCP;
const c = new Logger("KCP", "yellow");

export default class SRServer {
    private static instance: SRServer;
    public readonly udpSocket: Socket;
    public readonly sessions: Map<string, Session> = new Map();

    private constructor() {
        this.udpSocket = createSocket("udp4");
    }

    public static getInstance(): SRServer {
        if (!SRServer.instance) {
            SRServer.instance = new SRServer();
        }
        return SRServer.instance;
    }

    public start() {
        this.udpSocket.bind(Config.GAMESERVER.SERVER_PORT, "0.0.0.0");

        this.udpSocket.on('listening', () => this.onListening());
        this.udpSocket.on('message', (d, i) => this.onMessage(d, i));
        this.udpSocket.on('error', (e) => this.onError(e));
    }

    private async onMessage(data: Buffer, rinfo: RemoteInfo) {
        const client = `${rinfo.address}:${rinfo.port}`;
        if (data.byteLength == 20) {
            // Hamdshanke
            const handshake = new Handshake(data);

            switch (handshake.handshakeType) {
                case HandshakeType.CONNECT:
                    c.log(`${client} connected`);
                    this.handshake(HandshakeType.SEND_BACK_CONV, rinfo);
                    const kcpobj = new KCP(0x69, 0x420, {
                        address: rinfo.address,
                        port: rinfo.port,
                        family: rinfo.family
                    });
                    kcpobj.nodelay(1, 5, 2, 0);
                    kcpobj.output((d, s, u) => this.output(d, s, u));
                    kcpobj.wndsize(256, 256);
                    this.sessions.set(client, new Session(kcpobj, rinfo, client));
                    break;
                case HandshakeType.DISCONNECT:
                    c.log(`${client} disconnected`);
                    this.sessions.delete(client);
                    break;
                default:
                    c.error(`${client} unknown Handshake: ${data.readUint32BE(0)}`);
            }
            return;
        }

        const session = this.sessions.get(client);
        if (!session) return;
        session.inputRaw(data);
    }

    private output(buf: Buffer, size: number, ctx: { address: string, port: number, family: string }) {
        if (!buf) return;
        this.udpSocket.send(buf, 0, size, ctx.port, ctx.address);
    }

    public handshake(hType: HandshakeType, rinfo: RemoteInfo) {
        const rsp = new Handshake(hType).encode();
        this.udpSocket.send(rsp, 0, rsp.byteLength, rinfo.port, rinfo.address);
    }

    private async onError(err: Error) {
        c.error(err);
    }

    private async onListening() {
        c.log(`Listening on 0.0.0.0:${Config.GAMESERVER.SERVER_PORT}`);
    }
}