import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
// import { Link } from 'react-router-dom'
// import PropTypes from 'prop-types'
import "./Lobby.scss";
import shortid from "shortid";

const Lobby = ({
	gameChannel,
	roomId,
	isPlaying,
	lobbyChannel,
	pubnub,
	setPlaying,
	piece,
}) => {
	const history = useHistory();

	const storedId = localStorage.getItem("roomId");

	const [self, setSelf] = useState({
		name: "",
		id: shortid(),
	});
	const [players, setPlayers] = useState([]);
	const [name, setName] = useState("")

	const handleSubmit = (e) => {
		e.preventDefault();

		let otherPlayers = players.filter(player => player.id !== self.id)

		pubnub.publish({
			message: {
				players: [...players, self],
			},
			channel: lobbyChannel,
		});

		// setName(self.name)
		// setSelf({
		// 	name: "",
		// 	id: userId
		// });
	};

	useEffect(() => {
		if (lobbyChannel != null) {
			pubnub.getMessage(lobbyChannel, (msg) => {
				setPlayers(msg.message.players)
				console.log("players")
				// Start the game once isReady is true
				if (msg.message.isReady) {
					// Create a different channel for the game
					gameChannel = "debatablegame--" + roomId;

					pubnub.subscribe({
						channels: [gameChannel],
					});

					isPlaying = true;
					history.push("/game");
				}

				// Start the game once an opponent joins the channel
			});
		}
	});

	const userId = shortid();

	const main = (
		<section>
			<form className="userNameInput" onSubmit={handleSubmit}>
				<label>Player Name</label>
				<input
					type="text"
					value={self.name}
					onChange={(e) => {
						setSelf({
							name: e.target.value,
							id: userId
						});
					}}
				/>
				<button>Submit</button>
			</form>
			<section className="start-buttons">
				<button className="start-button"> Start</button>
			</section>
		</section>
	);

	if (roomId === null) {
		return (
			<section className="App-header">
				<section className="code-holder">
					<h2>Room Code</h2>
					<section className="id">{storedId}</section>
				</section>
				{main}
			</section>
		);
	} else {
		return (
			<section className="App-header">
				<section className="code-holder">
					<h2>Room Code</h2>
					<section className="id">{roomId}</section>
				</section>
				{main}
			</section>
		);
	}
};

export default Lobby;

// Lobby.propTypes = {
// }
