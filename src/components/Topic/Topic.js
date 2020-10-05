import React from "react";
import "./Topic.scss";
// import { Link } from 'react-router-dom'
// import PropTypes from 'prop-types'
import useTopics from "/Users/cwefso/projects/debatable-practice/src/hooks/useTopics.js";

function Topic() {
	const topics = useTopics();

	const displayedTopic = topics.map((topic) => (
		<section className="topic" key={topic.key}>
			<div className="topic-img">
				<img src={topic.image} alt="image" />
			</div>
			<h3>{topic.name}</h3>
		</section>
	));

	console.log(topics);
	return <section>{displayedTopic[0]}</section>;
}

export default Topic;

// Topic.propTypes = {
// }
