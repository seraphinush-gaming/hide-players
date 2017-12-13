// OPCODE REQUIRED :
// - C_SET_VISIBLE_RANGE
// - S_GET_USER_LIST
// - S_LEAVE_PARTY
// - S_LOGIN
// - S_PARTY_MEMBER_LIST
// - S_SPAWN_USER

// Version 2.00 r:00

module.exports = function HidePlayers(d) {

    let enable = true,
        gameId = 0,
        visibleRange = 0

    let guild = []
        party = []

    // code
    d.hook('C_SET_VISIBLE_RANGE', (e) => { visibleRange = e.range })
    d.hook('S_LEAVE_PARTY', () => { party.length = 0 })
    d.hook('S_LOGIN', (e) => { gameId = e.gameId })

    d.hookOnce('S_GET_USER_LIST', 12, (e) => {
        for (let character of e.characters)
            if (!guild.includes(character.guild))
                guild.push(character.guild)
    })

    d.hook('S_PARTY_MEMBER_LIST', (e) => {
        for (let member of e.members)
            if (!member.gameId.equals(gameId))
                party.push(member.gameId.toString())
    })

    d.hook('S_SPAWN_USER', (e) => {
        if (enable && !(guild.includes(e.guild) || party.includes(e.gameId.toString()))) return false
    })

    // helper
    function refreshNearbyPlayers() {
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
            if (!arg) {
                enable = !enable
                refreshNearbyPlayers()
                send(`Hide players ${enable ? 'enabled'.clr('56B4E9') : 'disabled'.clr('E69F00')}` + `.`.clr('FFFFFF'))
            } else if (arg == 'refresh') {
                refreshNearbyPlayers()
                send(`Refreshed.`.clr('56B4E9'))
            } else send(`Invalid argument.`.clr('FF0000'))
        })
        function send(msg) { command.message(`[hide-players] : ` + msg) }
    } catch (e) { console.log(`[ERROR] -- hide-players module --`) }

}

// credit : https://github.com/Some-AV-Popo
String.prototype.clr = function (hexColor) { return `<font color="#${hexColor}">${this}</font>` }
