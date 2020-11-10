import React, { useState, useEffect } from "react";
import "./Roster.scss";

const Roster = ({ players, setPlayers }) => {

	const getPlayers = () => {
		//fetch from microservice for players,
		fetch("http://localhost:8000/api/v1/lobby")
			.then((res) => res.json())
			.then((result) => setPlayers(result.lobby))
			.then(console.log(players))
			.catch((err) => console.log(err.message));
		//set players
  };
  
  useEffect(() => {
    getPlayers()
	}, []);

	useEffect(() => {
		var handle = setInterval(getPlayers, 3000);
		return () => {
			clearInterval(handle);
		};
  });
  
  let roomView

  if(players.length > 0){
    console.log("players", players)
    roomView = players.map((player) => {
      return (
        <section>
          <p>{player.name}</p>
        </section>
      );
    });
  } else {
      return (
        <section>
          <p>loading...</p>
        </section>
      );
  }

	return (
    <section>
      {!players
        && (
        <section className="wrapper">
          <h3>Loading</h3>
        </section>
        )}
        {(
          <section className="wrapper">
            {roomView}
        </section>
        )}
    </section>
	)
};

export default Roster;
