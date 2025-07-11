'use strict';

var FormData = require('form-data');
var fs = require('node:fs/promises');
var ZaloApiError = require('../Errors/ZaloApiError.cjs');
var Enum = require('../models/Enum.cjs');
require('../models/FriendEvent.cjs');
require('../models/GroupEvent.cjs');
require('../models/Reaction.cjs');
var utils = require('../utils.cjs');

const attachmentUrlType = {
    image: "photo_original/send?",
    gif: "gif?",
    video: "asyncfile/msg?",
    others: "asyncfile/msg?",
};
function prepareQMSGAttach(quote) {
    const quoteData = quote;
    if (typeof quoteData.content == "string")
        return quoteData.propertyExt;
    if (quoteData.msgType == "chat.todo")
        return {
            properties: {
                color: 0,
                size: 0,
                type: 0,
                subType: 0,
                ext: '{"shouldParseLinkOrContact":0}',
            },
        };
    return Object.assign(Object.assign({}, quoteData.content), { thumbUrl: quoteData.content.thumb, oriUrl: quoteData.content.href, normalUrl: quoteData.content.href });
}
function prepareQMSG(quote) {
    const quoteData = quote;
    if (quoteData.msgType == "chat.todo" && typeof quoteData.content != "string") {
        return JSON.parse(quoteData.content.params).item.content;
    }
    return "";
}
exports.TextStyle = void 0;
(function (TextStyle) {
    TextStyle["Bold"] = "b";
    TextStyle["Italic"] = "i";
    TextStyle["Underline"] = "u";
    TextStyle["StrikeThrough"] = "s";
    TextStyle["Red"] = "c_db342e";
    TextStyle["Orange"] = "c_f27806";
    TextStyle["Yellow"] = "c_f7b503";
    TextStyle["Green"] = "c_15a85f";
    TextStyle["Small"] = "f_13";
    TextStyle["Big"] = "f_18";
    TextStyle["UnorderedList"] = "lst_1";
    TextStyle["OrderedList"] = "lst_2";
    TextStyle["Indent"] = "ind_$";
})(exports.TextStyle || (exports.TextStyle = {}));
exports.Urgency = void 0;
(function (Urgency) {
    Urgency[Urgency["Default"] = 0] = "Default";
    Urgency[Urgency["Important"] = 1] = "Important";
    Urgency[Urgency["Urgent"] = 2] = "Urgent";
})(exports.Urgency || (exports.Urgency = {}));
const sendMessageFactory = utils.apiFactory()((api, ctx, utils$1) => {
    const serviceURLs = {
        message: {
            [Enum.ThreadType.User]: utils$1.makeURL(`${api.zpwServiceMap.chat[0]}/api/message`, {
                nretry: 0,
            }),
            [Enum.ThreadType.Group]: utils$1.makeURL(`${api.zpwServiceMap.group[0]}/api/group`, {
                nretry: 0,
            }),
        },
        attachment: {
            [Enum.ThreadType.User]: `${api.zpwServiceMap.file[0]}/api/message/`,
            [Enum.ThreadType.Group]: `${api.zpwServiceMap.file[0]}/api/group/`,
        },
    };
    const { sharefile } = ctx.settings.features;
    function isExceedMaxFile(totalFile) {
        return totalFile > sharefile.max_file;
    }
    function isExceedMaxFileSize(fileSize) {
        return fileSize > sharefile.max_size_share_file_v3 * 1024 * 1024;
    }
    function getGroupLayoutId() {
        return Date.now();
    }
    async function send(data) {
        if (!Array.isArray(data))
            data = [data];
        const requests = [];
        for (const each of data) {
            requests.push((async () => {
                const response = await utils$1.request(each.url, {
                    method: "POST",
                    body: each.body,
                    headers: each.headers,
                });
                return await utils.resolveResponse(ctx, response);
            })());
        }
        return await Promise.all(requests);
    }
    async function upthumb(source, url) {
        let formData = new FormData();
        let buffer = typeof source == "string" ? await fs.readFile(source) : source.data;
        formData.append("fileContent", buffer, {
            filename: "blob",
            contentType: "image/png",
        });
        const params = {
            clientId: Date.now(),
            imei: ctx.imei,
        };
        const encryptedParams = utils$1.encodeAES(JSON.stringify(params));
        if (!encryptedParams)
            throw new ZaloApiError.ZaloApiError("Failed to encrypt message");
        const response = await utils$1.request(utils$1.makeURL(url + "upthumb?", {
            params: encryptedParams,
        }), {
            method: "POST",
            headers: formData.getHeaders(),
            body: formData.getBuffer(),
        });
        return await utils.resolveResponse(ctx, response);
    }
    function handleMentions(type, msg, mentions) {
        let totalMentionLen = 0;
        const mentionsFinal = Array.isArray(mentions) && type == Enum.ThreadType.Group
            ? mentions
                .filter((m) => m.pos >= 0 && m.uid && m.len > 0)
                .map((m) => {
                totalMentionLen += m.len;
                return {
                    pos: m.pos,
                    uid: m.uid,
                    len: m.len,
                    type: m.uid == "-1" ? 1 : 0,
                };
            })
            : [];
        if (totalMentionLen > msg.length) {
            throw new ZaloApiError.ZaloApiError("Invalid mentions: total mention characters exceed message length");
        }
        return {
            mentionsFinal,
            msgFinal: msg,
        };
    }
    function handleStyles(params, styles) {
        if (styles)
            Object.assign(params, {
                textProperties: JSON.stringify({
                    styles: styles.map((e) => {
                        var _a;
                        const styleFinal = Object.assign(Object.assign({}, e), { indentSize: undefined, st: e.st == exports.TextStyle.Indent
                                ? exports.TextStyle.Indent.replace("$", `${(_a = e.indentSize) !== null && _a !== void 0 ? _a : 1}0`)
                                : e.st });
                        utils.removeUndefinedKeys(styleFinal);
                        return styleFinal;
                    }),
                    ver: 0,
                }),
            });
    }
    function handleUrgency(params, urgency) {
        if (urgency == exports.Urgency.Important || urgency == exports.Urgency.Urgent) {
            Object.assign(params, { metaData: { urgency } });
        }
    }
    async function handleMessage({ msg, styles, urgency, mentions, quote, ttl }, threadId, type) {
        if (!msg || msg.length == 0)
            throw new ZaloApiError.ZaloApiError("Missing message content");
        const isGroupMessage = type == Enum.ThreadType.Group;
        const { mentionsFinal, msgFinal } = handleMentions(type, msg, mentions);
        msg = msgFinal;
        if (quote) {
            if (typeof quote.content != "string" && quote.msgType == "webchat") {
                throw new ZaloApiError.ZaloApiError("This kind of `webchat` quote type is not available");
            }
            if (quote.msgType == "group.poll") {
                throw new ZaloApiError.ZaloApiError("The `group.poll` quote type is not available");
            }
        }
        const isMentionsValid = mentionsFinal.length > 0 && isGroupMessage;
        const params = quote
            ? {
                toid: isGroupMessage ? undefined : threadId,
                grid: isGroupMessage ? threadId : undefined,
                message: msg,
                clientId: Date.now(),
                mentionInfo: isMentionsValid ? JSON.stringify(mentionsFinal) : undefined,
                qmsgOwner: quote.uidFrom,
                qmsgId: quote.msgId,
                qmsgCliId: quote.cliMsgId,
                qmsgType: utils.getClientMessageType(quote.msgType),
                qmsgTs: quote.ts,
                qmsg: typeof quote.content == "string" ? quote.content : prepareQMSG(quote),
                imei: isGroupMessage ? undefined : ctx.imei,
                visibility: isGroupMessage ? 0 : undefined,
                qmsgAttach: isGroupMessage ? JSON.stringify(prepareQMSGAttach(quote)) : undefined,
                qmsgTTL: quote.ttl,
                ttl: ttl !== null && ttl !== void 0 ? ttl : 0,
            }
            : {
                message: msg,
                clientId: Date.now(),
                mentionInfo: isMentionsValid ? JSON.stringify(mentionsFinal) : undefined,
                imei: isGroupMessage ? undefined : ctx.imei,
                ttl: ttl !== null && ttl !== void 0 ? ttl : 0,
                visibility: isGroupMessage ? 0 : undefined,
                toid: isGroupMessage ? undefined : threadId,
                grid: isGroupMessage ? threadId : undefined,
            };
        handleStyles(params, styles);
        handleUrgency(params, urgency);
        utils.removeUndefinedKeys(params);
        const encryptedParams = utils$1.encodeAES(JSON.stringify(params));
        if (!encryptedParams)
            throw new ZaloApiError.ZaloApiError("Failed to encrypt message");
        const finalServiceUrl = new URL(serviceURLs.message[type]);
        if (quote) {
            finalServiceUrl.pathname = finalServiceUrl.pathname + "/quote";
        }
        else {
            finalServiceUrl.pathname =
                finalServiceUrl.pathname +
                    "/" +
                    (isGroupMessage ? (params.mentionInfo ? "mention" : "sendmsg") : "sms");
        }
        return {
            url: finalServiceUrl.toString(),
            body: new URLSearchParams({ params: encryptedParams }),
        };
    }
    async function handleAttachment({ msg, attachments, mentions, quote, ttl, urgency }, threadId, type) {
        if (!attachments || attachments.length == 0)
            throw new ZaloApiError.ZaloApiError("Missing attachments");
        const firstSource = attachments[0];
        const isFilePath = typeof firstSource == "string";
        const firstExtFile = utils.getFileExtension(isFilePath ? firstSource : firstSource.filename);
        const isSingleFile = attachments.length == 1;
        const isGroupMessage = type == Enum.ThreadType.Group;
        const canBeDesc = isSingleFile && ["jpg", "jpeg", "png", "webp"].includes(firstExtFile);
        const gifFiles = attachments.filter((e) => utils.getFileExtension(typeof e == "string" ? e : e.filename) == "gif");
        attachments = attachments.filter((e) => utils.getFileExtension(typeof e == "string" ? e : e.filename) != "gif");
        const uploadAttachment = attachments.length == 0 ? [] : await api.uploadAttachment(attachments, threadId, type);
        const attachmentsData = [];
        let indexInGroupLayout = uploadAttachment.length - 1;
        const groupLayoutId = getGroupLayoutId();
        const { mentionsFinal, msgFinal } = handleMentions(type, msg, mentions);
        msg = msgFinal;
        const isMentionsValid = mentionsFinal.length > 0 && isGroupMessage && attachments.length == 1;
        const isMultiFile = attachments.length > 1;
        let clientId = Date.now();
        for (const attachment of uploadAttachment) {
            let data;
            switch (attachment.fileType) {
                case "image": {
                    data = {
                        fileType: attachment.fileType,
                        params: {
                            photoId: attachment.photoId,
                            clientId: (clientId++).toString(),
                            desc: msg,
                            width: attachment.width,
                            height: attachment.height,
                            toid: isGroupMessage ? undefined : String(threadId),
                            grid: isGroupMessage ? String(threadId) : undefined,
                            rawUrl: attachment.normalUrl,
                            hdUrl: attachment.hdUrl,
                            thumbUrl: attachment.thumbUrl,
                            oriUrl: isGroupMessage ? attachment.normalUrl : undefined,
                            normalUrl: isGroupMessage ? undefined : attachment.normalUrl,
                            hdSize: String(attachment.totalSize),
                            zsource: -1,
                            ttl: ttl !== null && ttl !== void 0 ? ttl : 0,
                            jcp: '{"convertible":"jxl"}',
                            groupLayoutId: isMultiFile ? groupLayoutId : undefined,
                            isGroupLayout: isMultiFile ? 1 : undefined,
                            idInGroup: isMultiFile ? indexInGroupLayout-- : undefined,
                            totalItemInGroup: isMultiFile ? uploadAttachment.length : undefined,
                            mentionInfo: isMentionsValid && canBeDesc && !quote ? JSON.stringify(mentionsFinal) : undefined,
                        },
                        body: new URLSearchParams(),
                    };
                    break;
                }
                case "video": {
                    data = {
                        fileType: attachment.fileType,
                        params: {
                            fileId: attachment.fileId,
                            checksum: attachment.checksum,
                            checksumSha: "",
                            extention: utils.getFileExtension(attachment.fileName),
                            totalSize: attachment.totalSize,
                            fileName: attachment.fileName,
                            clientId: attachment.clientFileId,
                            fType: 1,
                            fileCount: 0,
                            fdata: "{}",
                            toid: isGroupMessage ? undefined : String(threadId),
                            grid: isGroupMessage ? String(threadId) : undefined,
                            fileUrl: attachment.fileUrl,
                            zsource: -1,
                            ttl: ttl !== null && ttl !== void 0 ? ttl : 0,
                        },
                        body: new URLSearchParams(),
                    };
                    break;
                }
                case "others": {
                    data = {
                        fileType: attachment.fileType,
                        params: {
                            fileId: attachment.fileId,
                            checksum: attachment.checksum,
                            checksumSha: "",
                            extention: utils.getFileExtension(attachment.fileName),
                            totalSize: attachment.totalSize,
                            fileName: attachment.fileName,
                            clientId: attachment.clientFileId,
                            fType: 1,
                            fileCount: 0,
                            fdata: "{}",
                            toid: isGroupMessage ? undefined : String(threadId),
                            grid: isGroupMessage ? String(threadId) : undefined,
                            fileUrl: attachment.fileUrl,
                            zsource: -1,
                            ttl: ttl !== null && ttl !== void 0 ? ttl : 0,
                        },
                        body: new URLSearchParams(),
                    };
                    break;
                }
            }
            handleUrgency(data.params, urgency);
            utils.removeUndefinedKeys(data.params);
            const encryptedParams = utils$1.encodeAES(JSON.stringify(data.params));
            if (!encryptedParams)
                throw new ZaloApiError.ZaloApiError("Failed to encrypt message");
            data.body.append("params", encryptedParams);
            attachmentsData.push(data);
        }
        for (const gif of gifFiles) {
            const isFilePath = typeof gif == "string";
            const gifData = isFilePath ? await utils.getGifMetaData(gif) : Object.assign(Object.assign({}, gif.metadata), { fileName: gif.filename });
            if (isExceedMaxFileSize(gifData.totalSize))
                throw new ZaloApiError.ZaloApiError(`File ${isFilePath ? utils.getFileName(gif) : gif.filename} size exceed maximum size of ${sharefile.max_size_share_file_v3}MB`);
            const _upthumb = await upthumb(gif, serviceURLs.attachment[Enum.ThreadType.User]);
            const formData = new FormData();
            formData.append("chunkContent", isFilePath ? await fs.readFile(gif) : gif.data, {
                filename: isFilePath ? utils.getFileName(gif) : gif.filename,
                contentType: "application/octet-stream",
            });
            const params = {
                clientId: Date.now().toString(),
                fileName: gifData.fileName,
                totalSize: gifData.totalSize,
                width: gifData.width,
                height: gifData.height,
                msg: msg,
                type: 1,
                ttl: ttl !== null && ttl !== void 0 ? ttl : 0,
                visibility: isGroupMessage ? 0 : undefined,
                toid: isGroupMessage ? undefined : threadId,
                grid: isGroupMessage ? threadId : undefined,
                thumb: _upthumb.url,
                checksum: (await utils.getMd5LargeFileObject(gif, gifData.totalSize)).data,
                totalChunk: 1,
                chunkId: 1,
            };
            handleUrgency(params, urgency);
            utils.removeUndefinedKeys(params);
            const encryptedParams = utils$1.encodeAES(JSON.stringify(params));
            if (!encryptedParams)
                throw new ZaloApiError.ZaloApiError("Failed to encrypt message");
            attachmentsData.push({
                query: {
                    params: encryptedParams,
                    type: "1",
                },
                body: formData.getBuffer(),
                headers: formData.getHeaders(),
                fileType: "gif",
            });
        }
        let responses = [];
        for (const data of attachmentsData) {
            responses.push({
                url: utils$1.makeURL(serviceURLs.attachment[type] + attachmentUrlType[data.fileType], Object.assign({
                    nretry: "0",
                }, data.query || {})),
                body: data.body,
                headers: data.fileType == "gif" ? data.headers : {},
            });
        }
        return responses;
    }
    /**
     * Send a message to a thread
     *
     * @param message Message content
     * @param threadId group or user id
     * @param type Message type (User or Group)
     * @param quote Message or GroupMessage instance (optional), used for quoting
     *
     * @throws {ZaloApiError}
     */
    return async function sendMessage(message, threadId, type = Enum.ThreadType.User) {
        if (!message)
            throw new ZaloApiError.ZaloApiError("Missing message content");
        if (!threadId)
            throw new ZaloApiError.ZaloApiError("Missing threadId");
        if (typeof message == "string")
            message = { msg: message };
        let { msg, quote, attachments, mentions, ttl, styles, urgency } = message;
        if (!msg && (!attachments || (attachments && attachments.length == 0)))
            throw new ZaloApiError.ZaloApiError("Missing message content");
        if (attachments && isExceedMaxFile(attachments.length))
            throw new ZaloApiError.ZaloApiError("Exceed maximum file of " + sharefile.max_file);
        const responses = {
            message: null,
            attachment: [],
        };
        if (attachments && attachments.length > 0) {
            const firstExtFile = utils.getFileExtension(typeof attachments[0] == "string" ? attachments[0] : attachments[0].filename);
            const isSingleFile = attachments.length == 1;
            const canBeDesc = isSingleFile && ["jpg", "jpeg", "png", "webp"].includes(firstExtFile);
            if ((!canBeDesc && msg.length > 0) || (msg.length > 0 && quote)) {
                // send message and attachment separately
                await handleMessage(message, threadId, type).then(async (data) => {
                    responses.message = (await send(data))[0];
                });
                msg = "";
                mentions = undefined;
            }
            const handledData = await handleAttachment({ msg, mentions, attachments, quote, ttl, styles, urgency }, threadId, type);
            responses.attachment = await send(handledData);
            msg = "";
        }
        if (msg.length > 0) {
            const handledData = await handleMessage(message, threadId, type);
            responses.message = (await send(handledData))[0];
        }
        return responses;
    };
});

exports.sendMessageFactory = sendMessageFactory;
