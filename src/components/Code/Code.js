import React, { useState, useEffect } from "react";
import "./Code.scss";


const Code = ({
	roomId
}) => {
  return (
      <section className="code-holder">
        <h2>Room Code</h2>
        <section className="id">{roomId}</section>
      </section>
  );
}

export default Code;