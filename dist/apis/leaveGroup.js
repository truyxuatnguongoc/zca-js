import { ZaloApiError } from "../Errors/ZaloApiError.js";
import { apiFactory } from "../utils.js";
export const leaveGroupFactory = apiFactory()((api, ctx, utils) => {
    const serviceURL = utils.makeURL(`${api.zpwServiceMap.group[0]}/api/group/leave`);
    /**
     * Leave group
     *
     * @param groupId - The ID of the group(s) to leave
     * @param silent - Turn on/off silent leave group
     *
     * @throws ZaloApiError
     */
    return async function leaveGroup(groupId, silent = false) {
        const requestParams = {
            grids: Array.isArray(groupId) ? groupId : [groupId],
            imei: ctx.imei,
            silent: silent ? 1 : 0,
            language: ctx.language,
        };
        const encryptedParams = utils.encodeAES(JSON.stringify(requestParams));
        if (!encryptedParams)
            throw new ZaloApiError("Failed to encrypt params");
        const response = await utils.request(serviceURL, {
            method: "POST",
            body: new URLSearchParams({
                params: encryptedParams,
            }),
        });
        return utils.resolve(response);
    };
});
