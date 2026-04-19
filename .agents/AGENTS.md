# Agent Instructions for Socketon

## Purpose
This repository contains Socketon, a WhatsApp Web API modification library based on Baileys. It is used for WhatsApp bots, messaging automation, protocol handling, and session management.

## Project Summary
- Package name: `socketon`
- Version: `1.8.28`
- Runtime: Node.js `>=20.0.0 <25`
- Main entry: `lib/index.js`
- Type definitions: `lib/index.d.ts`
- Documentation server: `server.js`
- Documentation site: `docs/`

## Important Directories
- `lib/` contains the compiled JavaScript library and is the main code used by consumers.
- `WAProto/` contains WhatsApp protobuf definitions and generated protocol code.
- `docs/` contains the static documentation website.
- `.github/workflows/` contains GitHub workflow configuration.
- `attached_assets/` contains uploaded images, screenshots, and supporting assets.

## Key Files
- `package.json` defines package metadata, dependencies, scripts, engines, and published files.
- `server.js` serves the documentation website on port `5000`.
- `engine-requirements.js` validates supported Node.js versions before install.
- `lib/Socket/socket.js` handles the core WhatsApp socket connection.
- `lib/Socket/messages-send.js` handles outgoing message sending features.
- `lib/Socket/messages-recv.js` handles incoming message processing.
- `lib/Utils/use-multi-file-auth-state.js` handles multi-file session storage.
- `lib/Defaults/index.js` contains default socket and protocol configuration.

## Run Commands
- Start docs server: `node server.js`
- Build TypeScript: `npm run build:tsc`
- Build docs: `npm run build:docs`
- Generate protobuf statics: `npm run gen:protobuf`
- Run tests: `npm test`

## Editing Rules
- Do not upload or commit `node_modules/`.
- Do not upload or commit `package-lock.json` unless explicitly requested.
- Keep `.gitignore` protecting generated dependencies and local artifacts.
- Prefer minimal edits focused on the requested behavior.
- When changing runtime behavior, update both `.js` and matching `.d.ts` files when public APIs/types change.
- Preserve existing package metadata, author fields, public API names, and published file layout unless explicitly asked.
- Avoid removing compatibility helpers unless their callers are also updated.

## WhatsApp/Baileys Areas to Be Careful With
- Connection lifecycle changes belong around `lib/Socket/socket.js` and related socket modules.
- Message send changes belong around `lib/Socket/messages-send.js`.
- Message receive or ACK behavior belongs around `lib/Socket/messages-recv.js`.
- Session persistence changes belong around `lib/Utils/use-multi-file-auth-state.js`.
- Protocol version/default changes belong around `lib/Defaults/index.js` and related default files.
- Protobuf changes should be made through `WAProto/WAProto.proto` and regenerated when needed.

## Current Project Notes
- The docs server is expected to run on port `5000`.
- This repository has already been uploaded to GitHub branch `main`.
- The intended GitHub repository is `https://github.com/mikuyama/mikuyama-bailyes.git`.
- The previous upload intentionally excluded `node_modules/` and `package-lock.json`.

## Quality Expectations
- Keep commits accurate and descriptive.
- Make sure file changes are visible per file in GitHub commits.
- Do not silently hide failures; surface errors clearly.
- Keep the project usable as both a library package and a documentation preview project.
