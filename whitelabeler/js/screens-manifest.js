/**
 * Single source of truth for preview screens.
 * Each entry maps to a fragment under /screens.
 */
window.TRAGO_SCREENS = [
  { id: "splash", label: "Splash", file: "screens/splash.html", default: true },
  { id: "get-started", label: "Get Started", file: "screens/get-started.html" },
  { id: "login", label: "Login", file: "screens/login.html" },
  { id: "home", label: "Home Dialer", file: "screens/home.html" },
  { id: "incoming-call", label: "Incoming Call", file: "screens/incoming-call.html" },
  { id: "ongoing-call", label: "Ongoing Call", file: "screens/ongoing-call.html" },
  { id: "conference-call", label: "Conference Call", file: "screens/conference-call.html" },
  { id: "chats", label: "Chats", file: "screens/chats.html" },
  { id: "messages", label: "Messages", file: "screens/messages.html" },
  { id: "contacts", label: "Contacts", file: "screens/contacts.html" },
  { id: "sms-chat", label: "Messages Chat", file: "screens/sms-chat.html" },
  { id: "mms-doc", label: "MMS — Doc", file: "screens/mms-doc.html" },
  { id: "mms-mp3", label: "MMS — MP3", file: "screens/mms-mp3.html" },
  { id: "settings", label: "Settings", file: "screens/settings.html" },
];

/** Navigator options include virtual states that reuse an existing panel. */
window.IMAGE_GALLERY_SCREEN_ID = "image-gallery";

window.TRAGO_SCREEN_NAV_OPTIONS = [
  ...window.TRAGO_SCREENS.map(({ id, label }) => ({ id, label })),
  { id: "chats-change-status", label: "Chats — Change Status" },
  { id: window.IMAGE_GALLERY_SCREEN_ID, label: "Image Gallery" },
];
