import React, { useState, useEffect } from "react";
import "./UserNameInput.scss";
import shortid from "shortid";

const UserNameInput = () => {
	const [id, setId] = useState(shortid.generate().substring(0, 5));

	const [self, setSelf] = useState({
		name: "",
		id: id,
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		addToRoster();
	};

	const addToRoster = () => {
		const { name, id } = self;
		const check = (data) => data || "none";
		fetch("http://localhost:8000/api/v1/lobby", {
			method: "POST",
			headers: {
				"content-type": "application/json",
			},
			body: JSON.stringify({
				name: check(name),
				id: check(id),
			}),
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
							id: id,
						});
					}}
				/>
				<button>Submit</button>
			</form>
		</section>
	);
};

export default UserNameInput;
