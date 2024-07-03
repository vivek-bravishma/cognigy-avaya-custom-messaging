import { createExtension } from "@cognigy/extension-tools";
import { avayaApiConfig } from "./connections/avaya";
import { sendMessageNode } from "./nodes/sendMessage";
export default createExtension({
	nodes: [sendMessageNode],
	connections: [avayaApiConfig],
	options: {label: "Avaya Custom Messaging"}
});