import { GetDialogueEventDataScRsp } from "../../data/proto/StarRail";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    session.send(GetDialogueEventDataScRsp, {
        dialogueEventList: [],
        retcode: 0
    } as GetDialogueEventDataScRsp);
}