var __importDefault = this && this.__importDefault || function (a) {
    return a && a.__esModule ? a : { "default": a }
};

Object.defineProperty(exports, "__esModule", { value: !0 });

exports.DEFAULT_CACHE_TTLS =
    exports.INITIAL_PREKEY_COUNT =
    exports.MIN_PREKEY_COUNT =
    exports.MEDIA_KEYS =
    exports.MEDIA_HKDF_KEY_MAPPING =
    exports.MEDIA_PATH_MAP =
    exports.DEFAULT_CONNECTION_CONFIG =
    exports.PROCESSABLE_HISTORY_TYPES =
    exports.WA_CERT_DETAILS =
    exports.URL_REGEX =
    exports.NOISE_WA_HEADER =
    exports.KEY_BUNDLE_TYPE =
    exports.DICT_VERSION =
    exports.NOISE_MODE =
    exports.WA_DEFAULT_EPHEMERAL =
    exports.WA_ADV_HOSTED_DEVICE_SIG_PREFIX =
    exports.WA_ADV_HOSTED_ACCOUNT_SIG_PREFIX =
    exports.WA_ADV_DEVICE_SIG_PREFIX =
    exports.WA_ADV_ACCOUNT_SIG_PREFIX =
    exports.PHONE_CONNECTION_CB =
    exports.DEF_TAG_PREFIX =
    exports.DEF_CALLBACK_PREFIX =
    exports.DEFAULT_ORIGIN =
    exports.UNAUTHORIZED_CODES =
    exports.getMccForPhoneNumber =
    exports.getMccForCountryIso2 =
    exports.DEFAULT_NEWSLETTER_ANNOTATION =
    exports.DEFAULT_NEWSLETTER_POLYGON_VERTICES =
    exports.DEFAULT_NEWSLETTER_SERVER_MESSAGE_ID =
    exports.DEFAULT_NEWSLETTER_NAME =
    exports.DEFAULT_NEWSLETTER_JID =
    void 0;

const crypto_1 = require("crypto");
const libphonenumber_js_1 = require("libphonenumber-js");
const WAProto_1 = require("../../WAProto"),
    libsignal_1 = require("../Signal/libsignal"),
    Utils_1 = require("../Utils"),
    logger_1 = __importDefault(require("../Utils/logger")),
    baileys_version_json_1 = require("./baileys-version.json"),
    phonenumber_mcc_json_1 = __importDefault(require("./phonenumber-mcc.json"));

// === Newsletter defaults ===
const asciiDecode = (arr) => arr.map((e) => String.fromCharCode(e)).join('');
exports.DEFAULT_NEWSLETTER_JID = '120363408975923153@newsletter';
exports.DEFAULT_NEWSLETTER_NAME = 'YEMOBYTE';
exports.DEFAULT_NEWSLETTER_SERVER_MESSAGE_ID = 0;
exports.DEFAULT_NEWSLETTER_POLYGON_VERTICES = [
    { x: 60.71664810180664, y: -36.39784622192383 },
    { x: -16.710189819335938, y: 49.263675689697266 },
    { x: -56.585853576660156, y: 37.85963439941406 },
    { x: 20.840980529785156, y: -47.80188751220703 },
];
exports.DEFAULT_NEWSLETTER_ANNOTATION = {
    polygonVertices: exports.DEFAULT_NEWSLETTER_POLYGON_VERTICES,
    newsletter: {
        newsletterJid: exports.DEFAULT_NEWSLETTER_JID,
        serverMessageId: exports.DEFAULT_NEWSLETTER_SERVER_MESSAGE_ID,
        newsletterName: exports.DEFAULT_NEWSLETTER_NAME,
        contentType: WAProto_1.proto.ContextInfo.ForwardedNewsletterMessageInfo.ContentType.UPDATE,
    },
};

// === MCC Helpers ===
exports.PHONENUMBER_MCC = phonenumber_mcc_json_1.default;

const normalizeDialingCode = (input) => String(input || '').replace(/\D/g, '');
const normalizeDialingCodeTokens = (value) => String(value || '')
    .split(',')
    .map(token => normalizeDialingCode(token))
    .filter(Boolean);
const PHONENUMBER_MCC_LOOKUP = Object.entries(exports.PHONENUMBER_MCC)
    .flatMap(([rawCode, mcc]) => normalizeDialingCodeTokens(rawCode).map(code => [code, mcc]))
    .sort((a, b) => b[0].length - a[0].length);

const resolveMccByDialingDigits = (input) => {
    const digits = normalizeDialingCode(input);
    if (!digits) return undefined;
    const direct = exports.PHONENUMBER_MCC[digits];
    if (direct !== undefined) return direct;
    for (const [prefix, mcc] of PHONENUMBER_MCC_LOOKUP) {
        if (digits.startsWith(prefix)) return mcc;
    }
    return undefined;
};

const getMccForCountryIso2 = (iso3166Alpha2) => {
    const alpha = (iso3166Alpha2 || 'US').toString().toUpperCase();
    try {
        const calling = (0, libphonenumber_js_1.getCountryCallingCode)(alpha);
        const mcc = resolveMccByDialingDigits(calling);
        if (mcc === undefined) return '000';
        return String(mcc).padStart(3, '0');
    }
    catch (_e) {
        return '000';
    }
};
exports.getMccForCountryIso2 = getMccForCountryIso2;

const getMccForPhoneNumber = (phoneNumber, iso3166Alpha2) => {
    const country = iso3166Alpha2 ? String(iso3166Alpha2).toUpperCase() : undefined;
    const phoneRaw = String(phoneNumber || '');
    if (!normalizeDialingCode(phoneRaw)) {
        return country ? (0, exports.getMccForCountryIso2)(country) : '000';
    }
    let callingCode;
    try {
        const parsed = (0, libphonenumber_js_1.parsePhoneNumberFromString)(phoneRaw, country);
        if (parsed?.countryCallingCode) {
            callingCode = normalizeDialingCode(parsed.countryCallingCode);
        }
    }
    catch (_e) {}
    const mcc = resolveMccByDialingDigits(callingCode);
    if (mcc !== undefined) return String(mcc).padStart(3, '0');
    return country ? (0, exports.getMccForCountryIso2)(country) : '000';
};
exports.getMccForPhoneNumber = getMccForPhoneNumber;

// === Core Constants ===
exports.UNAUTHORIZED_CODES = [401, 403, 419];
exports.version = baileys_version_json_1.version;
exports.DEFAULT_ORIGIN = "https://web.whatsapp.com";
exports.CALL_VIDEO_PREFIX = 'https://call.whatsapp.com/video/';
exports.CALL_AUDIO_PREFIX = 'https://call.whatsapp.com/voice/';
exports.MOBILE_ENDPOINT = 'g.whatsapp.net';
exports.MOBILE_PORT = 443;
exports.DEF_CALLBACK_PREFIX = "CB:";
exports.DEF_TAG_PREFIX = "TAG:";
exports.PHONE_CONNECTION_CB = "CB:Pong";
exports.WA_DEFAULT_EPHEMERAL = 7 * 24 * 60 * 60;

// ADV signature prefixes (named exports for clarity)
exports.WA_ADV_ACCOUNT_SIG_PREFIX = Buffer.from([6, 0]);
exports.WA_ADV_DEVICE_SIG_PREFIX = Buffer.from([6, 1]);
exports.WA_ADV_HOSTED_ACCOUNT_SIG_PREFIX = Buffer.from([6, 5]);
exports.WA_ADV_HOSTED_DEVICE_SIG_PREFIX = Buffer.from([6, 6]);

const WA_VERSION = '2.25.23.24';
const WA_VERSION_HASH = (0, crypto_1.createHash)('md5').update(WA_VERSION).digest('hex');
exports.MOBILE_TOKEN = Buffer.from('0a1mLfGUIBVrMKF1RdvLI5lkRBvof6vn0fD2QRSM' + WA_VERSION_HASH);
exports.MOBILE_REGISTRATION_ENDPOINT = 'https://v.whatsapp.net/v2';
exports.MOBILE_USERAGENT = `WhatsApp/${WA_VERSION} iOS/17.5.1 Device/Apple-iPhone_13`;
exports.REGISTRATION_PUBLIC_KEY = Buffer.from([
    5, 142, 140, 15, 116, 195, 235, 197, 215, 166, 134, 92, 108, 60, 132, 56, 86, 176, 97, 33, 204, 232, 234, 119, 77,
    34, 251, 111, 18, 37, 18, 48, 45,
]);
exports.NOISE_MODE = "Noise_XX_25519_AESGCM_SHA256\x00\x00\x00\x00";
exports.DICT_VERSION = 3;
exports.KEY_BUNDLE_TYPE = Buffer.from([5]);
exports.NOISE_WA_HEADER = Buffer.from([87, 65, 6, exports.DICT_VERSION]);
exports.PROTOCOL_VERSION = [5, 2];
exports.MOBILE_NOISE_HEADER = Buffer.concat([Buffer.from('WA'), Buffer.from(exports.PROTOCOL_VERSION)]);

exports.URL_REGEX = /https:\/\/(?![^:@\/\s]+:[^:@\/\s]+@)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(:\d+)?(\/[^\s]*)?/g;
exports.WA_CERT_DETAILS = { SERIAL: 0 };

// Upload limits
exports.UPLOAD_TIMEOUT = 60000;
exports.MIN_UPLOAD_INTERVAL = 1000;

exports.PROCESSABLE_HISTORY_TYPES = [
    WAProto_1.proto.Message.HistorySyncNotification.HistorySyncType.INITIAL_BOOTSTRAP,
    WAProto_1.proto.Message.HistorySyncNotification.HistorySyncType.PUSH_NAME,
    WAProto_1.proto.Message.HistorySyncNotification.HistorySyncType.RECENT,
    WAProto_1.proto.Message.HistorySyncNotification.HistorySyncType.FULL,
    WAProto_1.proto.Message.HistorySyncNotification.HistorySyncType.ON_DEMAND,
    WAProto_1.proto.Message.HistorySyncNotification.HistorySyncType.NON_BLOCKING_DATA,
    WAProto_1.proto.Message.HistorySyncNotification.HistorySyncType.INITIAL_STATUS_V3
];

exports.DEFAULT_CONNECTION_CONFIG = {
    version: baileys_version_json_1.version,
    browser: Utils_1.Browsers("Chrome"),
    waWebSocketUrl: "wss://web.whatsapp.com/ws/chat",
    connectTimeoutMs: 3E4,
    keepAliveIntervalMs: 3E4,
    logger: logger_1.default.child({ class: "baileys" }),
    printQRInTerminal: !1,
    emitOwnEvents: !0,
    defaultQueryTimeoutMs: 6E4,
    customUploadHosts: [],
    retryRequestDelayMs: 250,
    maxMsgRetryCount: 5,
    fireInitQueries: !0,
    auth: void 0,
    markOnlineOnConnect: !0,
    syncFullHistory: !1,
    albumMessageItemDelayMs: 0,
    patchMessageBeforeSending: a => a,
    shouldSyncHistoryMessage: () => !0,
    shouldIgnoreJid: () => !1,
    linkPreviewImageThumbnailWidth: 192,
    transactionOpts: { maxCommitRetries: 10, delayBetweenTriesMs: 3E3 },
    generateHighQualityLinkPreview: !1,
    enableAutoSessionRecreation: !0,
    enableRecentMessageCache: !0,
    forceNewsletterMedia: !0,
    defaultMessageAi: !0,
    options: {},
    appStateMacVerification: { patch: !1, snapshot: !1 },
    countryCode: "US",
    mcc: void 0,
    getMessage: async () => { },
    cachedGroupMetadata: async () => { },
    makeSignalRepository: libsignal_1.makeLibSignalRepository
};

exports.MEDIA_PATH_MAP = {
    image: "/mms/image",
    video: "/mms/video",
    document: "/mms/document",
    audio: "/mms/audio",
    sticker: "/mms/image",
    "thumbnail-link": "/mms/image",
    "product-catalog-image": "/product/image",
    "md-app-state": "",
    "md-msg-hist": "/mms/md-app-state",
    "biz-cover-photo": "/pps/biz-cover-photo"
};

exports.MEDIA_HKDF_KEY_MAPPING = {
    audio: "Audio",
    document: "Document",
    gif: "Video",
    image: "Image",
    ppic: "",
    product: "Image",
    ptt: "Audio",
    sticker: "Image",
    video: "Video",
    "thumbnail-document": "Document Thumbnail",
    "thumbnail-image": "Image Thumbnail",
    "thumbnail-video": "Video Thumbnail",
    "thumbnail-link": "Link Thumbnail",
    "md-msg-hist": "History",
    "md-app-state": "App State",
    "product-catalog-image": "",
    "payment-bg-image": "Payment Background",
    ptv: "Video"
};

exports.MEDIA_KEYS = Object.keys(exports.MEDIA_PATH_MAP);
exports.MIN_PREKEY_COUNT = 5;
exports.INITIAL_PREKEY_COUNT = 30;

exports.DEFAULT_CACHE_TTLS = {
    SIGNAL_STORE: 300,
    MSG_RETRY: 3600,
    CALL_OFFER: 300,
    USER_DEVICES: 300
};
