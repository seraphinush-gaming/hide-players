// OPCODE REQUIRED :
// - C_SET_VISIBLE_RANGE
// - S_SPAWN_USER

module.exports = function HidePlayers(dispatch) {

	let enable = true
	let visibleRange = 2500

	// command
	try {
		const Command = require('command')
		const command = Command(dispatch)
		command.add('hide', () => {
			enable = !enable
			refreshNearbyPlayers()
			send(`[hide-players] : Hide players ${enable ? '<font color="#56B4E9">enabled</font>' : '<font color="#E69F00">disabled</font>'}.`)
		})
		function send(msg) {
			command.message(`<font color="#FFFFFF">` + msg + `</font>`)
		}
	} catch (e) {
		console.log(`[ERROR] -- hide-players module --`)
	}

	// code
	dispatch.hook('C_SET_VISIBLE_RANGE', 1, event => { visibleRange = event.range })
	
	dispatch.hook('S_SPAWN_USER', 1, () => { if (enable) return false })

	function refreshNearbyPlayers() {
		dispatch.toServer('C_SET_VISIBLE_RANGE', 1, { range: 1 })
		setTimeout(() => {
			dispatch.toServer('C_SET_VISIBLE_RANGE', 1, { range: visibleRange })
		}, 1000)
	}
	
}
