# gRPC / protobuf API
This is an basic API to work with **DICE**'s Portal-Server (`Battlefield 6`).

**NPM** [battlefield6-api](https://www.npmjs.com/package/battlefield6-api)

## Configuration
Before you start, set the current `sessionId` at the configuration, otherwise you will get an **Exception**:
> **SessionException [Error]:** The request does not have valid authentication credentials for the operation.
```ts
Configuration.setSession('web-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
```

## Installation
> WinGet install Google.Protobuf

> npm install

## Building
> npm run proto:generate
