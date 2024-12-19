import user from "/img/user.png";
import bot from "/img/bot.png";

const responseContainer = document.getElementById("chat_container");
const generateBtn = document.getElementById("generateBtn");
const form = document.querySelector("form");

function chatStripe(isAi, value, uniqueId) {
  return `
    <div class="wrapper ${isAi ? "ai" : ""}">
      <div class="chat">
        <div class="profile">
          <img src="${isAi ? bot : user}" alt="${isAi ? "bot" : "user"}" />
        </div>
        <div class="message" id="${uniqueId}">${value}</div>
      </div>
    </div>
  `;
}

function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

async function handleGenerate(e) {
  e.preventDefault();
  const data = new FormData(form);
  const prompt = data.get("prompt");
  responseContainer.innerHTML += chatStripe(false, prompt);
  form.reset();

  const uniqueId = generateUniqueId();

  try {
    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDnzSDCC6lV_e9vSy3AYutr278tLD-uakE",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await res.json();
    const textContent =
      data.candidates[0]?.content?.parts[0]?.text || "No content available";

    responseContainer.scrollTop = responseContainer.scrollHeight;
    responseContainer.innerHTML += chatStripe(true, textContent, uniqueId);
  } catch (error) {
    console.error("Error:", error);
    responseContainer.innerHTML += chatStripe(
      true,
      "Error generating response",
      uniqueId
    );
  }
}

generateBtn.addEventListener("click", handleGenerate);
