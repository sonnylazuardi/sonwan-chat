import { useState } from "react";

const MessageInput = ({ onSubmit }) => {
  const [messageText, setMessageText] = useState("");

  const submitOnEnter = (event) => {
    // Watch for enter key
    if (event.keyCode === 13) {
      onSubmit(messageText);
      setMessageText("");
    }
  };

  return (
    <>
      <input
        className="focus:ring-1 dark:text-white focus:outline-none w-full text-sm bg-white dark:bg-dark-500 border-transparent-100 text-black placeholder-gray-500 border rounded-xl py-4 pr-10 pl-4"
        type="text"
        placeholder="Send a message"
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
        onKeyDown={(e) => submitOnEnter(e)}
      />
    </>
  );
};

export default MessageInput;
