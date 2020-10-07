import React, {useState, useEffect} from "react";
import { useHistory } from 'react-router-dom';
// import { Link } from 'react-router-dom'
// import PropTypes from 'prop-types'


function Lobby({gameChannel, roomId, isPlaying, lobbyChannel, pubnub}) {

	const history = useHistory()

	const storedId = localStorage.getItem('roomId')

	useEffect(() => {
		if (lobbyChannel != null) {
			pubnub.getMessage(lobbyChannel, (msg) => {
				// Start the game once an opponent joins the channel
				if (msg.message.notRoomCreator) {
					// Create a different channel for the game
					gameChannel = "debatablegame--" + roomId;

					pubnub.subscribe({
						channels: [gameChannel],
					});

					isPlaying = true
					history.push('/game')
			}
		})
	}
	}, [isPlaying])

	if(roomId === null){
		return <p>{storedId}</p>;
	} else {
	return <p>{roomId}</p>
	}
}

export default Lobby;

// Lobby.propTypes = {
// }
