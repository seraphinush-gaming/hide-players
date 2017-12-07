// OPCODE REQUIRED :
// - C_SET_VISIBLE_RANGE
// - S_SPAWN_USER

// Version 1.3 r:02

module.exports = function HidePlayers(d) {

	let enable = true,
		visibleRange = 0

	// code
	d.hook('C_SET_VISIBLE_RANGE', (e) => { visibleRange = e.range })

	d.hook('S_SPAWN_USER', () => { if (enable) return false })

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
		command.add(['hide', 'ㅗㅑㅇㄷ'], () => {
			enable = !enable
			refreshNearbyPlayers()
			send(`Hide players ${enable ? '<font color="#56B4E9">enabled</font>' : '<font color="#E69F00">disabled</font>'}<font>.</font>`)
		})
		function send(msg) {
			command.message(`[hide-players] : ` + msg)
		}
	} catch (e) {
		console.log(`[ERROR] -- hide-players module --`)
	}

}
