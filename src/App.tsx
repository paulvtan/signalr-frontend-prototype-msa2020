import React, { useState, useEffect } from "react";
import {
  JsonHubProtocol,
  HubConnectionState,
  HubConnectionBuilder,
  LogLevel,
  HubConnection,
} from "@microsoft/signalr";
import "./App.css";

function App() {
  const [number, setNumber] = useState(Math.round(Math.random() * 10));
  const connection = new HubConnectionBuilder()
    .withUrl("https://signalr-backend-prototype-msa2020.azurewebsites.net/hub")
    .configureLogging(LogLevel.Information)
    .build();
  const [hubConnection, setHubConnection] = useState<HubConnection>(connection);

  function handleClick() {
    const newNumber = getRandomInt(1000);
    hubConnection.invoke("BroadcastNumber", newNumber);
  }

  function getRandomInt(max: any) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  useEffect(() => {
    hubConnection.on("ReceiveMessage", (user, message) => {
      console.log(user + " " + message);
    });

    hubConnection.on("ShowUserCounts", (usersCount: any) => {
      console.log(usersCount);
    });

    hubConnection.on("UpdateNumber", (num: any) => {
      console.log("Live: " + num);
      setNumber(num);
    });

    hubConnection.start().catch(function (e) {});
  }, []);
  return (
    <>
      <div>
        <NumberDisplay num={number} />
        <button className="button-center" onClick={handleClick}>
          Click me!
        </button>
      </div>
    </>
  );
}

function NumberDisplay(props: any) {
  return <p className="number-center">{props.num}</p>;
}

export default App;
