import {
	createNodeDescriptor,
	INodeFunctionBaseParams,
} from "@cognigy/extension-tools";

import axios, { AxiosRequestConfig } from "axios";
import { INodeExecutionAPI } from "@cognigy/extension-tools/build/interfaces/descriptor";

const contextKey = "avaya_custom_messaging";

export interface ISendMsgParams extends INodeFunctionBaseParams {
	config: {
		connection: {
			baseUrl: string;
			accountId: string;
			grantType: string;
			clientSecret: string;
			clientId: string;
			channelProviderId: string;
			channelId: string;
			integrationId: string;
		};
		text: string;
		token: string;
	};
}

export const sendMessage = createNodeDescriptor({
	type: "sendCustomMessage",
	defaultLabel: "Send Custom Message to Avaya",
	fields: [
		{
			key: "connection",
			label: "Avaya API Connection",
			type: "connection",
			params: {
				connectionType: "avaya-api",
				required: true,
			},
		},
		{
			key: "token",
			type: "cognigyText",
			label: "Token",
			defaultValue: "{{context.avaya_custom_messaging.access_token}}",
			params: {
				required: true,
			},
		},
		{
			key: "text",
			type: "cognigyText",
			label: "Text Message",
			defaultValue: "{{input.text}}",
			params: {
				required: true,
			},
		},
	],
	sections: [
		{
			key: "data",
			label: "Data",
			defaultCollapsed: true,
			fields: ["text", "token"],
		},
	],
	form: [
		{
			type: "field",
			key: "connection",
		},
		{
			type: "section",
			key: "data",
		},
	],

	function: async ({ cognigy, config }: ISendMsgParams) => {
		const { api, input } = cognigy;
		// const { connection } = config;
		const { text, token, connection } = config;

		const {
			baseUrl,
			accountId,
			channelProviderId,
			channelId,
			integrationId,
		} = connection;

		if (!text) throw new Error("The user message text is missing.");
		if (!token) throw new Error("The token is missing.");

		if (!baseUrl)
			throw new Error("The baseUrl of avaya custom messaging is missing");
		if (!accountId)
			throw new Error(
				"The account_id to avaya custom messaging is missing"
			);
		if (!channelProviderId)
			throw new Error(
				"The channelProviderId of avaya custom messaging is missing"
			);
		if (!channelId)
			throw new Error(
				"The channelId to avaya custom messaging is missing"
			);
		if (!integrationId)
			throw new Error(
				"The integrationId of avaya custom messaging is missing"
			);

		let message_type = "text";
		let mobileNo = 9090909090;

		try {
			let body;
			let attachments = [];

			// console.log('Message Type ==> ', message_type)
			if (message_type === "text") {
				body = {
					elementType: "text",
					elementText: { text: text },
				};
			}
			// else if (
			// 	message_type === "image" ||
			// 	message_type === "audio" ||
			// 	message_type === "video" ||
			// 	message_type === "file"
			// ) {
			// 	body = {
			// 		elementType: message_type,
			// 		elementText: {
			// 			text: message ? message : "",
			// 		},
			// 	};
			// 	attachments.push({
			// 		attachmentId: fileDetails.mediaId,
			// 	});
			// } else if (message_type === "location") {
			// 	body = {
			// 		elementType: "location",
			// 		elementText: {
			// 			text: message ? message : "",
			// 			textFormat: "PLAINTEXT",
			// 		},
			// 		richMediaPayload: {
			// 			coordinates: {
			// 				lat: locationDetails.lat,
			// 				long: locationDetails.long,
			// 			},
			// 		},
			// 	};
			// }

			console.log("//Sending Message");
			let options: AxiosRequestConfig = {
				method: "POST",
				url: `${baseUrl}/api/digital/custom-messaging/v1/accounts/${accountId}/messages`,
				headers: {
					accept: "application/json",
					authorization: `Bearer ${token}`,
					"content-type": "application/json",
				},
				data: {
					customerIdentifiers: {
						mobile: [mobileNo],
					},
					body: body,
					attachments,
					channelProviderId,
					channelId: "Messaging",
					senderName: "cog_test_sender",
					businessAccountName: integrationId,
					// providerDialogId: channel,
					providerDialogId: mobileNo,
					// customData: {
					// 	msngChannel: channel,
					// 	customerMobileNo: mobileNumber ? mobileNumber : null,
					// },
					headers: {
						// sourceType: channel,
					},
					// engagementParameters: {
					// 	customch: "customch",
					// 	customerMobileNo: mobileNumber ? mobileNumber : null,
					// },
				},
			};

			console.log(
				"let avaya_send_msg_payload= ",
				JSON.stringify(options)
			);

			let resp = await axios.request(options);
			// console.log('send message response data==> ', resp.data)
			// return resp.data;
			api.log(
				"info",
				"custom async message send=> " + JSON.stringify(resp.data)
			);
			api.addToContext(contextKey + ".message_send", resp.data, "array");
		} catch (error) {
			console.log("error.data sendmessage==> ", error.message);
			// throw error.message;
			api.log(
				"error",
				"custom async message send=> " + JSON.stringify(error.message)
			);
			api.addToContext(
				contextKey + ".message_send",
				error.message,
				"array"
			);
		}
	},
	// if (holidayURL !== "") {
	// 	const result = await getOfficeHours(
	// 		apiKey,
	// 		holidayURL,
	// 		CONST_HOUR_TYPE_HOLIDAY,
	// 		domain,
	// 		tenantId,
	// 		holidayContextKey,
	// 		api
	// 	);
	// 	api.addToContext(holidayContextKey, result.data, "simple");
	// 	api.log("info", "api.addToContextHoliday() called");
	// }
});

// async function sendMessage(
// 	baseUrl: string,
// 	accountId: string,

// 	channelProviderId: string,
// 	channelId: string,
// 	integrationId: string,

// 	access_token: string,

// 	sender: string,
// 	message: string,
// 	mobileNo: string,
// 	channel: string,
// 	message_type: string,
// 	fileDetails: string,
// 	locationDetails: string,
// 	mobileNumber: string
// ): Promise<any> {
// 	try {
// 		let body;
// 		let attachments = [];

// 		if (message_type === "text") {
// 			body = {
// 				elementType: "text",
// 				elementText: { text: message },
// 			};
// 		}
// 		// else if (
// 		// 	message_type === "image" ||
// 		// 	message_type === "audio" ||
// 		// 	message_type === "video" ||
// 		// 	message_type === "file"
// 		// ) {
// 		// 	body = {
// 		// 		elementType: message_type,
// 		// 		elementText: {
// 		// 			text: message ? message : "",
// 		// 		},
// 		// 	};
// 		// 	attachments.push({
// 		// 		attachmentId: fileDetails.mediaId,
// 		// 	});
// 		// } else if (message_type === "location") {
// 		// 	body = {
// 		// 		elementType: "location",
// 		// 		elementText: {
// 		// 			text: message ? message : "",
// 		// 			textFormat: "PLAINTEXT",
// 		// 		},
// 		// 		richMediaPayload: {
// 		// 			coordinates: {
// 		// 				lat: locationDetails.lat,
// 		// 				long: locationDetails.long,
// 		// 			},
// 		// 		},
// 		// 	};
// 		// }

// 		console.log("//Sending Message");
// 		var options: AxiosRequestConfig = {
// 			method: "POST",
// 			url: `${baseUrl}/api/digital/custom-messaging/v1/accounts/${accountId}/messages`,
// 			headers: {
// 				accept: "application/json",
// 				authorization: `Bearer ${access_token}`,
// 				"content-type": "application/json",
// 			},
// 			data: {
// 				customerIdentifiers: {
// 					mobile: [mobileNo],
// 				},
// 				body: body,
// 				attachments,
// 				channelProviderId,
// 				channelId: channelId || "Messaging",
// 				senderName: sender,
// 				businessAccountName: integrationId,
// 				// providerDialogId: channel,
// 				providerDialogId: mobileNo,
// 				customData: {
// 					msngChannel: channel,
// 					customerMobileNo: mobileNumber ? mobileNumber : null,
// 				},
// 				headers: {
// 					sourceType: channel,
// 				},
// 				engagementParameters: {
// 					customch: "customch",
// 					customerMobileNo: mobileNumber ? mobileNumber : null,
// 				},
// 			},
// 		};

// 		console.log("let avaya_send_msg_payload= ", JSON.stringify(options));

// 		let resp = await axios.request(options);
// 		console.log("send message response data==> ", resp.data);
// 		return resp.data;
// 	} catch (err) {
// 		console.log("Error while sending async message==> ", err);
// 	}
// }
