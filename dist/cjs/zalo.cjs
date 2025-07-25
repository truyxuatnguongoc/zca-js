'use strict';

var listen = require('./apis/listen.cjs');
var login = require('./apis/login.cjs');
var context = require('./context.cjs');
var utils = require('./utils.cjs');
var toughCookie = require('tough-cookie');
var acceptFriendRequest = require('./apis/acceptFriendRequest.cjs');
var addGroupDeputy = require('./apis/addGroupDeputy.cjs');
var addHiddenConversPin = require('./apis/addHiddenConversPin.cjs');
var addQuickMessage = require('./apis/addQuickMessage.cjs');
var addReaction = require('./apis/addReaction.cjs');
var addUnreadMark = require('./apis/addUnreadMark.cjs');
var addUserToGroup = require('./apis/addUserToGroup.cjs');
var autoDeleteChat = require('./apis/autoDeleteChat.cjs');
var blockUser = require('./apis/blockUser.cjs');
var blockViewFeed = require('./apis/blockViewFeed.cjs');
var changeAccountAvatar = require('./apis/changeAccountAvatar.cjs');
var changeFriendAlias = require('./apis/changeFriendAlias.cjs');
var changeGroupAvatar = require('./apis/changeGroupAvatar.cjs');
var changeGroupName = require('./apis/changeGroupName.cjs');
var changeGroupOwner = require('./apis/changeGroupOwner.cjs');
var createGroup = require('./apis/createGroup.cjs');
var createNoteGroup = require('./apis/createNoteGroup.cjs');
var createPoll = require('./apis/createPoll.cjs');
var createReminder = require('./apis/createReminder.cjs');
var deleteAvatarList = require('./apis/deleteAvatarList.cjs');
var deleteChat = require('./apis/deleteChat.cjs');
var deleteMessage = require('./apis/deleteMessage.cjs');
var disableGroupLink = require('./apis/disableGroupLink.cjs');
var disperseGroup = require('./apis/disperseGroup.cjs');
var editNoteGroup = require('./apis/editNoteGroup.cjs');
var editReminder = require('./apis/editReminder.cjs');
var enableGroupLink = require('./apis/enableGroupLink.cjs');
var fetchAccountInfo = require('./apis/fetchAccountInfo.cjs');
var findUser = require('./apis/findUser.cjs');
var forwardMessage = require('./apis/forwardMessage.cjs');
var getAliasList = require('./apis/getAliasList.cjs');
var getAllFriends = require('./apis/getAllFriends.cjs');
var getAllGroups = require('./apis/getAllGroups.cjs');
var getArchivedChatList = require('./apis/getArchivedChatList.cjs');
var getAutoDeleteChat = require('./apis/getAutoDeleteChat.cjs');
var getAvatarList = require('./apis/getAvatarList.cjs');
var getBizAccount = require('./apis/getBizAccount.cjs');
var getContext = require('./apis/getContext.cjs');
var getCookie = require('./apis/getCookie.cjs');
var getFriendBoardList = require('./apis/getFriendBoardList.cjs');
var getFriendRequest = require('./apis/getFriendRequest.cjs');
var getRecommendRequest = require('./apis/getRecommendRequest.cjs');
var getGroupInfo = require('./apis/getGroupInfo.cjs');
var getGroupMembersInfo = require('./apis/getGroupMembersInfo.cjs');
var getHiddenConversPin = require('./apis/getHiddenConversPin.cjs');
var getLabels = require('./apis/getLabels.cjs');
var getListPoll = require('./apis/getListPoll.cjs');
var getListReminder = require('./apis/getListReminder.cjs');
var getMute = require('./apis/getMute.cjs');
var getOwnId = require('./apis/getOwnId.cjs');
var getPinConversations = require('./apis/getPinConversations.cjs');
var getPollDetail = require('./apis/getPollDetail.cjs');
var getQR = require('./apis/getQR.cjs');
var getQuickMessage = require('./apis/getQuickMessage.cjs');
var getRecvFriendRequest = require('./apis/getRecvFriendRequest.cjs');
var getReminder = require('./apis/getReminder.cjs');
var getReminderEvent = require('./apis/getReminderEvent.cjs');
var getStickers = require('./apis/getStickers.cjs');
var getStickersDetail = require('./apis/getStickersDetail.cjs');
var getUnreadMark = require('./apis/getUnreadMark.cjs');
var getUserInfo = require('./apis/getUserInfo.cjs');
var inviteUserToGroups = require('./apis/inviteUserToGroups.cjs');
var joinGroup = require('./apis/joinGroup.cjs');
var keepAlive = require('./apis/keepAlive.cjs');
var lastOnline = require('./apis/lastOnline.cjs');
var leaveGroup = require('./apis/leaveGroup.cjs');
var linkGroupInfo = require('./apis/linkGroupInfo.cjs');
var lockPoll = require('./apis/lockPoll.cjs');
var loginQR = require('./apis/loginQR.cjs');
var parseLink = require('./apis/parseLink.cjs');
var pinConversations = require('./apis/pinConversations.cjs');
var removeFriend = require('./apis/removeFriend.cjs');
var removeFriendAlias = require('./apis/removeFriendAlias.cjs');
var removeGroupDeputy = require('./apis/removeGroupDeputy.cjs');
var removeHiddenConversPin = require('./apis/removeHiddenConversPin.cjs');
var removeQuickMessage = require('./apis/removeQuickMessage.cjs');
var removeReminder = require('./apis/removeReminder.cjs');
var removeUnreadMark = require('./apis/removeUnreadMark.cjs');
var removeUserFromGroup = require('./apis/removeUserFromGroup.cjs');
var resetHiddenConversPin = require('./apis/resetHiddenConversPin.cjs');
var reuseAvatar = require('./apis/reuseAvatar.cjs');
var sendCard = require('./apis/sendCard.cjs');
var sendDeliveredEvent = require('./apis/sendDeliveredEvent.cjs');
var sendFriendRequest = require('./apis/sendFriendRequest.cjs');
var sendLink = require('./apis/sendLink.cjs');
var sendMessage = require('./apis/sendMessage.cjs');
var sendReport = require('./apis/sendReport.cjs');
var sendSeenEvent = require('./apis/sendSeenEvent.cjs');
var sendSticker = require('./apis/sendSticker.cjs');
var sendTypingEvent = require('./apis/sendTypingEvent.cjs');
var sendVideo = require('./apis/sendVideo.cjs');
var sendVoice = require('./apis/sendVoice.cjs');
var setMute = require('./apis/setMute.cjs');
var unblockUser = require('./apis/unblockUser.cjs');
var undo = require('./apis/undo.cjs');
var undoFriendRequest = require('./apis/undoFriendRequest.cjs');
var updateAutoDeleteChat = require('./apis/updateAutoDeleteChat.cjs');
var updateGroupSettings = require('./apis/updateGroupSettings.cjs');
var updateHiddenConversPin = require('./apis/updateHiddenConversPin.cjs');
var updateLabels = require('./apis/updateLabels.cjs');
var updateLang = require('./apis/updateLang.cjs');
var updateProfile = require('./apis/updateProfile.cjs');
var updateQuickMessage = require('./apis/updateQuickMessage.cjs');
var updateSettings = require('./apis/updateSettings.cjs');
var uploadAttachment = require('./apis/uploadAttachment.cjs');
var ZaloApiError = require('./Errors/ZaloApiError.cjs');
var update = require('./update.cjs');
var custom = require('./apis/custom.cjs');

class Zalo {
    constructor(options = {}) {
        this.options = options;
        this.enableEncryptParam = true;
    }
    parseCookies(cookie) {
        var _a;
        const cookieArr = Array.isArray(cookie) ? cookie : cookie.cookies;
        cookieArr.forEach((e, i) => {
            if (typeof e.domain == "string" && e.domain.startsWith("."))
                cookieArr[i].domain = e.domain.slice(1);
        });
        const jar = new toughCookie.CookieJar();
        for (const each of cookieArr) {
            try {
                jar.setCookieSync((_a = toughCookie.Cookie.fromJSON(Object.assign(Object.assign({}, each), { key: each.key || each.name }))) !== null && _a !== void 0 ? _a : "", "https://chat.zalo.me");
            }
            catch (_b) { }
        }
        return jar;
    }
    validateParams(credentials) {
        if (!credentials.imei || !credentials.cookie || !credentials.userAgent) {
            throw new Error("Missing required params");
        }
    }
    async login(credentials) {
        const ctx = context.createContext(this.options.apiType, this.options.apiVersion);
        Object.assign(ctx.options, this.options);
        return this.loginCookie(ctx, credentials);
    }
    async loginCookie(ctx, credentials) {
        await update.checkUpdate(ctx);
        this.validateParams(credentials);
        ctx.imei = credentials.imei;
        ctx.cookie = this.parseCookies(credentials.cookie);
        ctx.userAgent = credentials.userAgent;
        ctx.language = credentials.language || "vi";
        const loginData = await login.login(ctx, this.enableEncryptParam);
        const serverInfo = await login.getServerInfo(ctx, this.enableEncryptParam);
        if (!loginData || !serverInfo)
            throw new Error("Đăng nhập thất bại");
        ctx.secretKey = loginData.data.zpw_enk;
        ctx.uid = loginData.data.uid;
        // Zalo currently responds with setttings instead of settings
        // they might fix this in the future, so we should have a fallback just in case
        ctx.settings = serverInfo.setttings || serverInfo.settings;
        ctx.extraVer = serverInfo.extra_ver;
        if (!context.isContextSession(ctx))
            throw new Error("Khởi tạo ngữ cảnh thát bại.");
        utils.logger(ctx).info("Logged in as", loginData.data.uid);
        return new API(ctx, loginData.data.zpw_service_map_v3, loginData.data.zpw_ws);
    }
    async loginQR(options, callback) {
        if (!options)
            options = {};
        if (!options.userAgent)
            options.userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0";
        if (!options.language)
            options.language = "vi";
        const ctx = context.createContext(this.options.apiType, this.options.apiVersion);
        Object.assign(ctx.options, this.options);
        const loginQRResult = await loginQR.loginQR(ctx, options, callback);
        if (!loginQRResult)
            throw new ZaloApiError.ZaloApiError("Unable to login with QRCode");
        const imei = utils.generateZaloUUID(options.userAgent);
        if (callback) {
            // Thanks to @YanCastle for this great suggestion!
            callback({
                type: loginQR.LoginQRCallbackEventType.GotLoginInfo,
                data: {
                    cookie: loginQRResult.cookies,
                    imei,
                    userAgent: options.userAgent,
                },
                actions: null,
            });
        }
        return this.loginCookie(ctx, {
            cookie: loginQRResult.cookies,
            imei,
            userAgent: options.userAgent,
            language: options.language,
        });
    }
}
class API {
    constructor(ctx, zpwServiceMap, wsUrls) {
        this.zpwServiceMap = zpwServiceMap;
        this.listener = new listen.Listener(ctx, wsUrls);
        this.acceptFriendRequest = acceptFriendRequest.acceptFriendRequestFactory(ctx, this);
        this.addGroupDeputy = addGroupDeputy.addGroupDeputyFactory(ctx, this);
        this.addHiddenConversPin = addHiddenConversPin.addHiddenConversPinFactory(ctx, this);
        this.addQuickMessage = addQuickMessage.addQuickMessageFactory(ctx, this);
        this.addReaction = addReaction.addReactionFactory(ctx, this);
        this.addUnreadMark = addUnreadMark.addUnreadMarkFactory(ctx, this);
        this.addUserToGroup = addUserToGroup.addUserToGroupFactory(ctx, this);
        this.autoDeleteChat = autoDeleteChat.autoDeleteChatFactory(ctx, this);
        this.blockUser = blockUser.blockUserFactory(ctx, this);
        this.blockViewFeed = blockViewFeed.blockViewFeedFactory(ctx, this);
        this.changeAccountAvatar = changeAccountAvatar.changeAccountAvatarFactory(ctx, this);
        this.changeFriendAlias = changeFriendAlias.changeFriendAliasFactory(ctx, this);
        this.changeGroupAvatar = changeGroupAvatar.changeGroupAvatarFactory(ctx, this);
        this.changeGroupName = changeGroupName.changeGroupNameFactory(ctx, this);
        this.changeGroupOwner = changeGroupOwner.changeGroupOwnerFactory(ctx, this);
        this.createGroup = createGroup.createGroupFactory(ctx, this);
        this.createNoteGroup = createNoteGroup.createNoteGroupFactory(ctx, this);
        this.createPoll = createPoll.createPollFactory(ctx, this);
        this.createReminder = createReminder.createReminderFactory(ctx, this);
        this.deleteAvatarList = deleteAvatarList.deleteAvatarListFactory(ctx, this);
        this.deleteChat = deleteChat.deleteChatFactory(ctx, this);
        this.deleteMessage = deleteMessage.deleteMessageFactory(ctx, this);
        this.disableGroupLink = disableGroupLink.disableGroupLinkFactory(ctx, this);
        this.disperseGroup = disperseGroup.disperseGroupFactory(ctx, this);
        this.editNoteGroup = editNoteGroup.editNoteGroupFactory(ctx, this);
        this.editReminder = editReminder.editReminderFactory(ctx, this);
        this.enableGroupLink = enableGroupLink.enableGroupLinkFactory(ctx, this);
        this.fetchAccountInfo = fetchAccountInfo.fetchAccountInfoFactory(ctx, this);
        this.findUser = findUser.findUserFactory(ctx, this);
        this.forwardMessage = forwardMessage.forwardMessageFactory(ctx, this);
        this.getAliasList = getAliasList.getAliasListFactory(ctx, this);
        this.getAllFriends = getAllFriends.getAllFriendsFactory(ctx, this);
        this.getAllGroups = getAllGroups.getAllGroupsFactory(ctx, this);
        this.getArchivedChatList = getArchivedChatList.getArchivedChatListFactory(ctx, this);
        this.getAutoDeleteChat = getAutoDeleteChat.getAutoDeleteChatFactory(ctx, this);
        this.getAvatarList = getAvatarList.getAvatarListFactory(ctx, this);
        this.getBizAccount = getBizAccount.getBizAccountFactory(ctx, this);
        this.getContext = getContext.getContextFactory(ctx, this);
        this.getCookie = getCookie.getCookieFactory(ctx, this);
        this.getFriendBoardList = getFriendBoardList.getFriendBoardListFactory(ctx, this);
        this.getFriendRequest = getFriendRequest.getFriendRequestFactory(ctx, this);
        this.getRecommendRequest = getRecommendRequest.getRecommendRequestFactory(ctx, this);
        this.getGroupInfo = getGroupInfo.getGroupInfoFactory(ctx, this);
        this.getGroupMembersInfo = getGroupMembersInfo.getGroupMembersInfoFactory(ctx, this);
        this.getHiddenConversPin = getHiddenConversPin.getHiddenConversPinFactory(ctx, this);
        this.getLabels = getLabels.getLabelsFactory(ctx, this);
        this.getListPoll = getListPoll.getListPollFactory(ctx, this);
        this.getListReminder = getListReminder.getListReminderFactory(ctx, this);
        this.getMute = getMute.getMuteFactory(ctx, this);
        this.getOwnId = getOwnId.getOwnIdFactory(ctx, this);
        this.getPinConversations = getPinConversations.getPinConversationsFactory(ctx, this);
        this.getPollDetail = getPollDetail.getPollDetailFactory(ctx, this);
        this.getQR = getQR.getQRFactory(ctx, this);
        this.getQuickMessage = getQuickMessage.getQuickMessageFactory(ctx, this);
        this.getRecvFriendRequest = getRecvFriendRequest.getRecvFriendRequestFactory(ctx, this);
        this.getReminder = getReminder.getReminderFactory(ctx, this);
        this.getReminderEvent = getReminderEvent.getReminderEventFactory(ctx, this);
        this.getStickers = getStickers.getStickersFactory(ctx, this);
        this.getStickersDetail = getStickersDetail.getStickersDetailFactory(ctx, this);
        this.getUnreadMark = getUnreadMark.getUnreadMarkFactory(ctx, this);
        this.getUserInfo = getUserInfo.getUserInfoFactory(ctx, this);
        this.inviteUserToGroups = inviteUserToGroups.inviteUserToGroupsFactory(ctx, this);
        this.joinGroup = joinGroup.joinGroupFactory(ctx, this);
        this.keepAlive = keepAlive.keepAliveFactory(ctx, this);
        this.lastOnline = lastOnline.lastOnlineFactory(ctx, this);
        this.leaveGroup = leaveGroup.leaveGroupFactory(ctx, this);
        this.linkGroupInfo = linkGroupInfo.linkGroupInfoFactory(ctx, this);
        this.lockPoll = lockPoll.lockPollFactory(ctx, this);
        this.parseLink = parseLink.parseLinkFactory(ctx, this);
        this.pinConversations = pinConversations.pinConversationsFactory(ctx, this);
        this.removeFriend = removeFriend.removeFriendFactory(ctx, this);
        this.removeFriendAlias = removeFriendAlias.removeFriendAliasFactory(ctx, this);
        this.removeGroupDeputy = removeGroupDeputy.removeGroupDeputyFactory(ctx, this);
        this.removeHiddenConversPin = removeHiddenConversPin.removeHiddenConversPinFactory(ctx, this);
        this.removeQuickMessage = removeQuickMessage.removeQuickMessageFactory(ctx, this);
        this.removeReminder = removeReminder.removeReminderFactory(ctx, this);
        this.removeUnreadMark = removeUnreadMark.removeUnreadMarkFactory(ctx, this);
        this.removeUserFromGroup = removeUserFromGroup.removeUserFromGroupFactory(ctx, this);
        this.resetHiddenConversPin = resetHiddenConversPin.resetHiddenConversPinFactory(ctx, this);
        this.reuseAvatar = reuseAvatar.reuseAvatarFactory(ctx, this);
        this.sendCard = sendCard.sendCardFactory(ctx, this);
        this.sendDeliveredEvent = sendDeliveredEvent.sendDeliveredEventFactory(ctx, this);
        this.sendFriendRequest = sendFriendRequest.sendFriendRequestFactory(ctx, this);
        this.sendLink = sendLink.sendLinkFactory(ctx, this);
        this.sendMessage = sendMessage.sendMessageFactory(ctx, this);
        this.sendReport = sendReport.sendReportFactory(ctx, this);
        this.sendSeenEvent = sendSeenEvent.sendSeenEventFactory(ctx, this);
        this.sendSticker = sendSticker.sendStickerFactory(ctx, this);
        this.sendTypingEvent = sendTypingEvent.sendTypingEventFactory(ctx, this);
        this.sendVideo = sendVideo.sendVideoFactory(ctx, this);
        this.sendVoice = sendVoice.sendVoiceFactory(ctx, this);
        this.setMute = setMute.setMuteFactory(ctx, this);
        this.unblockUser = unblockUser.unblockUserFactory(ctx, this);
        this.undo = undo.undoFactory(ctx, this);
        this.undoFriendRequest = undoFriendRequest.undoFriendRequestFactory(ctx, this);
        this.updateAutoDeleteChat = updateAutoDeleteChat.updateAutoDeleteChatFactory(ctx, this);
        this.updateGroupSettings = updateGroupSettings.updateGroupSettingsFactory(ctx, this);
        this.updateHiddenConversPin = updateHiddenConversPin.updateHiddenConversPinFactory(ctx, this);
        this.updateLabels = updateLabels.updateLabelsFactory(ctx, this);
        this.updateLang = updateLang.updateLangFactory(ctx, this);
        this.updateProfile = updateProfile.updateProfileFactory(ctx, this);
        this.updateQuickMessage = updateQuickMessage.updateQuickMessageFactory(ctx, this);
        this.updateSettings = updateSettings.updateSettingsFactory(ctx, this);
        this.uploadAttachment = uploadAttachment.uploadAttachmentFactory(ctx, this);
        this.custom = custom.customFactory(ctx, this);
    }
}

exports.API = API;
exports.Zalo = Zalo;
