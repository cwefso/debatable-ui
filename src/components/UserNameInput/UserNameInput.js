import React, { useState, useEffect } from "react";
import "./UserNameInput.scss";
import shortid from "shortid";


const UserNameInput = ({
  pubnub,
  lobbyChannel,
  players,
  setPlayers
}) => {

  const userId = shortid()

  const [self, setSelf] = useState({
		name: "",
		id: userId,
  });
  
	const [name, setName] = useState("")

	const handleSubmit = (e) => {
		e.preventDefault();

		// let otherPlayers = players.filter(player => player.id !== self.id)
		pubnub.publish({
			message: {
				players: [...players, self],
			},
			channel: lobbyChannel,
		});

		// setPlayers([...players, self]);
		setName(self.name)
		setSelf({
			name: "",
			id: userId
		});

	};


  return (
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
}

export default UserNameInput;