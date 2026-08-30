// ==UserScript==
// @name         Quick Game Links for archipelago.gg
// @namespace    http://tampermonkey.net/
// @version      2026-08-30
// @description  Replaces Download Link with Game Link for specific games
// @author       ec32
// @match        https://archipelago.gg/room/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=archipelago.gg
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/Eclassic32/ap-userscripts/refs/heads/main/QuickGameLinks-AP.user.js
// @updateURL    https://raw.githubusercontent.com/Eclassic32/ap-userscripts/refs/heads/main/QuickGameLinks-AP.user.js
// @supportURL   https://discord.com/channels/731205301247803413/1528738184794603541
// ==/UserScript==

(function() {
    'use strict';

    const NO_PATCH_STRING = "No file to download for this game."
    const GAME_LINKS = {
        'Jigsaw': (host, port, slot, pass) => {
            return [{text: "Jigsaw", link: `https://jigsaw-ap.netlify.app/?address=${host}:${port}&name=${slot}&password=${pass}`},
                    {text: "Test", link: `https://jigsaw-ap-test.netlify.app/?address=${host}:${port}&name=${slot}&password=${pass}`}]
        },
        'Yacht Dice': (host, port, slot, pass) => {
            return [{text: "Yacht Dice", link: `https://yacht-dice-ap.netlify.app/?db=y&p=AP&go=y&hostport=${host}:${port}&name=${slot}&password=${pass}`}]
        },
        'Yacht Dice Bliss': (host, port, slot, pass) => {
            return [{text: "Yacht Dice Bliss", link: `https://yacht-dice-ap.netlify.app/index234/?db=y&p=AP&go=y&hostport=${host}:${port}&name=${slot}&password=${pass}`}]
        },
        'Nonograhmm': (host, port, slot, pass) => {
            return [{text: "Nonograhmm", link: `https://nonograhmm.netlify.app/?p=AP&hostname=${host}&port=${port}&name=${slot}&password=${pass}`}]
        },
        'Pokepelago': (host, port, slot, pass) => {
            return [{text: "Pokepelago", link: `https://dowlle.github.io/PokepelagoClient?host=${host}&port=${port}&name=${slot}&password=${pass}`}]
        }
    }

    const tableEl = document.querySelector("#slots-table").children[1]
    for (let i = 0; i < tableEl.children.length; i++) {
        const slotEl = tableEl.children[i];
        const game_name = slotEl.children[2].innerHTML;

        // if someone knows how to get Universal Tracker launched from URI, please fix this
//         const ut_uri = `#please_place_it_here`;
//         const trackerEl = slotEl.children[4];
//         trackerEl.appendChild(createBtn("UT", ut_uri));

        const game_func = GAME_LINKS[game_name];
        if (!game_func) { console.log(`${game_name} does not have assosiated link`); continue; }

        const URI = slotEl.children[1].querySelector('a').href;
        const { host, port, slot, pass } = getInfoFromURI(URI);
        const results = game_func(host, port, slot, pass);

        const linkEl = slotEl.children[3];
        if (linkEl.innerText == NO_PATCH_STRING) { linkEl.innerHTML = ""; }
        results.forEach(res => {
            const btn = createBtn(res.text, res.link);
            linkEl.appendChild(btn);
        });
    };

    window.getInfoFromURI = getInfoFromURI;
    function getInfoFromURI(URI) {
        const min = URI.substr(14, URI.indexOf('?game=')-14);
        const match = min.match(/^([^:]+):([^@]+)@([^:]+):(\d+)$/);
        const [, slot, pass, host, port] = match;
        return {slot, pass, host, port};
    }

    window.createBtn = createBtn;
    function createBtn(text, link) {
        const btn = document.createElement('a');
        btn.innerText = ` [${text}]`;
        btn.classList.add('game-fast-link');
        btn.href = link;
        return btn;
    }
})();