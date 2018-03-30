// Version 2.07 r:00

const Command = require('command')
const config = require('./config.json')
const instance = require('./instance.js')

// credit : https://github.com/Some-AV-Popo
String.prototype.clr = function (hexColor) { return `<font color="#${hexColor}">${this}</font>` }

module.exports = function HidePlayers(d) {
    const command = Command(d)

    let enable = config.enable,
        enableParty = config.enableParty

    let guild = [],
        myGameId = 0,
        myZone = 0,
        party = [],
        visibleRange = 0

    // code
    d.hook('C_SET_VISIBLE_RANGE', (e) => { visibleRange = e.range })
    // reset existing array && refresh upon leaving party
    d.hook('S_LEAVE_PARTY', () => { party.length = 0; if (enable) refresh() })
    d.hook('S_LOAD_TOPO', (e) => { myZone = e.zone })
    d.hook('S_LOGIN', (e) => { myGameId = e.gameId })
    
    // credit : HugeDong69 for Guardian Legion mission crash fix
    d.hook('S_FEARMOVE_STAGE', () => { if (enable) return false })
    d.hook('S_FEARMOVE_END', () => { if (enable) return false })

    d.hook('S_USER_LOCATION', () => { if (enable) return false })

    // pre-req to load in guild members
    d.hookOnce('S_GET_USER_LIST', (e) => {
        for (let character of e.characters)
            if (!guild.includes(character.guildName) && character.guildName !== '')
                guild.push(character.guildName)
    })

    // TODO
    // pre-req to load in party members
    // if new party refresh
    // for every member in the party, ignore self
    // then add new party members to the list
    d.hook('S_PARTY_MEMBER_LIST', (e) => {
        if (instance.includes(myZone)) return
        if (party.length == 0) refresh()
        for (let member of e.members)
            if (member.gameId.equals(myGameId)) continue
            else if (!party.includes(member.gameId.toString()))
                party.push(member.gameId.toString())
    })

    // TODO
    d.hook('S_SPAWN_USER', (e) => {
        if (instance.includes(myZone)) return
        if (enable) {
            if (enableParty) {
                if (!(guild.includes(e.guild) || party.includes(e.gameId.toString()))) return false
                else return
            }
            else return false
        }
    })

    // helper
    function refresh() {
        d.toServer('C_SET_VISIBLE_RANGE', { range: 1 })
        setTimeout(() => { d.toServer('C_SET_VISIBLE_RANGE', { range: visibleRange }) }, 1000)
    }

    // command
    command.add(['hide', 'ㅗㅑㅇㄷ'], (arg) => {
        // toggle
        if (!arg) {
            enable = !enable
            refresh()
            send(`${enable ? 'Enabled'.clr('56B4E9') : 'Disabled'.clr('E69F00')}`)
        // hide/show all player
        } else if (arg === 'a' || arg === 'ㅁ') {
            enableParty = !enableParty
            refresh()
             send(`Show guild/party members ${enableParty ? 'enabled'.clr('56B4E9') : 'disabled'.clr('E69F00')}`)
        // refresh
        } else if (arg === 'r' || arg === 'ㄱ') {
            refresh()
            send(`Refreshed`.clr('56B4E9'))
        } else send(`Invalid argument.`.clr('FF0000'))
    })
    function send(msg) { command.message(`[hide-players] : ` + msg) }

}