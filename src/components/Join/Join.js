import React, {Component} from 'react';
import "./Join.scss";
import { NavLink } from "react-router-dom";
// import PropTypes from 'prop-types';

class Join extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomId : "",
      id : Date.now
    };
  };

  componentDidUpdate() {
		// Check that the player is connected to a channel
		if (this.props.isPlaying === true) {
			this.props.history.push("/game");
		}
	}

  handleChange = (e) => {
      const {name, value} = e.target;
      this.setState({[name] : value});
  };

  resetState = () => {
    this.setState({
      roomId : ""
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.joinRoom(this.state.roomId)
    this.resetState();
  }

  render(){
    const {roomId} = this.state;
    return(
      <section className="App-header">
        <form aria-label="join-room" className="code-input" onSubmit = {this.handleSubmit}>
          <input
            type="text"
            name="roomId"
            value={roomId}
            placeholder="Insert Room Code"
            onChange = {this.handleChange}
          />
          <button>Submit</button>
          <NavLink
							to={"/"}
							className="back"
							style={{ textDecoration: "none" }}
						>
							Back
						</NavLink>
        </form>
      </section>
    )
  }
}

export default Join

// Join.propTypes = {
// }