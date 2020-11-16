import React, { Component } from "react";
import "./App.scss";
import { Switch, Route, withRouter, NavLink } from "react-router-dom";
import Topic from "../Topic/Topic";
import Lobby from "../Lobby/Lobby";
import Join from "../Join/Join";
import Game from "../Game/Game";
import PubNubReact from "pubnub-react";
import shortid from "shortid";

require("dotenv").config({
  path: `.env`,
});

const publish = process.env.REACT_APP_API_KEY_PUB;
const subscribe = process.env.REACT_APP_API_KEY_SUB;


class App extends Component {
	constructor(props) {
		super(props);
		this.pubnub = new PubNubReact({
			publishKey: "pub-c-7b46f3ec-deeb-4817-9e4d-146bbdd69733",
			subscribeKey: "sub-c-c9d2f832-01a4-11eb-88da-261b8c980873",
		});

		this.state = {
			piece: "",
			isPlaying: false,
			isRoomCreator: false,
			isDisabled: false,
			myTurn: false,
			userName: ""
		};

		this.lobbyChannel = null;
		this.gameChannel = null;
		this.roomId = null;
		this.pubnub.init(this);
	}

	componentWillUnmount() {
		this.pubnub.unsubscribe({
			channels: [this.lobbyChannel, this.gameChannel],
		});
	}

	componentDidUpdate() {
		// Check that the player is connected to a channel
		if (this.lobbyChannel != null) {
			this.pubnub.getMessage(this.lobbyChannel, (msg) => {
				// Start the game once an opponent joins the channel
				if (msg.message.gameReady) {
					// Create a different channel for the game
					this.gameChannel = "debatablegame--" + this.roomId;

					this.pubnub.subscribe({
						channels: [this.gameChannel],
					});

						this.setState({
							isPlaying: true,
						});
						this.props.history.push('/game')
				}
			});
		}	
	}

	setPlaying = () => {
		this.pubnub
			.hereNow({
				channels: [this.lobbyChannel],
			})
			.then((response) => {
				console.log(response.totalOccupancy);
				if (response.totalOccupancy >= 2) {
					this.pubnub.publish({
						message: {
							gameReady: true,
						},
						channel: this.lobbyChannel,
					});
				}
			});
	};

	onPressCreate = (e) => {
		// Create a random name for the channel
		this.roomId = shortid.generate().substring(0, 5);
		localStorage.setItem("roomId", this.roomId);
		this.lobbyChannel = "debatablelobby--" + this.roomId;

		this.pubnub.subscribe({
			channels: [this.lobbyChannel],
			withPresence: true,
		});

		this.setState({
			piece: "X",
			isRoomCreator: true,
			isDisabled: true, // Disable the 'Create' button
			myTurn: true, // Room creator makes the 1st move
		});
	};

	joinRoom = (value) => {
		this.roomId = value;
		this.lobbyChannel = "debatablelobby--" + this.roomId;

		// Check the number of people in the channel
		// if it's less than 2, piece is "O"
		this.pubnub
		.hereNow({
			channels: [this.lobbyChannel],
		})
		.then((response) => {
			if(response.totalOccupancy < 2){
			this.pubnub.subscribe({
				channels: [this.lobbyChannel],
				withPresence: true,
			});

			this.setState({
				piece: "O",
			});

			this.pubnub.publish({
				message: {
					notRoomCreator: true,
				},
				channel: this.lobbyChannel,
			});
			this.props.history.push('/lobby')
			}
			else{
			// if it's more than 2, piece is "J"
				this.pubnub.subscribe({
					channels: [this.lobbyChannel],
					withPresence: true,
				});

				this.setState({
					piece: "J",
					isPlaying: true
				});

				this.pubnub.publish({
					message: {
						notRoomCreator: true,
					},
					channel: this.lobbyChannel,
				});
			}
			this.props.history.push('/lobby')
		})
		.catch((error) => {
			console.log(error);
		});
};

	// Reset everything
	endGame = () => {
		this.setState({
			piece: "",
			isPlaying: false,
			isRoomCreator: false,
			isDisabled: false,
			myTurn: false,
		});

		this.lobbyChannel = null;
		this.gameChannel = null;
		this.roomId = null;

		this.pubnub.unsubscribe({
			channels: [this.lobbyChannel, this.gameChannel],
		});
	};

	render() {
		const mainPage = (
			<section className="App">
				<header className="App-header">
					<section role="logo" className="logo">
						debatable
					</section>
					<section className="buttons">
						<NavLink
							to={"/lobby"}
							className="create"
							style={{ textDecoration: "none" }}
							onClick={(e) => this.onPressCreate()}
						>
							Create
						</NavLink>
						<NavLink
							to={"/join"}
							className="join"
							style={{ textDecoration: "none" }}
						>
							Join
						</NavLink>
					</section>
				</header>
			</section>
		);
		return (
			<Switch>
				<Route exact path="/" render={() => <section>{mainPage}</section>} />
				<Route exact path="/topics" render={(props) => <Topic {...props}/>} />
				<Route
					exact
					path="/lobby"
					render={(props) => <Lobby {...props} roomId={this.roomId} 							
					pubnub={this.pubnub}
					gameChannel={this.gameChannel}
					piece={this.state.piece}
					isRoomCreator={this.state.isRoomCreator}
					myTurn={this.state.myTurn}
					xUsername={this.state.xUsername}
					oUsername={this.state.oUsername}
					endGame={this.endGame}
					isPlaying={this.state.isPlaying}
					lobbyChannel={this.lobbyChannel}
					setPlaying={this.setPlaying}
					/>}
				/>
				<Route
					exact
					path="/join"
					render={(props) => <Join {...props} roomId={this.roomId} joinRoom={this.joinRoom} 							pubnub={this.pubnub}
					gameChannel={this.gameChannel}
					piece={this.state.piece}
					isRoomCreator={this.state.isRoomCreator}
					myTurn={this.state.myTurn}
					xUsername={this.state.xUsername}
					oUsername={this.state.oUsername}
					endGame={this.endGame}
					isPlaying={this.state.isPlaying}
					/>}
				/>
				<Route
					exact
					path="/game"
					render={(props) => (
						<Game
						{...props}
            pubnub={this.pubnub}
            lobbyChannel={this.lobbyChannel}
						gameChannel={this.gameChannel}
						piece={this.state.piece}
						isRoomCreator={this.state.isRoomCreator}
						myTurn={this.state.myTurn}
						xUsername={this.state.xUsername}
						oUsername={this.state.oUsername}
						endGame={this.endGame}
					/>
					)}
				/>
			</Switch>
		);
	}
}

export default withRouter(App);
