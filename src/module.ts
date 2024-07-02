import { createExtension } from "@cognigy/extension-tools";

import { sendMessage } from "./nodes/sendMessage";
import { avayaApiConfig } from "./connections/avaya";

export default createExtension({
	nodes: [sendMessage],
	connections: [avayaApiConfig],

	options: {
		label: "Avaya Custom Messaging",
	},
});
