import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
// import { Link } from 'react-router-dom'
// import PropTypes from 'prop-types'
import "./Lobby.scss";

function Lobby({
	gameChannel,
	roomId,
	isPlaying,
	lobbyChannel,
	pubnub,
	setPlaying,
	piece,
}) {
	const history = useHistory();

	const storedId = localStorage.getItem("roomId");

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

					isPlaying = true;
					history.push("/game");
				}
			});
		}
	}, [isPlaying]);

	if (roomId === null) {
		return (
			<section className="App-header">
				<section className="code-holder">
					<h2>Share this code with your friends</h2>
					<section className="id">
						{storedId}
					</section>
					</section>
				<section className="start-buttons">
					<button className="start-button" onClick={(e) => setPlaying()}>
						{" "}
						Start
					</button>
				</section>
			</section>
		);
	} else {
		return (
			<section className="App-header">
				<section className="code-holder">
					<h2>Share this code with your friends</h2>
					<section className="id">
						{roomId}
					</section>
					</section>
				<section className="start-buttons">
					<button className="start-button" onClick={(e) => setPlaying()}>
						{" "}
						Start
					</button>
				</section>
			</section>
		);
	}
}

export default Lobby;

// Lobby.propTypes = {
// }
