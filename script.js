const publishButton = document.getElementById("publishButton");
const messageInput = document.getElementById("messageInput");
const messageList = document.getElementById("messageList");

const fetchMessages = async () => {
  try {
    const response = await fetch("http://localhost:3000/subscribe");
    const data = await response.json();

    if (response.ok) {
      messageList.innerHTML = data.messages;
    } else {
      console.error("Failed to fetch messages:", data.error);
    }
  } catch (error) {
    console.error("Failed to fetch messages:", error);
  }
};

publishButton.addEventListener("click", async () => {
  const message = messageInput.value;

  try {
    await fetch('http://localhost:3000/publish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: message }),
    });
  } catch (error) {
    console.error("Failed to publish message:", error);
  }
});

fetchMessages();