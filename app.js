(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const messages = $("messages");
  const form = $("chatForm");
  const input = $("commandInput");
  const micBtn = $("micBtn");
  const micLabel = $("micLabel");
  const speakToggle = $("speakToggle");
  const statusText = $("statusText");
  const statusDot = $("statusDot");
  const core = $("core");
  const coreState = $("coreState");
  const hint = $("hint");

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = null;
  let listening = false;

  function setStatus(status, busy = false) {
    statusText.textContent = status;
    coreState.textContent = status;
    statusDot.classList.toggle("busy", busy);
  }

  function addMessage(who, text) {
    const item = document.createElement("div");
    item.className = `message ${who}`;
    const tag = document.createElement("div");
    tag.className = "message-tag";
    tag.textContent = who === "user" ? "YOU" : "JARVIS";
    const p = document.createElement("p");
    // Use textContent, never innerHTML, so typed input cannot inject HTML.
    p.textContent = text;
    item.append(tag, p);
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
  }

  function speak(text) {
    if (!speakToggle.checked || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.96;
    utterance.pitch = 0.88;
    utterance.onstart = () => setStatus("SPEAKING", true);
    utterance.onend = () => setStatus(listening ? "LISTENING" : "STANDBY", listening);
    window.speechSynthesis.speak(utterance);
  }

  function getReply(raw) {
    const command = raw.trim().toLowerCase();
    if (!command) return "Please enter a command, Sir.";
    if (/\b(hello|hi|hey)\b/.test(command)) {
      return "Hello, Sir. I am online in local prototype mode. How may I assist you?";
    }
    if (command.includes("help") || command.includes("commands")) {
      return "Available commands: hello, time, date, status, and clear. This starter uses simple local rules, not a generative AI model.";
    }
    if (command.includes("time")) {
      return `The local time on this device is ${new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(new Date())}, Sir.`;
    }
    if (command.includes("date") || command.includes("day")) {
      return `Today is ${new Intl.DateTimeFormat(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" }).format(new Date())}, Sir.`;
    }
    if (command.includes("status") || command.includes("system")) {
      return "Interface online. Local command engine ready. No API key is stored here. Voice input depends on browser support and permissions.";
    }
    if (command.includes("who are you") || command.includes("your name")) {
      return "I am JARVIS, your personal assistant interface. This starter is a safe foundation, not yet connected to an online AI brain.";
    }
    if (command.includes("thank")) {
      return "You're welcome, Sir.";
    }
    return "I received your command, Sir, but this free prototype only understands a few built-in commands. Say or type “help” to see them.";
  }

  function handleCommand(text) {
    if (!text.trim()) return;
    addMessage("user", text);
    setStatus("THINKING", true);
    const reply = getReply(text);
    window.setTimeout(() => {
      addMessage("assistant", reply);
      setStatus(listening ? "LISTENING" : "STANDBY", listening);
      speak(reply);
    }, 220);
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = input.value;
    input.value = "";
    handleCommand(value);
  });

  $("clearBtn").addEventListener("click", () => {
    messages.replaceChildren();
    addMessage("assistant", "Console cleared, Sir. Ready for your next command.");
    window.speechSynthesis?.cancel();
    setStatus("STANDBY");
  });

  if (!SpeechRecognition) {
    micBtn.disabled = true;
    micBtn.style.opacity = "0.55";
    micLabel.textContent = "VOICE INPUT UNSUPPORTED";
    hint.textContent = "This browser does not expose speech recognition. Text commands and spoken replies may still work. Try a current version of Chrome on Android.";
  } else {
    recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
      listening = true;
      core.classList.add("listening");
      micLabel.textContent = "LISTENING… TAP TO STOP";
      setStatus("LISTENING", true);
      hint.textContent = "Listening now. Speak clearly, then wait for the transcript.";
    };
    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || "";
      input.value = transcript;
      handleCommand(transcript);
    };
    recognition.onerror = (event) => {
      hint.textContent = event.error === "not-allowed"
        ? "Microphone permission was blocked. Allow microphone access in your browser settings, then reload."
        : `Voice input issue: ${event.error}. You can still type commands.`;
    };
    recognition.onend = () => {
      listening = false;
      core.classList.remove("listening");
      micLabel.textContent = "START VOICE INPUT";
      setStatus("STANDBY");
    };

    micBtn.addEventListener("click", () => {
      if (listening) recognition.stop();
      else {
        try { recognition.start(); }
        catch (_) { hint.textContent = "Voice input is busy. Wait a moment and try again."; }
      }
    });
  }
})();
