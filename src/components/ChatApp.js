import React, { useState, useEffect } from "react";
import Scaledrone from "scaledrone-react";
import MessageList from "./Messages";
import MessageForm from "./Input";

const ChatApp = () => {
  const [drone, setDrone] = useState(null);
  const [messages, setMessages] = useState([]);
  const [color, setColor] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    const drone = new Scaledrone(process.env.REACT_APP_SCALED_DRONE_CHANNEL_ID);
    drone.on("open", (error) => {
      if (error) {
        console.error(error);
      } else {
        setDrone(drone);
      }
    });

    return () => {
      drone.close();
    };
  }, []);

  const handleSendMessage = (message) => {
    drone.publish({
      room: "observable-room",
      message: {
        text: message,
        author: { name, color },
      },
    });
  };

  useEffect(() => {
    if (!drone) return;

    drone.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message.data]);
    });
  }, [drone]);

  const handleColorChange = (event) => {
    setColor(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  return (
    <div>
      <label>Ime:</label>
      <input type="text" value={name} onChange={handleNameChange} />
      <label>Boja:</label>
      <input type="color" value={color} onChange={handleColorChange} />
      <MessageList messages={messages} />
      <MessageForm onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatApp;
