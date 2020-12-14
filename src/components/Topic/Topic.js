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
	const [topics, setTopics] = useState([]);
	const [stage, setStage] =  useState(0);

	const loadTopic = () => {
		if (props.peice !== "J") {
			fetch("http://localhost:8000/api/v1/topic")
				.then((res) => res.json())
				.then((result) => setTopic(result.topic))
				.catch((err) => console.log(err.message));
		}
		return;
	};

	const setGameStage = () => {
		setStage(stage + 1)
	}

	const setBothTopics = () => {
		fetch("http://localhost:8000/api/v1/players")
			.then((res) => res.json())
			.then((result) => setTopics(result.players))
			.catch((err) => console.log(err.message));
	};

	const judges = props.population <= 2 ? 0 : props.population - 2;

	const displayedTopics = topics.map(topic => {
		return (
		<section className="topic" key={topic.key}>
			<div className="topic-img">
				<img src={topic.image} alt="topic" />
			</div>
			<h3>{topic.name}</h3>
			<button onClick={() => setGameStage()}>click me</button>
		</section>
		)
	});


		return (
			<section className="topic-holder">
				{/* <p>Number of judges: {judges}</p> */}
				{displayedTopics}
			</section>
		);
	
}

export default Topic;

// Topic.propTypes = {
// }
