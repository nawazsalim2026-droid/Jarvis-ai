# J.A.R.V.I.S. Starter — Free local prototype

A beginner-friendly Iron Man-inspired assistant interface for Android browsers.

## What this version does
- Futuristic responsive HUD
- Text commands
- Browser speech recognition where supported
- Spoken replies using browser speech synthesis
- Local commands: `help`, `time`, `date`, `status`, `hello`
- No API key, server, account, or paid AI service required

## What it does NOT do yet
- It is not a generative AI assistant and does not understand arbitrary questions.
- Speech recognition support varies by browser and may use a browser provider's speech service.
- It does not control Android settings, send messages, or run background commands.
- It is not a native Android app.

## Run it on an Android phone (beginner route)
1. Download and extract the ZIP.
2. Upload `index.html`, `style.css`, and `app.js` to a static website host that offers a free tier, or open the files in a suitable local HTML preview app.
3. For reliable microphone access, host it over HTTPS. Browsers often restrict microphone features on plain local files.
4. Open the hosted page in Chrome.
5. Tap **START VOICE INPUT** and allow microphone access.
6. Try `help`, `time`, `date`, or type a command.

A free hosting tier can change at any time and may require account creation. You do not need to enter payment details for the code itself.

## Security notes
- This starter contains no secrets or API keys.
- It uses `textContent` when displaying user input to reduce HTML injection risk.
- Do not paste API keys into `app.js`, `index.html`, or any public repository.
- Browser speech recognition can send audio to the browser/platform speech service. Review the browser's privacy terms before using sensitive speech.
- This page does not save chat history after reload.

## Next step: connect a real AI securely
A real AI brain usually requires an AI API or a model hosted elsewhere. API use is not guaranteed to be free. To connect one securely, use a backend server that stores the secret key in environment variables and sends only the response to the browser. Never expose the permanent secret key in client-side files. Do not add API calls until you have chosen a provider and checked its current pricing and free limits.
