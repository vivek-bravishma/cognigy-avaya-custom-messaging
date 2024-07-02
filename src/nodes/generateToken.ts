import {
	createNodeDescriptor,
	INodeFunctionBaseParams,
} from "@cognigy/extension-tools";

import axios, { AxiosRequestConfig } from "axios";
import { INodeExecutionAPI } from "@cognigy/extension-tools/build/interfaces/descriptor";

const contextKey = "avaya_custom_messaging";

export interface IGenTokenParams extends INodeFunctionBaseParams {
	config: {
		connection: {
			baseUrl: string;
			accountId: string;
			grantType: string;
			clientId: string;
			clientSecret: string;

			channelProviderId: string;
			channelId: string;
			integrationId: string;
		};
	};
}

export const accessTokenNode = createNodeDescriptor({
	type: "accessToken",
	defaultLabel: "Generate Access Token",
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
	],
	form: [
		{
			type: "field",
			key: "connection",
		},
	],
	function: async ({ cognigy, config }: IGenTokenParams) => {
		const { api } = cognigy;
		const { connection } = config;
		const {
			baseUrl,
			accountId,
			grantType,
			clientSecret,
			clientId,
		} = connection;

		let access_token = await getToken(
			baseUrl,
			accountId,
			grantType,
			clientSecret,
			clientId
		);

		api.addToContext(contextKey + ".access_token", access_token, "simple");
		api.log("info", "api.addToContext(access_token) called");
	},
});

async function getToken(
	baseUrl: string,
	accountId: string,
	grantType: string,
	clientSecret: string,
	clientId: string
): Promise<any> {
	let access_token = null;
	try {
		let options: AxiosRequestConfig = {
			method: "POST",
			url: `${baseUrl}/api/auth/v1/${accountId}/protocol/openid-connect/token`,
			headers: {
				accept: "application/json",
				"Content-Type": "application/x-www-form-urlencoded",
			},
			data: {
				grantType,
				clientId,
				clientSecret,
			},
		};

		let resp = await axios.request(options);
		console.log("token resp ===> ", resp.data);
		if (resp.status === 200) access_token = resp.data.access_token;
	} catch (err) {
		console.log("Error while requesting token==> ", err);
	}
	return access_token;
}
