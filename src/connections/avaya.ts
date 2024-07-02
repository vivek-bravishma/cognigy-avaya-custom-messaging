import { IConnectionSchema } from "@cognigy/extension-tools";

export const avayaApiConfig: IConnectionSchema = {
	type: "avaya-api",
	label: "Avaya API Key",
	fields: [
		{ fieldName: "baseUrl" },
		{ fieldName: "accountId" },

		{ fieldName: "grantType" }, // token
		{ fieldName: "clientSecret" }, // token
		{ fieldName: "clientId" }, // token and snd msg

		{ fieldName: "channelProviderId" },
		{ fieldName: "channelId" },
		{ fieldName: "integrationId" },
		// { fieldName: "callbackUrl" },
	],
};
