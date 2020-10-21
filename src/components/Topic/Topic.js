import React, { useState, useEffect } from "react";
import "./Topic.scss";
// import { Link } from 'react-router-dom'
// import PropTypes from 'prop-types'
function Topic(props) {
	useEffect(() => {
		loadTopic();
		const timer = setTimeout(() => {
			setBothTopics();
		}, 1000);
		return () => {
			// clearTopics()
			clearTimeout(timer);
		};
	}, []);

	const [topic, setTopic] = useState({});
	const [players, setPlayers] = useState({});

	const loadTopic = () => {
		if (props.peice !== "J") {
			fetch("http://localhost:8000/api/v1/topic")
				.then((res) => res.json())
				.then((result) => setTopic(result.topic))
				.catch((err) => console.log(err.message));
		}
		return;
	};

	const setBothTopics = () => {
		fetch("http://localhost:8000/api/v1/players")
			.then((res) => res.json())
			.then((result) => setPlayers(result.players))
			.catch((err) => console.log(err.message));
	};

	const judges = props.population <= 2 ? 0 : props.population - 2;

	const displayedTopic = (
		<section className="topic" key={topic.key}>
			<div className="topic-img">
				<img src={topic.image} alt="topic" />
			</div>
			<h3>{topic.name}</h3>
		</section>
	);

	if (props.piece === "J") {
		return (
			<section>
				<p>Judge View</p>
				<p>{judges}</p>
			</section>
		);
	} else {
		return (
			<section>
				<p>Number of judges: {judges}</p>
				{displayedTopic}
			</section>
		);
	}
}

export default Topic;

// Topic.propTypes = {
// }
