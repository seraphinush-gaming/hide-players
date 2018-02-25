// OPCODE REQUIRED :
// - C_SET_VISIBLE_RANGE
// - S_GET_USER_LIST
// - S_LEAVE_PARTY
// - S_LOAD_TOPO
// - S_LOGIN
// - S_PARTY_MEMBER_LIST
// - S_SPAWN_USER

// Version 2.05 r:00

const instance = [
	102, 103, 110, 111, 112, 116, 117, 118, 119, // Battlegrounds
    //7011,   // Guardian Legion mission : Shadow of the Gutrends -- fixed
    9710,   // Broken Prison -- certain mechanic causes client to crash
    9720,   // Antaros' Abyss -- certain mechanic causes client to crash
    9739,   // Rebel's Hideout -- certain mechanic causes client to crash
    9920,   // Antaros' Abyss -- certain mechanic causes client to crash
    9939,   // Rebel's Hideout (hard) -- certain mechanic causes client to crash
]

module.exports = function HidePlayers(d) {

    let enable = true,
        enableParty = true,
        gameId = 0,
        myZone = 0,
        visibleRange = 0

    let guild = [],
        party = []

    // code
    d.hook('C_SET_VISIBLE_RANGE', (e) => { visibleRange = e.range })
    // refresh upon leaving party
    d.hook('S_LEAVE_PARTY', () => { party.length = 0; if (enable) refresh() })
    d.hook('S_LOAD_TOPO', (e) => { myZone = e.zone })
    d.hook('S_LOGIN', (e) => { gameId = e.gameId })

    // pre-req to load in guild members; definition 12 for K TERA
    d.hookOnce('S_GET_USER_LIST', 12, (e) => {
        for (let character of e.characters)
            if (!guild.includes(character.guild) && character.guild !== '')
                guild.push(character.guild)
    })

    // pre-req to load in party members
    d.hook('S_PARTY_MEMBER_LIST', (e) => {
        if (instance.includes(myZone)) return
        if (enable && (party.length === 0 || party.length !== e.members.length)) refresh()
        for (let member of e.members)
            if (!member.gameId.equals(gameId))
                party.push(member.gameId.toString())
    })

    d.hook('S_SPAWN_USER', (e) => {
        if (instance.includes(myZone)) return
        if (enable) {
            if (enableParty) {
                if (!(guild.includes(e.guild) || party.includes(e.gameId.toString()))) return false
            }
            else return false
        }
    })

    // credit : HugeDong69 for Guardian Legion mission crash fix
    d.hook('S_FEARMOVE_STAGE', () => { if (enable) return false })
    d.hook('S_FEARMOVE_END', () => { if (enable) return false })

    // helper
    function refresh() {
        d.toServer('C_SET_VISIBLE_RANGE', { range: 1 })
        setTimeout(() => {
            d.toServer('C_SET_VISIBLE_RANGE', { range: visibleRange })
        }, 1000)
    }

    // command
    try {
        const Command = require('command')
        const command = Command(d)
        command.add(['hide', 'ㅗㅑㅇㄷ'], (arg) => {
            // toggle
            if (!arg) {
                enable = !enable
                refresh()
                send(`Hide players ${enable ? 'enabled'.clr('56B4E9') : 'disabled'.clr('E69F00')}` + `.`.clr('FFFFFF'))
            // refresh
            } else if (arg === 'all' || arg === '미ㅣ') {
                enableParty = !enableParty
                refresh()
                send(`Show guild/party members ${enableParty ? 'enabled'.clr('56B4E9') : 'disabled'.clr('E69F00')}` + `.`.clr('FFFFFF'))
            } else if (arg === 'r' || arg === 'ㄱ' || arg === 'refresh') {
                refresh()
                send(`Refreshed.`.clr('56B4E9'))
            } else send(`Invalid argument.`.clr('FF0000'))
        })
        function send(msg) { command.message(`[hide-players] : ` + [...arguments].join('\n\t - ')) }
    } catch (e) { console.log(`[ERROR] -- hide-players module --`) }

}

// credit : https://github.com/Some-AV-Popo
String.prototype.clr = function (hexColor) { return `<font color="#${hexColor}">${this}</font>` }
