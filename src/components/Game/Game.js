import React from "react";
import Topic from "../Topic/Topic";
// import Swal from "sweetalert2";
// import ReactCountdownClock from "react-countdown-clock";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			population: 0,
			gameState: 0
		};
	}

	componentDidUpdate() {
		this.props.pubnub
			.hereNow({
				channels: [this.props.lobbyChannel],
			})
			.then((response) => {
				this.setState({
					population: response.totalOccupancy
				})
			})

			this.props.pubnub.getMessage(this.props.lobbyChannel, (msg) => {
				// Start the game once an opponent joins the channel
				if (msg.message.gameState) {
					// Create a different channel for the game

					this.setState({
						gameState: msg.message.gameState,
					});
				}
			})
	}


	onMakeMove = () => {
			// Publish move to the channel
			this.props.pubnub.publish({
				message: {
          gameState: this.state.gameState + 1
				},
				channel: this.props.gameChannel,
			});
	}

	render() {
		// Change to current player's turn
				return (
					<div className="game">
							{/* <CountdownCircleTimer
								onComplete={() => {
									this.onMakeMove()
									return [true, 1000]
								}}
								isPlaying
								duration={.1}
								colors="#A30000"
							/> */}
							<Topic
								population={this.state.population} 
								// piece={this.props.piece} 
								// topics={this.state.topics}
							/>
					</div>
				)
			}
}

export default Game;
