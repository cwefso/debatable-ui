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


	const [players, setPlayers] = useState([]);
	const [id, setId] = useState(shortid.generate().substring(0, 5))

	const [self, setSelf] = useState({
		name: "",
		id: id,
	});

	const handleSubmit = (e) => {
		e.preventDefault();

		//post to microservice?
		addToRoster() 

		// pubnub.publish({
		// 	message: {
		// 		players: players,
		// 	},
		// 	channel: lobbyChannel,
		// });
	};

	const addToRoster = () => {
    const {
      name, id
    } = self

    const check = (data) => (data || 'none')

    fetch(
      'http://localhost:8000/api/v1/lobby', {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          name: check(name),
          id: check(id)
        })
      }
    )
  }

	const getPlayers = () => {
		//fetch from microservice for players,
      fetch('http://localhost:8000/api/v1/lobby')
        .then((res) => res.json())
				.then((result) => setPlayers(result))
				.then(console.log(players))
        .catch((err) => console.log(err.message))
		//set players
	}

	useEffect(()=>{
    var handle=setInterval(getPlayers, 3000);    

    return ()=>{
      clearInterval(handle);
    }
  });

	useEffect(() => {
		if (lobbyChannel != null) {
			pubnub.getMessage(lobbyChannel, (msg) => {
				// setPlayers(msg.message.players)
				// console.log("players")
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
	}, [isPlaying]);

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
							id: id
						});
					}}
				/>
				<button>Submit</button>
				<button onClick= {getPlayers}>Players</button>
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
