# Socketon

## Project Overview
Socketon (v1.8.28) is a WhatsApp API modification library built on top of Baileys. It provides a high-level interface for interacting with the WhatsApp Web protocol, enabling developers to build bots, automations, and messaging integrations.

## Tech Stack
- **Language**: TypeScript (source), JavaScript (compiled output in `lib/`)
- **Package Manager**: npm (originally yarn, but npm works fine)
- **Runtime**: Node.js 20, 21, 22, 23, 24 (>=20.0.0 <25)
- **Protocol**: WebSocket, Protocol Buffers, Signal Protocol (E2E encryption)

## Project Structure
- `lib/` - Compiled JavaScript library (main entry point)
- `docs/` - Static documentation website (HTML/CSS)
- `WAProto/` - Protobuf definitions and generated code
- `server.js` - Simple HTTP server that serves the docs on port 5000
- `package.json` - Dependencies and scripts

## Running the Project
The `Start application` workflow runs `node server.js` which serves the documentation site on port 5000.

## Key Scripts
- `npm run build:tsc` - Compile TypeScript source
- `npm run build:docs` - Generate API docs with typedoc
- `npm test` - Run jest tests

## Key Library Files
- `lib/Socket/socket.js` - Core WebSocket connection, keepAlive, stream error handling
- `lib/Socket/ibranihbossenggoldong.js` - Interactive messages, buttons, albums, events
- `lib/Socket/messages-recv.js` - Incoming message handling
- `lib/Socket/messages-send.js` - Outgoing message handling
- `lib/Utils/use-multi-file-auth-state.js` - Session persistence with atomic writes + backup
- `lib/Defaults/index.js` - Default connection config

## Owner / Config
- **Owner**: 𝗪𝗶𝗹𝘆 𝗞𝘂𝗻 | WhatsApp: 6289688206739
- **Bot Name**: 𝗔𝘀𝗵𝗶 𝗕𝗼𝘁
- **Sticker Pack**: global.stickpack = '𝗔𝘀𝗵𝗶 𝗕𝗼𝘁' | global.stickauth = 'By ©𝗪𝗶𝗹𝘆'

## New Features Added (from Baileys)
- `sendPollMessage(jid, name, values, selectableCount, options)` - Added to messages-send.js: sends a WhatsApp poll message
- `editMessage(jid, message, newText)` - Added to messages-send.js: edits an already-sent message via protocolMessage type 14

## Recent Improvements (v1.8.28)
### Anti Bad Session
- `connection.update` now emits `isBadSession: true` when WhatsApp signals 401/403
- Clearer separation between fatal errors (loggedOut/forbidden) vs recoverable ones
- Session creds backup: auto-saves `creds.json.bak` before every write

### Anti Connection Closing
- keepAlive now tolerates slow networks: waits for 3 missed pings before disconnecting
- `connectTimeoutMs` increased to 30s for better handling on slow connections
- Decryption errors now trigger prekey re-upload instead of crashing

### Session Protection (useMultiFileAuthState)
- Atomic writes: files are written to `.tmp` first, then atomically renamed
- Backup: `creds.json.bak` is kept as fallback if `creds.json` gets corrupted
- JSON validation: corrupt files fall back to backup automatically

### Better Buttons
- `_normalizeButtons()` auto-converts simple `{id, title}` format to proper native flow format
- Supports `cta_url`, `cta_copy`, `cta_call`, `quick_reply` button types auto-detection
- Media upload errors in interactive messages are caught gracefully (message sends without media)

### Stability
- `isRestartRequired: true` flag emitted in `connection.update` for 515 restartRequired
- Message handling errors now always ACK the node to prevent re-delivery loops

### Protocol & Compatibility Updates (yemo-dev/baileys parity)
- **WA version**: bumped to `[2, 3000, 1037652651]` (latest)
- **DICT_VERSION**: upgraded from 2 → 3 (NOISE_WA_HEADER `[57 41 06 03]`)
- **ADV signature prefixes**: exported as named constants (`WA_ADV_ACCOUNT_SIG_PREFIX`, `WA_ADV_DEVICE_SIG_PREFIX`, `WA_ADV_HOSTED_ACCOUNT_SIG_PREFIX`, `WA_ADV_HOSTED_DEVICE_SIG_PREFIX`) — used in pairing flow
- **MCC helpers**: `getMccForCountryIso2(iso2)` and `getMccForPhoneNumber(phone, iso2)` — proper MCC in UserAgent header using `libphonenumber-js`
- **`getUserAgent` in validate-connection**: now resolves correct MCC per country (e.g. ID→510, US→310) instead of hardcoded '000'
- **PROCESSABLE_HISTORY_TYPES**: added `NON_BLOCKING_DATA` and `INITIAL_STATUS_V3`
- **MEDIA_PATH_MAP**: added `biz-cover-photo` → `/pps/biz-cover-photo`
- **New connection config options**: `albumMessageItemDelayMs`, `enableAutoSessionRecreation`, `enableRecentMessageCache`, `forceNewsletterMedia`, `defaultMessageAi`, `mcc`
- **Call prefixes**: `CALL_VIDEO_PREFIX`, `CALL_AUDIO_PREFIX`
- **Newsletter defaults**: `DEFAULT_NEWSLETTER_JID`, `DEFAULT_NEWSLETTER_NAME`, `DEFAULT_NEWSLETTER_ANNOTATION`, etc.
