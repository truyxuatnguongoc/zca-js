import { ZaloApiError } from "../Errors/ZaloApiError.js";
import { ThreadType } from "../models/index.js";
import { apiFactory } from "../utils.js";

export type SendLinkOptions = {
    msg?: string;
    link: string;
    ttl?: number;
};

export type SendLinkResponse = {
    msgId: string;
};

export const sendLinkFactory = apiFactory<SendLinkResponse>()((api, ctx, utils) => {
    const serviceURL = {
        [ThreadType.User]: utils.makeURL(`${api.zpwServiceMap.chat[0]}/api/message/link`, {
            nretry: 0,
        }),
        [ThreadType.Group]: utils.makeURL(`${api.zpwServiceMap.group[0]}/api/group/sendlink`, {
            nretry: 0,
        }),
    };

    /**
     * Send link
     *
     * @param options Link and ttl
     * @param threadId Thread ID
     * @param type Thread type
     *
     * @throws ZaloApiError
     */
    return async function sendLink(options: SendLinkOptions, threadId: string, type: ThreadType = ThreadType.User) {
        const res = await api.parseLink(options.link);

        const params: any = {
            msg:
                options.msg && options.msg.trim()
                    ? options.msg.includes(options.link)
                        ? options.msg
                        : options.msg + " " + options.link
                    : options.link,
            href: res.data.href,
            src: res.data.src,
            title: res.data.title,
            desc: res.data.desc,
            thumb: res.data.thumb,
            type: 2, // 0
            media: JSON.stringify(res.data.media),
            ttl: options.ttl ?? 0,
            clientId: Date.now(),
        };

        if (type == ThreadType.Group) {
            params.grid = threadId;
            params.imei = ctx.imei;
            // params.mentionInfo = "[]"; @TODO: implement this
        } else {
            params.toId = threadId;
            params.mentionInfo = "";
        }

        const encryptedParams = utils.encodeAES(JSON.stringify(params));
        if (!encryptedParams) throw new ZaloApiError("Failed to encrypt params");

        const response = await utils.request(serviceURL[type], {
            method: "POST",
            body: new URLSearchParams({
                params: encryptedParams,
            }),
        });

        return utils.resolve(response);
    };
});
