// import { useState } from 'react'
// import './App.css'

// function App() {
  
// }

// export default App

import ChatInput from "./components/ChatInput";

function App() {
  const handleSend = (text: string) => {
    console.log("User submitted:", text);
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1 }} />
      <ChatInput onSend={handleSend} />
    </div>
  );
}

export default App;