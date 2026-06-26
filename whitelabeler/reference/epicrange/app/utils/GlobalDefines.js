// Just Write App name here so it will use this name and replace Tragofone with app name 
// in all the strings in this file
const APP_NAME = "Tragofone";
const withAppName = (s) => s.replace(/Tragofone/g, APP_NAME);

module.exports = {
  _appName: APP_NAME,
  _version: "5.13.12",
  _sipPort: "",
  _sipProtocol: "udp",
  _apiPrefix: { "s.tragofone.com": { _version: "v1.57.4" }, "ecodialerdev.ecosmob.net": { _version: "v1.58.1" } },
  _environment: { production: "s.tragofone.com" ,  sandbox: "ecodialerdev.ecosmob.net" },
  _apiUrls: (version, resellerId = '') => ({
    // if building for a reseller, we need to add the reseller id to the api url like this below example:
    // `https://s1.tragofone.com:8091/${version}${resellerId ? `/reseller/${resellerId}` : ''}/api`
    "95.217.223.97": `https://s1.tragofone.com:8091/${version}/api`,
    "2a01:4f9:c010:d41b::1": `https://s1.tragofone.com:8091/${version}/api`, //IPV6 : getting using this command: dig s1.tragofone.com AAAA for JIRA: TRAG-12695
    "5.161.125.206": `https://s2.tragofone.com:8091/${version}/api`,
    "2a01:4ff:f0:a4be::1": `https://s2.tragofone.com:8091/${version}/api`, //IPV6 
    "95.216.149.126": `https://s1.ecosmob.net:8091/${version}/api`,
    "2a01:4f9:c010:12ee::1": `https://s1.ecosmob.net:8091/${version}/api`, //IPV6 
    "65.108.57.11": `https://s2.ecosmob.net:8091/${version}/api`,
    "2a01:4f9:c010:e4fb::1": `https://s2.ecosmob.net:8091/${version}/api`, //IPV6 
  }),
  _ssoLoginURL: {
    "s.tragofone.com": "https://s.tragofone.com:8091/api/auth/",
    "ecodialerdev.ecosmob.net": "https://ecodialerdev.ecosmob.net:8091/api/auth/",
  },

  _xmppDomains: {
    "s.tragofone.com": {
      _xmppDomain: 's.tragofone.com',
      _xmppConference: 'conference.s.tragofone.com',
      _xmppPubsubService: 'pubsub.s.tragofone.com',
      _xmppUploadService: 'upload.s.tragofone.com',
    },
    "ecodialerdev.ecosmob.net": {
      _xmppDomain: 'ecodialerdev.ecosmob.net',
      _xmppConference: 'conference.ecodialerdev.ecosmob.net',
      _xmppPubsubService: 'pubsub.ecodialerdev.ecosmob.net',
      _xmppUploadService: 'upload.ecodialerdev.ecosmob.net',
    }
  },

  //_anwseringRulesUrl & _wssBLFServer are for netsapiens
  _anwseringRulesUrl: 'https://tragofone.vestednetworks.com:9081/answering-rules/rules',
  _wssBLFServer: 'https://tragofone.vestednetworks.com:8091',
  _debugMode: false,
  _sipTrace: true,
  _cdrRetention: 200,
  _defaultLanguage: "en",
  _splashScreenTimeout: 3000,
  _stunPort: 3478,
  _turnPort: 11001,
  _turnServerAuthSecret: "4Pa49oH@iAY~9TzIj=3rdf3f23rd23r23eefcwesfweds",
  _wssServer: "wss://s1.tragofone.com:7442",
  _wssServerXMPP: (server) => `wss://${server}:5443/ws`,
  _blfSubscribeExpiry: 28800,  // 15 minutes for testing (will be 28800 for production - 8 hours)
  _blfSubscribeThreshold: 25200,  // 10 minutes for testing (will be 25200 for production - 7 hours)
  _legacyUserAgent:true,
  _webViewUserAgentValue: "Tragofone-VERSION",
  _webViewUserAgentIOS: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile Safari/605.1.15 Tragofone-VERSION',
  _webViewUserAgentAndroid: 'Mozilla/5.0 (Linux; Android 13; Pixel 6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36 Tragofone-VERSION',
  _aboutUsUrl: {
    'en': "https://tragofone.com/about-us",
    'it': "https://tragofone.com/about-us",
    'fr': "https://tragofone.com/about-us",
    'du': "https://tragofone.com/about-us",
    'de': "https://tragofone.com/about-us",
    'zh-cn': "https://tragofone.com/about-us",
    'zh-tw': "https://tragofone.com/about-us",
    'ar': "https://tragofone.com/about-us",
    'pt-br': "https://tragofone.com/about-us",
    'gb': "https://tragofone.com/about-us",
    'tr': "https://tragofone.com/about-us",
    'ru': "https://tragofone.com/about-us",
    'he': "https://tragofone.com/about-us",
    'es': "https://tragofone.com/about-us",
  },
  _wssTest: true,
  _termsText:
    withAppName("By Joining I accept Tragofone's Terms of service to learn more about how handle and protect personal data, read our Privacy Policy"),
  // _resetAlertTitle: strings._LogoutTitle,
  // _resetAlertDesc: strings._LogoutDescription,
  _systemAlertWindowPermissionDesc:
    "We required Draw Over Apps permission to add support of calling in App Background mode. We'll navigate you to settings menu where you can grant that permission.",
  _company_logo:
    "https://www.topdevelopers.co/upload/20190410105022988314164.png",
  _company_logo_white:
    "https://cdn-sharing.adobecc.com/id/urn:aaid:sc:US:449a0105-6e32-47b9-8a7e-e9efd3d7b743;version=0?component_id=ba713414-d2b3-4072-835d-27cea2e4b612&api_key=CometServer1&access_token=1608168772_urn%3Aaaid%3Asc%3AUS%3A449a0105-6e32-47b9-8a7e-e9efd3d7b743%3Bpublic_58c72ff0d2ece7b2906184d986932c72a621996c",
  _company_icon:
    "https://cdn-sharing.adobecc.com/id/urn:aaid:sc:US:449a0105-6e32-47b9-8a7e-e9efd3d7b743;version=0?component_id=9c35d788-33b4-4375-92ed-a1a913c8c639&api_key=CometServer1&access_token=1608168772_urn%3Aaaid%3Asc%3AUS%3A449a0105-6e32-47b9-8a7e-e9efd3d7b743%3Bpublic_58c72ff0d2ece7b2906184d986932c72a621996c",
  _privacyPolicyUrl: {
    'en': "https://tragofone.com/privacy-policy",
    'it': "https://tragofone.com/privacy-policy",
    'fr': "https://tragofone.com/privacy-policy",
    'du': "https://tragofone.com/privacy-policy",
    'de': "https://tragofone.com/privacy-policy",
    'zh-cn': "https://tragofone.com/privacy-policy",
    'zh-tw': "https://tragofone.com/privacy-policy",
    'ar': "https://tragofone.com/privacy-policy",
    'pt-br': "https://tragofone.com/privacy-policy",
    'gb': "https://tragofone.com/privacy-policy",
    'tr': "https://tragofone.com/privacy-policy",
    'ru': "https://tragofone.com/privacy-policy",
    'he': "https://tragofone.com/privacy-policy",
    'es': "https://tragofone.com/privacy-policy",
  },
  _helpAndroidUrl: {
    'en': 'https://tragofone.com/',
    'it': 'https://tragofone.com/',
    'fr': 'https://tragofone.com/',
    'du': 'https://tragofone.com/',
    'de': 'https://tragofone.com/',
    'zh-cn': 'https://tragofone.com/',
    'zh-tw': 'https://tragofone.com/',
    'ar': 'https://tragofone.com/',
    'pt-br': 'https://tragofone.com/',
    'gb': 'https://tragofone.com/',
    'tr': 'https://tragofone.com/',
    'ru': 'https://tragofone.com/',
    'he': 'https://tragofone.com/',
    'es': 'https://tragofone.com/',
  },
  _helpIOSUrl: {
    'en': 'https://tragofone.com/',
    'it': 'https://tragofone.com/',
    'fr': 'https://tragofone.com/',
    'du': 'https://tragofone.com/',
    'de': 'https://tragofone.com/',
    'zh-cn': 'https://tragofone.com/',
    'zh-tw': 'https://tragofone.com/',
    'ar': 'https://tragofone.com/',
    'pt-br': 'https://tragofone.com/',
    'gb': 'https://tragofone.com/',
    'tr': 'https://tragofone.com/',
    'ru': 'https://tragofone.com/',
    'he': 'https://tragofone.com/',
    'es': 'https://tragofone.com/',
  },
  _siteUrl: "https://tragofone.com",
  poweredBy: APP_NAME,
  _displayPoweredBy: true,
  _aboutDesc:
    withAppName("Tragofone has got zest. It has zing and brings a bit of bling to the staid softphone, making it exciting and easy to use. Communicate with ease like never before. \n\nIt took us quite a bit of research and study of what people actually expect from a softphone. All of this is distilled into forming the soul of perfection of our softphone that defines a better way of communication.\n\nThe technical underpinnings that define excellence and ease of use are rooted in our parent company Ecosmob. Ecosmob, since its operation is now acclaimed in enterprise and carrier grade telephony circles as a provider of the finest VoIP technology products such as IP PBX, session border controller and class 4/5 softswitches. At another level Ecosmob works in artificial intelligence and machine learning. Expertise at a macro level filters down into our Tragofone softphone that embodies the finest pick of VoIP crafted and implemented by maestros. What you get is a fluidly inventive and intuitive product that becomes your communications second nature.\n\nAs a company raring to (with the support of Ecosmob) Tragofone is rooted in traditional values but with a modern outlook to matching expectations of even the most rigorously demanding client. We know what people and current situation needs and bring to you VoIP products that make life easier and business competitive. We believe in aligning with customer interests and delivering full value.\n\nTry Tragofone. Before long you will, just as people say â€œGoogle itâ€, say-â€œTragofoneâ€ for communications."),
  _aboutWebSite: "https://tragofone.ecosmob.net",
  isAboutUsAsUrl: true,
  isPrivacyPolicyAsUrl: true,
  _privacyDesc:
    withAppName("Tragofone is an SIP (Session Initiation Protocol) phone application that runs on Android and iOS phones. User can use Tragofone credentials to register with SIP Servers/PBX/Call Processing Unit and make inbound and outbound calls over the internet. Main purpose of this dialer app is to use such VOIP providers and make VOIP calls.\n\nThis legal document is an electronic record in terms of Indian Information Technology Act, 2000, and rules there under as applicable and the amended provisions pertaining to electronic records in various statutes as amended by the Information Technology Act, 2000. This electronic record is generated by a computer system and does not require any physical or digital signatures.\n\nThis legal document is published in accordance with the provisions of Rule 4 of the Indian Information Technology (Reasonable security practices and procedures and sensitive personal data or information) Rules, 2011 of Information Technology Act, 2000 amended through Information Technology Amendment Act, 2008 that require publishing the privacy policy for access or usage ofÂ https://www.tragofone.com, its mobile app and other integrated systems (â€œTragofoneâ€). By using Tragofone, you clearly agree and acknowledge to be bound by terms of this policy. References in this policy to â€œweâ€ or â€œusâ€ or â€œwebâ€ or â€œsiteâ€ or â€œappâ€ or â€œcompanyâ€ are references to Tragofone and its integrated systems and â€œyouâ€ as user of Tragofone.\n\nThis privacy policy applies to all users of Tragofone.\n\nBy using/browsing Tragofone, clicking the â€œI accept/I agreeâ€ button or completing the registration process, you clearly agree and acknowledge that you have reviewed this privacy policy, given your consent and accepted this agreement."),

  _aboutHtmlContent:
    withAppName('<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>' +
    "<p>Tragofone has got zest. It has zing and brings a bit of bling to the staid softphone, making it exciting and easy to use. Communicate with ease like never before.</p>" +
    "<p>It took us quite a bit of research and study of what people actually expect from a softphone. All of this is distilled into forming the soul of perfection of our softphone that defines a better way of communication.</p>" +
    "<p>The technical underpinnings that define excellence and ease of use are rooted in our parent company Ecosmob. Ecosmob, since its operation is now acclaimed in enterprise and carrier grade telephony circles as a provider of the finest VoIP technology products such as IP PBX, session border controller and class 4/5 softswitches. At another level Ecosmob works in artificial intelligence and machine learning. Expertise at a macro level filters down into our Tragofone softphone that embodies the finest pick of VoIP crafted and implemented by maestros. What you get is a fluidly inventive and intuitive product that becomes your communications second nature.</p>" +
    "<p>As a company raring to (with the support of Ecosmob) Tragofone is rooted in traditional values but with a modern outlook to matching expectations of even the most rigorously demanding client. We know what people and current situation needs and bring to you VoIP products that make life easier and business competitive. We believe in aligning with customer interests and delivering full value.</p>" +
    "<p>Try Tragofone. Before long you will, just as people say “Google it”, say-<br>“Tragofone” for communications.</p>" +
    "</body></html>"),
  _inviteWaitingTime: 15,
  _termAndConditions:
    "https://tragofone.ecosmob.net/end-user-terms-of-service/",
  androidAppLink:
    "https://play.google.com/store/apps/details?id=com.tragofone.app&hl=en_IN&gl=US",
  iOSAppLink: "https://apps.apple.com/in/app/tragofone/id1557744936",
  dialNumberRegex: /\D/g,
  dialNumberRegexWithStar: /[a-zA-Z0-9`~!@#$%^&*+()_|\-=â€“?;:'"' ',.<>\{\}\[\]\\\/]/gi,
  dialpadMaxInputLength: 32,
  forgotPwdEnable: true,
  cprNumberDisplay: false,
  apiTimeOut: 20,
  shouldDisplayWssURL: __DEV__ ? true : false,
  playRingback: true, //False value for d2telecom
  defalutEnglishUK: false, //True value for netcarrier client - 8155
  poweredByTextBefore: false, //True value for D2Telecom client - 8365
  remoteContactsPerBatch: 2000,
  orthoVoIPAccessToken : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VyTmFtZSI6InRyYWdvcGhvbmVAYWxpZ25waG9uZS5jb20iLCJVc2VySWQiOiJhNGFkMTJmYi1kYWUzLTQ3ZWUtYmI3Ny0yZjEwMDhmNmQ1OTMiLCJVc2VyVHlwZSI6IlByYWN0aWNlIiwiRW1haWwiOiJ0cmFnb3Bob25lQGFsaWducGhvbmUuY29tIiwiRmlyc3ROYW1lIjoiVHJhZ29waG9uZSIsIkxhc3ROYW1lIjoiVXNlciIsIkRpc3BsYXlOYW1lIjoiIiwiUHJlZmVycmVkTmFtZSI6IiIsIlByYWN0aWNlR3VpZCI6IjE0YjFhZjVmLWI0YzYtNDc0Yy05ZTQyLTk1ZDc1YTc1MmVlMCIsIlByYWN0aWNlSWQiOiI0IiwiQ2hyb21lRXh0ZW5zaW9uUHJlZmVyZW5jZSI6IkJvdHRvbSBSaWdodCIsIlByYWN0aWNlTG9jYXRpb25JZCI6IjQiLCJSb2xlIjoiU3VwZXIgQWRtaW4iLCJpc3MiOiJodHRwczovL29ydGhvYXBpLXByb2QuYXp1cmV3ZWJzaXRlcy5uZXQvIiwiYXVkIjoiaHR0cHM6Ly9vcnRob2FwaS1wcm9kLmF6dXJld2Vic2l0ZXMubmV0LyJ9.GalWQofj3BzsavFH9NUztaRu6rNFihw4WK8ulRO4ReI',
  _isSelfBLFAndPresenceEnabled: false,
  _defaultBLFSubscribeMethod: 'BLF (rfc4235)', // RPID (rfc4480) or BLF (rfc4235)
  isStaticResellerBuild: false, // In case if we are building a reseller build for a specific reseller, we need to set this to true and set the reseller name below
  _resellerName: '', // reseller name , leave blank if not a reseller build
  permissionScreenWithGradient: false, // True value if want gradient color in permission screen FOR EX : Mascom
  movoxCustomization: false, // true for Movox (XPhone Mobile Softphone) customization, false for Tragofone customization
  itechStroCustomization: false, // true for iTechStro customization, false for Tragofone customization
};
