import readline from "readline"

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "> ",
})

console.clear()
rl.prompt()

rl.on("line", async (input) => {
  const clearInput = input.trim().toLowerCase()
  if (clearInput === "exit") {
    console.log("Goodbye!")
    rl.close()
  } else if (clearInput === "clear" || clearInput === "c") {
    console.clear()
  } else if (clearInput === "history" || clearInput === "h") {
    const res = await getChatHistory()
    clearLine()
    console.log(res)
  } else if (clearInput === 'cc') {
    const res = await clearChatHistory()
    clearLine()
    console.log(res)
  } else {
    console.log("Thinking...")
    const res = await sendTextToApi("http://localhost:8787/webhook", input)
    clearLine()
    console.log(res)
    rl.prompt()
  }
})

rl.on("close", () => {
  console.log("Chat interface closed.")
  process.exit(0)
})

function clearLine() {
  readline.cursorTo(process.stdout, 0)
  readline.clearLine(process.stdout, 0)
}

async function sendTextToApi(apiUrl, text) {
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: {
          message_id: 123456,
          chat: {
            id: "abc123",
          },
          text,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error sending text to API:", error)
  }
}

async function getChatHistory() {
  try {
    const response = await fetch("http://localhost:8787/history", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error while get chat history:", error)
  }
}

async function clearChatHistory() {
  try {
    const response = await fetch("http://localhost:8787/history", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error while delete chat history:", error)
  }
}
