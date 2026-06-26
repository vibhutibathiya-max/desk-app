import AsyncStorage from '@react-native-async-storage/async-storage';
import { isEmpty, logMessage } from '../utils/Utility';
import { Appearance } from 'react-native';
import { CallSession } from '../utils/CallSession';
// const _splashBGImage = require("../assets/images/splash_bg_pattern.png");
// const _splashBGImageDark = require("../assets/images/dark/splash_bg_pattern_dark.png");
export async function theme() {
  let themeName = CallSession.state.currentRadioSelectedIndex == 0 ? Appearance.getColorScheme() : await AsyncStorage.getItem("_theme");
  if (themeName == 'light') {
    return {_theme: defaultTheme, themeName};
  } else if (themeName == 'dark') {
    return {_theme: darkTheme, themeName};
  } else if (isEmpty(themeName)) {
    themeName = Appearance.getColorScheme();
    return {_theme: themeName == 'dark' ? darkTheme : defaultTheme, themeName};
  }
}

// Dark theme colors
export const defaultTheme = {
  // ✅ COLORS THAT NEEDS TO BE CHANGED FOR WHITE LABELING
  
  // full screen gradient
  fullScreenGradientLocations: [0.042, 0.334, 0.715, 0.9889], // background gradient locations
  fullScreenGradientAngle: 223.54, // background gradient angle
  // button gradient
  buttonGradientLocations: [0.002, 0.3, 0.97], // button gradient locations
  buttonGradientAngle: 270, // button gradient angle
  // navigation gradient
  navigationGradientLocations: [0.06, 0.35, 0.99, 1], // navigation gradient locations
  navigationGradientAngle: 223.54, // navigation gradient angle

  PRIMARY_COLOR: '#604D99', // Primary color
  GRADIENT_COLORS: ['#6533E2', '#7349DE', '#1F97EF', '#57A1D7'], // Background gradient colors
  BUTTON_GRADIENT_COLOR: ['#6533E2', '#7349DE', '#1F97EF'], // Button gradient colors
  NAVIGATION_GRADIENT_COLOR: ['#6533E2', '#7349DE', '#1F97EF', '#57A1D7'], // Navigation gradient colors
  PRIMARY_THEME_TEXT: '#604D99', // Primary color
  PRIMARY_BG: '#604D99', // Primary color
  PRIMARY_ICON: '#604D99', // Primary color

  CHAT_ICON_COLOR_RECIVER: '#614B98', // Primary color

  GET_STARTED_DISCIMAR_TEXT: '#ffffff', // White color

  BUTTON_COLOR_BLUE: '#57A1D7', // Secondary color

  SEEKBAR_FEEL_CORLOR: '#57A1D7', // Secondary color

  PRIMARY_DARK_COLOR: '#5834D3', // Hold stick color
  PRIMARY_DARK_ICON: '#5834D3', // Hold stick color
  PRIMARY_DARK_COLOR_50: '#5834D380', // Hold stick color opec

  //CRM WEBVIEW COLOR
  WEBVIEW_BG: '#534DC2', // Can be used same as primary color for fail safe

  CONTACT_AVATAR_PHONE_BG: '#614B98', // Primary color
  CONTACT_AVATAR_PHONE_BG_NEW: '#57A1D7', // Secondary color
  CONTACT_AVATAR_PHONE_USER: '#614B98', // Primary color
  CONTACT_AVATAR_REMOTE_BG: '#614B98', // Primary color
  CONTACT_AVATAR_REMOTE_USER: '#614B98', // Primary color

  // QR Screen
  FLASH_ICON: '#579CD3', // Secondary color
  IMG_UPLOAD_ICON: '#614B98', // Primary color

  //Permission Screen
  PERMISSION_GRAY_BACKGROUND: '#d8d8d8', // if required to change for specific customer like mascom use that color or else gray color
  

  // ❌COLORS THAT DO NOT NEEDS TO BE CHANGED FOR WHITE LABELING
  MAIN_BG: '#ffffff',

  SELCTED_BUTTON_STYLE: '#402A83',
  CONFERENCE_BACKGROUND: '#7050D0',
  SEARCH_BACKGROUND: '#A094C2',
  SEARCH_BACKGROUND_CHAT: '#A094C2',
  PRIMARY_DISABLED: '#A094C2',
  SEARCH_BACKGROUND_30: '#A094C280',
  EMAIL_ICON_BACKGROUND: '#EDE6FF',

  TEXT_BLUE: '#008efa',
  CALL_DIRECTION_BG_BLUE: '#006be0',

  CHAT_ICON_COLOR_SENDER: '#006BE0',
  CHAT_ICON_BACKGROUND_SENDER: '#ABDAFF',
  CHAT_ICON_BACKGROUND_RECIVER: '#D2D2D2',

  WHITE: '#ffffff',
  WHITE_TEXT: '#ffffff',
  WHITE_ICON: '#ffffff',
  WHITE_BG: '#ffffff',
  
  // Header specific colors for better customization
  HEADER_TINT_COLOR: '#ffffff', // Color for header icons and back buttons
  HEADER_TEXT_COLOR: '#ffffff', // Color for header title text
  HEADER_BACKGROUND_COLOR: 'transparent', // Header background color
  
  WHITE30: 'rgba(255, 255, 255, 0.3)',
  WHITE40: 'rgba(255, 255, 255, 0.4)',
  WHITE20: 'rgba(255, 255, 255, 0.2)',
  COMMON_WHITE: '#ffffff',

  BLACK: '#000000',
  BLACK_TEXT: '#000000',
  BLACK_ICON: '#000000',
  BLACK_TRANSPARENT: '#63626270',
  COMMON_BLACK: '#000000',
  WHITE_TRANSPARENT: '#63ffffff',

  PERMISSION_TEXT_GRAY: '#8B8B8B', //dark
  PERMISSION_TEXT_TERMS: '#0A0A0A',

  LOGIN_GRAY: '#B1B1B1',
  HINT_TEXT: '#474747',
  HINT_TEXT_GRAY: '#474747',
  TRANSPARENT: 'transparent',
  INACTIVE_TAB_GRAY: '#939393',
  SECONDARY_TEXT_GRAY: '#939393',
  GRAY: '#EAEAEA',
  GRAY_CALL_LOG: '#EAEAEA',
  DIM_GRAY: '#696969',
  FAV_CONTACT_BURGER: '#EAEAEA',
  CONTACTBG: '#FAFAFA',
  STATUS_GRAY: '#575757',
  // CALL_ICON_INACTIVE_BG_GRAY: '#ECECEC',//light
  CALL_ICON_INACTIVE_BG: '#ffffff0d',//light
  CALL_ICON_INACTIVE_BG_VIDEO: '#63626270',//light
  DIALPAD_DIGIT_BG_GRAY: '#f2f2f2',//light
  BG_GRAY_LIGHT: '#F6F6F6',//light
  GRAY_LIGHT: '#F1F1F1',//light
  CALL_ICON_GRAY: '#9D9D9D',
  CALL_ICON_INACTIVE: '#ffffff',
  CALL_ICON_TRANSFER: '#000000',
  CALL_BUTTON_LABLE: '#ffffff',
  CALL_NUM_VIDEO_GRAY: '#C6C6C6',
  MENU_INACTIVE_ICON_GRAY: '#3b3b3b', //dark
  OTP_BG_GRAY: '#f5f5f5',//light
  BUTTON_DISABLE_GRAY: '#BABABA',
  COLOR_LIGHT: '#9384bf',
  DND_GRAY: '#848C92',
  DND_GRAY_THEME_COLOR: '#848C92',
  MESSAGE_TEXT_SENDER: '#474747', //dark
  
  MEDIA_DARK_BACKGROUND: "#402A83",

  LED_GRAY: '#B1B1B1',
  LED_GREEN: '#47CE26',
  LED_ORANGE: '#FCA51C',
  LED_RED: '#F03030',
  LED_GRAY_COLOR: '#949494',
  LED_YELLOW: '#F8C030',

  // Network Quality Badge Background Color
  MODERATE_NETWORK: '#FFC23C',
  LOW_NETWORK: '#E6404E',
  GOOD_NETWORK: '#26AB23',

  CALL_ICON_GREEN: '#26AB23',
  CALL_HANG_UP_RED: '#F03030',

  // SECONDARY_COLOR: '#FFF',
  DIALPAD_SPAN_COLOR: '#919191',
  SCREEN_BG_COLOR: '#FFF',

  CONTACT_AVATAR_TEXT_COLOR: '#FFFFFF',

  ACTIVE_SWITCH_COLOR: '#26AB23',
  SIDE_MENU_ACTIVE_LABEL_COLOR: '#26AB23',
  //SMS
  LINK_PREVIEW_BACKGROUND: '#F7F7F8',
  SMS_BACKGROUND: '#E0E0E0',
  SMS_BACKGROUND_SEND: '#C4E5FF',//light blue
  CHAT_ADMIN_ACTION_BACKGROUND: '#EFEDF5',

  SMS_TEXT_LINK_COLOR: '#6E97F5',
  SMS_SEARCH_HIGHLIGHT_COLOR: '#FFFF00',

  //socket color
  ICON_BACKGROUND: "#E8DFFF",
  ICON_LOADING: "#DBE8F7",
  ICON_FAIL: "#FFCBC9",
  ICON_CONTACT_AVATAR_NEW: "#EDEDED",
  ICON_CONTACT_AVATAR_NEW_STOP: "#FFFFFE",
  ICON_CHAT: "#FFFFFF",

  //QR screen
  QR_ICON_FAIL: "#C7424E",

  //Fav Icon Color
  FAV_SELECTED_COLOR: '#EDCB30',

  //SMS
  GRAY_COLOR: '#949494',
  GRAY_COLOR_30: '#9494944D',
  GRAY_COLOR_TRANSPARENT: '#ADADAD',
  GRAY_BORDER_COLOR: '#BDBDBD',

  DIALOG_BACKGROUND: '#000000AA',
  DIALOG_TEXT: '#000000DD',
  DIALOG_IOS: '#e8e8e8',
  DIALOG_ANDROID: '#ffffff',

  COUNTRY_SEARCH_PLACE_HOLDER: '#2d2926',

  COUNTRY_SEARCH_CONTAINER: '#f4f4f4',
  COUNTRY_SEARCH_VIEW: '#bdbdbd30',
  COUNTRY_SECATION_HEADER: '#2d292670',
  COUNTRY_ITEM_TEXT: '#444444',
  COUNTRY_ITEM_SEPERATOR: '#bdbdbd30',

  APP_DIALOG_PROGRESS_INDICATOR: '#00000089',

  FULL_SCREEN_GRADIENT_1: '#31207600',
  FULL_SCREEN_GRADIENT_2: '#312076',

  CALLLOG_BOTTOM_SHEET: '#E3D9FF',

  VESTED_CALLLOG_DETAIL: '#E5E5E5',
  VESTED_DIALOG_TEXT_SETTING: '#808080',

  CONTACT_REMOVE_CIRCLE: '#FF3B2F',
  CONTACT_ADD_CIRCLE: '#008000',
  CONTACT_BLF_STATUS_RED: '#FF4738',
  CONTACT_BLF_STATUS_GRAY: '#BDBDBD',

  DIALPAD_ICON_CONTAINER: '#000',
  DIALPAD_UNDERLAY_COLOR: '#DDDDDD',

  GREETINGS_TEXT: '#606070',

  HOME_TAB_ICON_HIGHLIGHTER: '#F7FAFD',

  ACCOUNT_CALL_FORWARDING: '#CBCBCB',

  // LANGUAGE_ITEM: '#F0F0F0',

  APPLOCK_RED: '#ea3d13',
  APPLOCK_GRAY: '#a5a5a5',

  IM_ALL_MEDIA: '#EEEEEE',

  DROPDOWN_SELECTED_BG: '#F6F7F8',
  ACCOUNT_MODAL_INDEX: '#C1C1C1',

  SIDE_MENU_BACKGROUND_MAIN: '#FFFFFF',
  SIDE_MENU_BACKGROUND_SECONDARY: '#EAEAEA',
  MESSAGE_TEXT_GRAY: '#848C92',
  TOOLTIP_BACKGROUND: '#6a6a6a',
  VESTED_CHAT_BACKGROUND: '#D7F3FD',
  VESTED_SMS_BACKGROUND: '#C2FABA',

  AVAILABLE_STATUS_COLOR: '#4caf50',
  BUSY_STATUS_COLOR: '#ff9800',
  UNAVAILABLE_STATUS_COLOR: '#9e9e9e',
  DND_STATUS_COLOR: '#f44336',
  WORKINGELSE_STATUS_COLOR: '#009688',
};

export const darkTheme = {
  ...defaultTheme,
  // _splashBGImage: _splashBGImageDark,
  GRADIENT_COLORS: ['#18162C', '#2B2A3C', '#18162C'],
  BUTTON_GRADIENT_COLOR: ['#363257', '#3C3B54'],
  NAVIGATION_GRADIENT_COLOR: ['#18162C', '#2B2A3C', '#18162C'],
  FULL_SCREEN_GRADIENT_1: '#31207600',
  FULL_SCREEN_GRADIENT_2: '#312076',

  PRIMARY_COLOR: '#3F3D52',

  PRIMARY_THEME_TEXT: '#ffffff',
  PRIMARY_ICON: '#ffffff',
  PRIMARY_DARK_ICON: '#ffffff',
  PRIMARY_BG: '#18162C',
  PRIMARY_DISABLED: '#939393',
  MAIN_BG: '#18162C',
  GET_STARTED_DISCIMAR_TEXT: '#ffffff',

  PRIMARY_DARK_COLOR: '#3F3D52',
  PRIMARY_DARK_COLOR_50: '#3F3D5280',
  SEARCH_BACKGROUND_CHAT: '#A094C280',
  
  BLACK: '#ffffff',
  BLACK_TEXT: '#ffffff',
  BLACK_ICON: '#ffffff',
  COMMON_BLACK: '#000000',
  
  WHITE: "#000000",
  WHITE_BG: '#1D1C31',
  COMMON_WHITE: '#ffffff',
  
  // Header specific colors for dark theme
  HEADER_TINT_COLOR: '#ffffff', // Color for header icons and back buttons
  HEADER_TEXT_COLOR: '#ffffff', // Color for header title text
  HEADER_BACKGROUND_COLOR: 'transparent', // Header background color

  TEXT_BLUE: '#ffffff',
  
  CHAT_ICON_COLOR_SENDER: '#FFFFFF',
  CHAT_ICON_BACKGROUND_SENDER: '#363166',
  CHAT_ICON_COLOR_RECIVER: '#FFFFFF',
  CHAT_ICON_BACKGROUND_RECIVER: '#2E2D40',

  GRAY: '#2B2933',
  BG_GRAY_LIGHT: '#2B293C',

  GRAY_CALL_LOG: '#000000',
  DIM_GRAY: '#939393',

  PERMISSION_TEXT_TERMS: '#ffffff',
  PERMISSION_TEXT_GRAY: '#ffffff',
  HINT_TEXT: '#ffffff',
  HINT_TEXT_GRAY: '#474747',

  PERMISSION_GRAY_BACKGROUND: '#63626270', //BLACK_TRANSPARENT color code

  CONTACT_AVATAR_PHONE_BG: '#3F3D52',
  CONTACT_AVATAR_PHONE_BG_NEW: '#3F3D52',
  CONTACT_AVATAR_PHONE_USER: '#3F3D52',
  CONTACT_AVATAR_REMOTE_BG: '#3F3D52',
  CONTACT_AVATAR_REMOTE_USER: '#3F3D52',
  CONTACT_AVATAR_TEXT_COLOR: '#FFFFFF',

  LOGIN_GRAY: '#ffffff',
  DND_GRAY_THEME_COLOR: '#ffffff',
  DROPDOWN_SELECTED_BG: '#000000',

  //CRM WEBVIEW COLOR
  WEBVIEW_BG: '#3F3E51',

  INACTIVE_TAB_GRAY: '#ffffff',
  SECONDARY_TEXT_GRAY: '#ffffff',

  HOME_TAB_ICON_HIGHLIGHTER: '#362a55',

  MENU_INACTIVE_ICON_GRAY: '#ffffff',
  STATUS_GRAY: '#ffffff',

  FAV_CONTACT_BURGER: '#ffffff',
  
  COUNTRY_SEARCH_CONTAINER: '#2B2933',
  COUNTRY_SEARCH_PLACE_HOLDER: '#ffffff',
  COUNTRY_SECATION_HEADER: '#ffffff',
  COUNTRY_ITEM_TEXT: '#ffffff',

  LINK_PREVIEW_BACKGROUND: '#2C2A32',
  SMS_BACKGROUND: '#39374F',
  SMS_BACKGROUND_SEND: '#433D80',
  CHAT_ADMIN_ACTION_BACKGROUND: '#2B2933',
  SMS_SEARCH_HIGHLIGHT_COLOR: '#9987C4',
  
  EMAIL_ICON_BACKGROUND: '#2B2933',
  CALLLOG_BOTTOM_SHEET: '#2B2933',
  CONTACTBG:'#2B2933',
  OTP_BG_GRAY: '#2B2933',//light GRAY

  MESSAGE_TEXT_SENDER: '#848C92', //dark
  SIDE_MENU_BACKGROUND_MAIN: '#2B293C',
  SIDE_MENU_BACKGROUND_SECONDARY: '#3F3D52',

  //QR screen
  FLASH_ICON: '#3F3D52',
  IMG_UPLOAD_ICON: '#2B293C',
  QR_ICON_FAIL: "#C7424E",
  MESSAGE_TEXT_GRAY: '#848C92',

  //VESTED
  VESTED_CHAT_BACKGROUND: '#2C2A32',
  VESTED_SMS_BACKGROUND: '#403E46',
}
