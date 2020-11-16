import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
// import { Link } from 'react-router-dom'
// import PropTypes from 'prop-types'
import "./Lobby.scss";
import Code from "../Code/Code";
import UserNameInput from "../UserNameInput/UserNameInput";
import Roster from "../Roster/Roster";
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

	const [players, setPlayers] = useState([]);
	const [id, setId] = useState(shortid.generate().substring(0, 5));

	const [self, setSelf] = useState({
		name: "",
		id: id,
	});

	useEffect(() => {
		if (lobbyChannel != null) {
			pubnub.getMessage(lobbyChannel, (msg) => {
				// Start the game once isReady is true
				if (msg.message.isReady) {
					// Create a different channel for the game
					gameChannel = "debatablegame--" + roomId;

					pubnub.subscribe({
						channels: [gameChannel],
					});

					history.push("/game");
				}
			});
		}
	}, []);

	useEffect(() => {
		return () => {
			fetch("http://localhost:8000/api/v1/clear")
				.then((res) => res.json())
				.then((result) => setPlayers(result.lobby))
				.then(console.log("clear"))
				.catch((err) => console.log(err.message));
		};
	}, []);


	if (roomId === null) {
		return (
			<section className="App-header">
				<section className="lobby">
					<section className="code">
						<Code roomId={storedId} />
					</section>
					<section className="roster">
						<Roster players={players} setPlayers={setPlayers} />
					</section>
					<section className="name-input">
						<UserNameInput players={players} setPlayers={setPlayers} />
					</section>
					<section className="start-buttons">
						<button className="start-button" onClick={setPlaying}>
							Start
						</button>
					</section>
				</section>
			</section>
		);
	} else {
		return (
			<section className="App-header">
				<section className="lobby">
					<section className="code">
						<Code roomId={roomId} />
					</section>
					<section className="roster">
						<Roster players={players} setPlayers={setPlayers} />
					</section>
					<section className="name-input">
						<UserNameInput players={players} setPlayers={setPlayers} />
					</section>
					<section className="start-buttons">
						<button className="start-button" onClick={setPlaying}> Start</button>
					</section>
				</section>
			</section>
		);
	}
};

export default Lobby;

// Lobby.propTypes = {
// }
