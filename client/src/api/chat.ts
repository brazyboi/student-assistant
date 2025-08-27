export async function sendMessage(message: string) {
  try {
    const res = await fetch("http://localhost:3000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    if (!res.ok) {
      throw new Error(`Server error: ${res.status}`);
    }

    const data = await res.json();
    console.log("Received reply from backend:", data.reply);
    return data.reply as string;
  } catch (err) {
    console.error("Error calling backend:", err);
    return "";
  }
}