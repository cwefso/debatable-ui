import React, { Component } from "react";
import "./App.scss";
import { Switch, Route, withRouter, NavLink } from "react-router-dom";
import Topic from '../Topic/Topic'
import Lobby from '../Lobby/Lobby'
import PubNubReact from 'pubnub-react';
import shortid from 'shortid';


class App extends Component { 
	constructor(props) {  
    super(props);
    this.pubnub = new PubNubReact({
      publishKey: "pub-c-7b46f3ec-deeb-4817-9e4d-146bbdd69733", 
      subscribeKey: "sub-c-c9d2f832-01a4-11eb-88da-261b8c980873"    
    });
    
    this.state = {
      player: 0,
      isPlaying: false,
      isRoomCreator: false,
      isDisabled: false,
      myTurn: false,
    };

    this.lobbyChannel = null;
    this.gameChannel = null;
    this.roomId = null;    
    this.pubnub.init(this);
  }

	componentWillUnmount() {
    this.pubnub.unsubscribe({
      channels : [this.lobbyChannel, this.gameChannel]
    });
	}
	
	onPressCreate = (e) => {
    // Create a random name for the channel
    this.roomId = shortid.generate().substring(0,5);
    this.lobbyChannel = 'tictactoelobby--' + this.roomId;

    this.pubnub.subscribe({
      channels: [this.lobbyChannel],
      withPresence: true
    });

    this.setState({
      player: 1,
      isRoomCreator: true,
      isDisabled: true, // Disable the 'Create' button
      myTurn: true, // Room creator makes the 1st move
    });   
	}
	
	  // Reset everything
  endGame = () => {
    this.setState({
      piece: '',
      isPlaying: false,
      isRoomCreator: false,
      isDisabled: false,
      myTurn: false,
    });

    this.lobbyChannel = null;
    this.gameChannel = null;
    this.roomId = null;  

    this.pubnub.unsubscribe({
      channels : [this.lobbyChannel, this.gameChannel]
    });
  }

	render(){
	const mainPage = (
		<div className="App">
			<header className="App-header">
				<div role="logo" className="logo">
					debatable
				</div>
				<section className="buttons">
					<NavLink
						to={"/lobby"}
						className="create"
						style={{ textDecoration: "none" }}
						onClick={(e) => this.onPressCreate()}
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
			<Route exact path="/lobby" render={() => <Lobby />} />
			
		</Switch>
	);
		}
}

export default withRouter(App);
