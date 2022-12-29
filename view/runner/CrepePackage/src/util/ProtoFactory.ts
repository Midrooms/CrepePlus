//ts-proto generated types required, import them here
import * as types from "../data/proto/StarRail";
import protobufjs from "protobufjs";
import { CmdID, PacketName } from "../server/kcp/Packet"
import Logger, { VerboseLevel } from "./Logger";
const c = new Logger("ProtoFactory");

export class MessageType<T> {
    "encode": (arg0: T) => protobufjs.Writer;
    "fromPartial": (arg0: object) => T;
    "decode": (input: protobufjs.Reader | Uint8Array, length?: number)=> T;
    // "fromJSON": (object: any)=>T;
    // "toJSON": (message: T)=> unknown
    //you can add more fields here from the generated types
    //fromjson etc...
}


const messageTypeMap = new Map<PacketName, MessageType<any>>();
const messageTypeMapReversed = new Map<MessageType<any>, PacketName>();



function isMessageType<T>(type: MessageType<T> | any): type is MessageType<T> {
    return (<MessageType<T>>type).encode !== undefined;
}


export default class ProtoFactory {

    // ONLY USE THIS IF YOU'RE DECODING SOMETHING DONT USE IT TO SEND SHIT
    // BECAUSE THEN YOU FUCK YOUR TYPECHECKING

    static getType(name: PacketName) {
        return messageTypeMap.get(name) as MessageType<any>;
    }

    static getName(type: MessageType<any>) {
        return messageTypeMapReversed.get(type) as PacketName;
    }

    static init() {
        //iterate over everything in types and check if they are a MessageType
        for (const key of Object.keys(types)) {
            const value = types[key as keyof typeof types];
            if (isMessageType(value)) {
                if (Object.values(CmdID).includes(key)) {
                    messageTypeMap.set(key as PacketName, value);
                    messageTypeMapReversed.set(value, key as PacketName);
                } else {
                    // there are some types that are not packets, but are still MessageType
                    // you can figure out what you want to do with them here
                }
            }
        }

        if (Logger.VERBOSE_LEVEL > VerboseLevel.ALL) c.log(`Initialized with ${messageTypeMap.size} types`);

        //c.log(this.getName(types.PlayerLoginScRsp))
        // return;

        //if you want a partial type
    }
}




