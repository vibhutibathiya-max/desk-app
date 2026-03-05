/**
 * Icon Gallery - Per-icon color definitions
 * Each icon lists its color slots: id, label, default hex, variable name, and hex(es) to replace in SVG.
 * User changes a color → replace in SVG → live preview + stored for export.
 */
(function (global) {
    'use strict';
    var ICON_COLORS = {
        'done.svg': {
            colors: [
                { id: 'bg', label: 'Background', default: '#E8DFFF', var: '--icon-done-bg', replace: ['#E8DFFF'] },
                { id: 'g1', label: 'Gradient Start', default: '#6533E2', var: '--icon-done-g1', replace: ['#6533E2'] },
                { id: 'g2', label: 'Gradient Mid', default: '#7349DE', var: '--icon-done-g2', replace: ['#7349DE'] },
                { id: 'g3', label: 'Gradient End', default: '#1F97EF', var: '--icon-done-g3', replace: ['#1F97EF'] }
            ]
        },
        'logout.svg': {
            colors: [
                { id: 'g1', label: 'Gradient Start', default: '#6533E2', var: '--icon-logout-g1', replace: ['#6533E2'] },
                { id: 'g2', label: 'Gradient Mid 1', default: '#7349DE', var: '--icon-logout-g2', replace: ['#7349DE'] },
                { id: 'g3', label: 'Gradient Mid 2', default: '#1F97EF', var: '--icon-logout-g3', replace: ['#1F97EF'] },
                { id: 'g4', label: 'Gradient End', default: '#57A1D7', var: '--icon-logout-g4', replace: ['#57A1D7'] }
            ]
        },
        'autoStartup.svg': {
            colors: [
                { id: 'g1', label: 'Gradient Start', default: '#6533E2', var: '--icon-autostartup-g1', replace: ['#6533E2'] },
                { id: 'g2', label: 'Gradient Mid 1', default: '#7349DE', var: '--icon-autostartup-g2', replace: ['#7349DE'] },
                { id: 'g3', label: 'Gradient Mid 2', default: '#1F97EF', var: '--icon-autostartup-g3', replace: ['#1F97EF'] },
                { id: 'g4', label: 'Gradient End', default: '#57A1D7', var: '--icon-autostartup-g4', replace: ['#57A1D7'] }
            ]
        },
        'blind-trasferred.svg': {
            colors: [
                { id: 'g1', label: 'Gradient 1 Start', default: '#6533E2', var: '--icon-blind-g1', replace: ['#6533E2'] },
                { id: 'g2', label: 'Gradient 1 Mid', default: '#7349DE', var: '--icon-blind-g2', replace: ['#7349DE'] },
                { id: 'g3', label: 'Gradient 1 End', default: '#1F97EF', var: '--icon-blind-g3', replace: ['#1F97EF'] },
                { id: 'g4', label: 'Gradient 2 End', default: '#57A1D7', var: '--icon-blind-g4', replace: ['#57A1D7'] }
            ]
        },
        're-register.svg': {
            colors: [
                { id: 'bg', label: 'Background', default: '#E8DFFF', var: '--icon-reregister-bg', replace: ['#E8DFFF'] },
                { id: 'g1', label: 'Gradient Start', default: '#6533E2', var: '--icon-reregister-g1', replace: ['#6533E2'] },
                { id: 'g2', label: 'Gradient Mid', default: '#7349DE', var: '--icon-reregister-g2', replace: ['#7349DE'] },
                { id: 'g3', label: 'Gradient End', default: '#1F97EF', var: '--icon-reregister-g3', replace: ['#1F97EF'] }
            ]
        },
        'clear-history.svg': {
            colors: [
                { id: 'g1', label: 'Gradient Start', default: '#6533E2', var: '--icon-clear-g1', replace: ['#6533E2'] },
                { id: 'g2', label: 'Gradient Mid', default: '#7349DE', var: '--icon-clear-g2', replace: ['#7349DE'] },
                { id: 'g3', label: 'Gradient End', default: '#1F97EF', var: '--icon-clear-g3', replace: ['#1F97EF'] }
            ]
        },
        'export-icon.svg': {
            colors: [
                { id: 'g1', label: 'Gradient Start', default: '#6533E2', var: '--icon-export-g1', replace: ['#6533E2'] },
                { id: 'g2', label: 'Gradient Mid 1', default: '#7349DE', var: '--icon-export-g2', replace: ['#7349DE'] },
                { id: 'g3', label: 'Gradient Mid 2', default: '#1F97EF', var: '--icon-export-g3', replace: ['#1F97EF'] },
                { id: 'g4', label: 'Gradient End', default: '#57A1D7', var: '--icon-export-g4', replace: ['#57A1D7'] }
            ]
        },
        'import-icon.svg': {
            colors: [
                { id: 'g1', label: 'Gradient Start', default: '#6533E2', var: '--icon-import-g1', replace: ['#6533E2'] },
                { id: 'g2', label: 'Gradient Mid 1', default: '#7349DE', var: '--icon-import-g2', replace: ['#7349DE'] },
                { id: 'g3', label: 'Gradient Mid 2', default: '#1F97EF', var: '--icon-import-g3', replace: ['#1F97EF'] },
                { id: 'g4', label: 'Gradient End', default: '#57A1D7', var: '--icon-import-g4', replace: ['#57A1D7'] }
            ]
        },
        'web-socket-connection.svg': {
            colors: [
                { id: 'circle', label: 'Circle Fill', default: '#614B98', var: '--icon-websocket-circle', replace: ['#614B98'] },
                { id: 'path', label: 'Path Fill', default: '#57A1D7', var: '--icon-websocket-path', replace: ['#57A1D7'] },
                { id: 'g1', label: 'Gradient Start', default: '#6533E2', var: '--icon-websocket-g1', replace: ['#6533E2'] },
                { id: 'g2', label: 'Gradient Mid 1', default: '#7349DE', var: '--icon-websocket-g2', replace: ['#7349DE'] },
                { id: 'g3', label: 'Gradient Mid 2', default: '#1F97EF', var: '--icon-websocket-g3', replace: ['#1F97EF'] },
                { id: 'g4', label: 'Gradient End', default: '#57A1D7', var: '--icon-websocket-g4', replace: ['#57A1D7'] }
            ]
        },
        'api-test-connection.svg': {
            colors: [
                { id: 'g1', label: 'Gradient Start', default: '#6533E2', var: '--icon-api-g1', replace: ['#6533E2'] },
                { id: 'g2', label: 'Gradient Mid', default: '#7349DE', var: '--icon-api-g2', replace: ['#7349DE'] },
                { id: 'g3', label: 'Gradient End', default: '#1F97EF', var: '--icon-api-g3', replace: ['#1F97EF'] }
            ]
        },
        'sip-configuration.svg': {
            colors: [
                { id: 'g1', label: 'Gradient Start', default: '#6533E2', var: '--icon-sip-g1', replace: ['#6533E2'] },
                { id: 'g2', label: 'Gradient Mid', default: '#7349DE', var: '--icon-sip-g2', replace: ['#7349DE'] },
                { id: 'g3', label: 'Gradient End', default: '#1F97EF', var: '--icon-sip-g3', replace: ['#1F97EF'] }
            ]
        },
        'no-calls-found.svg': {
            colors: [
                { id: 'primary', label: 'Primary', default: '#614B98', var: '--icon-nocalls-primary', replace: ['#614B98'] },
                { id: 'accent', label: 'Accent', default: '#C5DBFF', var: '--icon-nocalls-accent', replace: ['#C5DBFF'] }
            ]
        },
        'no-contacts-found.svg': {
            colors: [
                { id: 'primary', label: 'Primary', default: '#614B98', var: '--icon-nocontacts-primary', replace: ['#614B98'] }
            ]
        },
        'no-favoritecontact-found.svg': {
            colors: [
                { id: 'primary', label: 'Primary', default: '#614B98', var: '--icon-nofavorite-primary', replace: ['#614B98'] }
            ]
        }
    };
    global.ICON_COLOR_CONFIG = {
        get: function (filename) { return ICON_COLORS[filename] || null; },
        hasColors: function (filename) { return !!ICON_COLORS[filename]; },
        allFilenames: function () { return Object.keys(ICON_COLORS); }
    };
})(typeof window !== 'undefined' ? window : this);
