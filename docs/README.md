# lib-concord-client


### install

```sh
npm install git+https://github.com/liber-organiza-cao/lib-concord-client
```

### example

```ts
import { defaultAutenticator, keygen } from "lib-concord-client/dist/autenticator";
import { Client } from "lib-concord-client";

const serverUrl = "http://localhost:6464";
const channelId = "019da1fb-e321-7dea-a8d7-16903b9077fd";

const { privateKey } = keygen();
const autenticator = defaultAutenticator(privateKey);

const [ok, client] = await Client.init(serverUrl, autenticator);

if (!ok) {
    console.log("failed to create client");
    return;
}

const [ok, _] = await client.joinChannel(channelId);

if (!ok) {
    console.log("failed to join channel");
    return;
}

const [ok, _] = await client.sendMessage("foo");

if (!ok) {
    console.log("failed to send message");
    return;
}
```

## build
```sh
npm run build
```

Dual-licensed under [MIT](../LICENSE-MIT) or the [UNLICENSE](../UNLICENSE).