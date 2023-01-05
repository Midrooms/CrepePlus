// client id for setting rpc
const clientID = "1054053726723252324";
// default is "Offline"
var status;
const pkx = require('../package.json');
status = `Idle - Not in CrepePlus (CrepePlus v${pkx.version})`;

// online image stuff (defaults)
const onlineDeta = "In PS - CrepePlus (CrepeSR)";
const onlineState = `Playing CrepePlus (mitmproxy - CrepePlus ${pkx.version})`;
const onlineLargeImageKey = "icon";
const onlineLargeImageText = "CrepeSR - CrepePlus"
const onlineSmallImageKey = "online";
const onlineSmallImageText = "Connected to PS";

// offline image stuff (defaults)
const offlineDeta = "Offline - CrepeSR";
const offlineLargeImageKey = "icon";
const offlineLargeImageText = "Offline (idle)";
const offlineSmallImageKey = "8997_offline_1_";
const offlineSmallImageText = "User is offline";


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