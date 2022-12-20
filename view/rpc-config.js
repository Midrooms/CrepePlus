// client id for setting rpc
const clientID = "1054053726723252324";
// default is "Offline"
var status;
status = "Idle - Not in CrepePlus";


// online image stuff
const onlineDeta = "CrepePlus - In PS";
const onlineState = "Playing CrepePlus (mitmproxy)";
const onlineLargeImageKey = "icon";
const onlineLargeImageText = "On CrepeSR - CrepePlus"
const onlineSmallImageKey = "online";
const onlineSmallImageText = "Connected to PS";

// offline image stuff
const offlineDeta = "CrepePlus - Offline";
const offlineLargeImageKey = "icon";
const offlineLargeImageText = "Offline (idle)";
const offlineSmallImageKey = "8997_offline_1_";
const offlineSmallImageText = "User is offline"
module.exports = {
    status,
    clientID,

    onlineDeta,
    onlineState,
    onlineLargeImageKey,
    onlineLargeImageText,
    onlineSmallImageKey,
    onlineSmallImageText,

    offlineDeta,
    offlineLargeImageKey,
    offlineLargeImageText,
    offlineSmallImageKey,
    offlineSmallImageText
}