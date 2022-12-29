import Packet from "../kcp/Packet";
import Session from "../kcp/Session";
import SRServer from "../kcp/SRServer";

export default async function handle(session: Session, packet: Packet) {
    // Remove from session list
    SRServer.getInstance().sessions.delete(session.id);
}