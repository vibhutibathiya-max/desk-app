/*
 * Tragofone - A Desk SIP Phone
 * Copyright (C) 2005-2022, Ecosmob Technologies Pvt. Ltd. <ecosmob.com>
 *
 * The Initial Developer of the Original Code is
 * Aarati Joshi <aarati.joshi@ecosmob.com>
 * Portions created by the Initial Developer are Copyright (C) Ecosmob Technologies Pvt. Ltd. All Rights Reserved.
 *
 * Contributor(s):
 *
 * Aarati Joshi <aarati.joshi@ecosmob.com>
 *
 * globalDefines.js - This script contains global configurations.
 *
 */

const packageJson = require(__dirname + "/package.json");
const version = packageJson.version;
const deskAppName = packageJson.appName;

/** TRAG-5915 - START */
let baseUrl,roundRobinDomain,baseApiVersion,turnUsername;
const turnpassword="4Pa49oH@iAY~9TzIj=3rdf3f23rd23r23eefcwesfweds";
const environment = localStorage.getItem("_environment");
const isDev = (environment === "dev");
const isCwos = (environment === "cwos");
const isSandBoxEnable = packageJson.sandBoxEnable;

const storedCwosData = JSON.parse(localStorage.getItem("cwosData") || "{}"); // TRAG-11902 - CWOS mode 

// TRAG-11902 - CWOS mode 
if(isCwos && Object.keys(storedCwosData).length) {
    console.log("globalDefines.js : cwos mode");
    /** CWOS mode: take everything from cwosData */
    baseUrl = storedCwosData.fixedDomain || "dialer1.mascom.bw";
    roundRobinDomain = storedCwosData.roundRobinDomain || "dialer.mascom.bw";
    baseApiVersion = storedCwosData.apiVersion || "v1.57.4";
    turnUsername = CryptoJS.MD5(roundRobinDomain+":"+turnpassword).toString();
} else if (!isDev && isSandBoxEnable) {
    console.log("globalDefines.js : sandbox + prod mode");
    /** Update this details when sandbox is enable for client with Production server details */
    baseUrl = "dialer1.mascom.bw";
    roundRobinDomain = "dialer.mascom.bw";
    baseApiVersion = "v1.57.4";
    turnUsername = CryptoJS.MD5(roundRobinDomain+":"+turnpassword).toString();
} else if (isDev && isSandBoxEnable) {
    console.log("globalDefines.js : sandbox mode");
    /** Update this details when sandbox is enable for client with Production server details */
    baseUrl = "dialer1.mascom.bw";
    roundRobinDomain = "dialer.mascom.bw";
    baseApiVersion = "v1.57.4";
    turnUsername = CryptoJS.MD5(roundRobinDomain+":"+turnpassword).toString();
} else {
    console.log("globalDefines.js : only production mode");
    /** Update this details when sandbox is disable for client with Production server details */
    baseUrl = "dialer1.mascom.bw";
    roundRobinDomain = "dialer.mascom.bw";
    baseApiVersion = "v1.57.4";
    turnUsername = CryptoJS.MD5(roundRobinDomain+":"+turnpassword).toString();
}
/** TRAG-5915 - END */

/** Domains, WSS and port */
const domains = {
    baseApiPort: ":8091",
    baseApiVersion : baseApiVersion,
    baseWebport: ":9081",
    wssPort: ":7442",
    xmppWssPort: ":5443/ws",
    xmppConference: "conference.",
    xmppPubsubService: "pubsub.",
    xmppUploadService: "upload.",
    baseApiUrl: "https://"+baseUrl,
    wssServer: "wss://"+baseUrl,
    xmppDomain: roundRobinDomain,
    stunServer:{
        url: baseUrl,
        port:":3478",
    },
	turnServer: {
        url: baseUrl,
        port: ":11001",
        username: turnUsername,
        password: turnpassword
    }
};


window._GLOBALS = {

    /** Debug Mode: developemnt, production */
    _env: process.env.NODE_ENV,

    /** App Name */
    _appName: deskAppName,

    /** App Version */
    _version: version,

    /** Api Version */
    _baseApiVersion: domains.baseApiVersion,

    /** Directory name */
    _baseUrl: __dirname,

    /** Base API URL */
    _baseApiUrl: domains.baseApiUrl + domains.baseApiPort +'/'+ domains.baseApiVersion,

    /** Base API URL without API version */
    _baseApiUrlWithoutApiVersion: domains.baseApiUrl + domains.baseApiPort,

    /** Web URl that take user to browser for login */
    _baseWebUrl: domains.baseApiUrl + domains.baseWebport,

    _environment: { 
        production: "dialer.mascom.bw" ,  
        sandbox: "dialer.mascom.bw",
        cwos : storedCwosData.roundRobinDomain
    },

    // if its a reseller build then add resellerName here eg micommunications , netspapiens etc
    // _resellerName: 'micommunications',
    // if its not a reseller build then keep it empty like this: _resellerName: '',
    _resellerName: '',

    _apiUrls: () => ({
        "156.38.5.103": `https://dialer1.mascom.bw:8091/${domains.baseApiVersion}/api`,
        "156.38.5.123": `https://dialer2.mascom.bw:8091/${domains.baseApiVersion}/api`,
    }),

    /** Zoom Configuration */
    _zoomConfig: {
        _apiUrl: "" //As of now Zoom will enable for speechlogix and xlogix only, for other clients we will make it blank
    },

    /** WSS server URL */
    _wssServer: domains.wssServer + domains.wssPort,

    /**    SIP Configuration */
    _sipConfig: {
        _logEnable: true,
        _iceServer:  'stun:'+ domains.stunServer.url + domains.stunServer.port,
        _turnServer: 'turn:' + domains.turnServer.url + domains.turnServer.port,
        _turnServerUsername: domains.turnServer.username,
        _turnServerPassworkd: domains.turnServer.password,
        _earlyMedia: true,              //TRAG-4802
        _callOnProgressStatus: {       //TRAG-4802
            _localCode: 180,
            _serverCode: 183
        },
        _outgoingConnectingRingtone:true  /** FOR D2-telecom it should be false and for all other clients it should be true */
    },

    /** About-us & Privacy-policy Page Urls */
    _aboutUsUrl: "https://mascom.bw/about-mascom-wirelesss/",
    _privacyPolicyUrl: "https://mascom.bw/privacy-statement/",

    /** XMPP declaration */
    _xmppWssServer: domains.wssServer + domains.xmppWssPort,
    _xmppDomain: domains.xmppDomain,
    _xmppConference: domains.xmppConference + domains.xmppDomain,
    _xmppPubsubService: domains.xmppPubsubService + domains.xmppDomain,
    _xmppUploadService: domains.xmppUploadService + domains.xmppDomain,

    /**    TIMEZONE Configuration */
    _timeConfig: {
        _isDate12Fomat: false, // false = 24 hours and true = 12 hours TRAG-4908,
    },

    /**  Default Language Code Set */
    _defaultLangageCode: "en",
    _languages: {
        "it": {
            "_code": "it", "_label": "Italiano", "_dateFormatLanguageWise": "de-DE", // dd.mm.yyyy(28.06.2023)
            "_flag": "it",
        }, "en-us": {
            "_code": "en-us", "_label": "English(U.S)", "_dateFormatLanguageWise": "en-US",// mm/dd/yy (06/28/2023) this format is for english US
            "_flag": "us",
        }, "du": {
            "_code": "du", "_label": "Nederlands", "_dateFormatLanguageWise": "fr-FR", // dd/mm/yyyy(28/06/2023)
            "_flag": "nl",
        }, "fr": {
            "_code": "fr", "_label": "Français", "_dateFormatLanguageWise": "fr-FR", // dd/mm/yyyy(28/06/2023)
            "_flag": "fr",
        }, "zh-cn": {
            "_code": "zh-cn", "_label": "中文", "_dateFormatLanguageWise": "fr-FR", // dd/mm/yyyy(28/06/2023)
            "_flag": "cn",
        }, "zh-tw": {
            "_code": "zh-tw", "_label": "漢語", "_dateFormatLanguageWise": "fr-FR", // dd/mm/yyyy(28/06/2023)
            "_flag": "cn",
        }, "de": {
            "_code": "de", "_label": "Deutsch", "_dateFormatLanguageWise": "de-DE", // dd.mm.yyyy(28.06.2023)
            "_flag": "de",
        }, "ar": {
            "_code": "ar", "_label": "عربي", "_dateFormatLanguageWise": "fr-FR", // dd/mm/yyyy(28/06/2023)
            "_flag": "sa",
        }, "pt-br": {
            "_code": "pt-br", "_label": "Português", "_dateFormatLanguageWise": "en-CA", // yyyy-MM-dd(2024-01-31),
            "_flag": "pt",
        }, "en": {
            "_code": "en", "_label": "English(U.K)", "_dateFormatLanguageWise": "fr-FR", // dd/mm/yyyy(28/06/2023) this format is for english UK
            "_flag": "gb",
        }, "tr": {
            "_code": "tr", "_label": "Türkçe", "_dateFormatLanguageWise": "tr-TR", // dd.MM.yyyy(28.06.2023)
            "_flag": "tr",
        }, "ru": {
            "_code": "ru", "_label": "Русский", "_dateFormatLanguageWise": "ru-RU", // dd.MM.yyyy(28.06.2023)
            "_flag": "ru",
        }, "he": {
            "_code": "he", "_label": "עברית", "_dateFormatLanguageWise": "he-IL", // dd.MM.yyyy(28.06.2023)
            "_flag": "il",
        }, "es": {
            "_code": "es", "_label": "Español", "_dateFormatLanguageWise": "es-ES", // dd/mm/yyyy(28/06/2023)
            "_flag": "es",
        }
    },

    /**  AutThe auto startup feature can be controlled by a specific setting. If the setting is true, auto startup will be enabled by default without asking the user for permission. If the setting is false, the user will be prompted to enable the auto startup feature.
        - For new clients, this setting should be false by default to ask for user permission.
        - For existing clients, the current setting (true or false) should be kept as is.
     This setting primarily affects the initial build for new clients */
    _showAutoStartupOption: false,

    /** Google Credentials */
    _googleContact: {
        ClientSecret: "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",
        ClientId: "233691820498-62ab6oj623okf19e7ajb6p4qmses8i1t.apps.googleusercontent.com",
        RedirectUris: "http://localhost:3000/oauth2callback",
    },

    /** Sandbox enable/disable Configuration */
    _isSandBoxEnable: isSandBoxEnable,

    /** NTP Configuration */
    _ntpConfig : {
        _url : "time.aws.com",
        _port : 123,  //default NTP port
        _fetchTimeout:  3000 // 3 seconds
    }
}