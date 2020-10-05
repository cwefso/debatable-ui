import React, { useState, useEffect } from "react";
import "./App.scss";
import { Switch, Route, withRouter, NavLink } from "react-router-dom";
import Topic from '../Topic/Topic'


function App() {
	const mainPage = (
		<div className="App">
			<header className="App-header">
				<div role="logo" className="logo">
					debatable
				</div>
				<section className="buttons">
					<NavLink
						to={"/"}
						className="create"
						style={{ textDecoration: "none" }}
					>
						Create
					</NavLink>
					<NavLink to={"/"} className="join" style={{ textDecoration: "none" }}>
						Join
					</NavLink>
				</section>
			</header>
		</div>
	);
	return (
		<Switch>
			<Route exact path="/" render={() => 
				<div>
				{mainPage}
				</div>
			} />
			<Route exact path="/topics" render={() => <Topic />} />
		</Switch>
	);
}

export default withRouter(App);
