# gRPC / protobuf API
This is an basic API to work with **DICE**'s Portal-Server (`Battlefield 6`).

## Configuration
Before you start, set the current `sessionId` at the configuration, otherwise you will get an **Exception**:
> **SessionException [Error]:** The request does not have valid authentication credentials for the operation.
```ts
Configuration.setSession('web-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
```

## Installation
> npm install

## Building
> npm run proto:generate

## Examples
### List all `Blueprints`
```ts
import {
    Configuration,
    Blueprint
} from "./Connector";

(async function main() {
    Configuration.setSession('web-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

    /* Getting all Blueprint ID's */
    try {
        const ids = await Blueprint.list();

        if(ids) {
            console.log('Blueprints: ', ids?.blueprintIds);

            /* Getting all details for given Blueprint ID's */
            const blueprints = await Blueprint.get(ids.blueprintIds);
            
            if(blueprints) {
                console.log('blueprints', JSON.stringify(blueprints, null, 1));
            } else {
                console.error('Can\'t find Blueprints!');
            }
        } else {
            console.error('Can\'t find Blueprint ID\'s!');
        }
    } catch(error: any) {
        console.error(error);
    }
})();
```

### List all `PlayElement`
```ts
import {
    Configuration,
    PlayElement,
} from "./Connector";

import { PublishState } from './generated/enum/PublishState';

(async function main() {
    Configuration.setSession('web-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

    /* Getting all PlayElements */
    try {
        const owned = await PlayElement.list([
            PublishState.ARCHIVED,
            PublishState.DRAFT,
            PublishState.PUBLISHED
        ], true);

       console.log('owned', owned);
    } catch(error: any) {
        console.error(error);
    }
})();
```

### Create a `PlayElement`
```ts
import {
    Configuration,
    PlayElement,
} from "./Connector";

import { PublishState } from './generated/enum/PublishState';

(async function main() {
    Configuration.setSession('web-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

    /* Create a PlayElement */
    try {
        const created = await PlayElement.create({
            name:                   'My first Example',
            publishState:           PublishState.DRAFT,
            description:            { value: 'This is my first created example!' },
            mapRotation:            [],
            mutators:               [],
            assetCategories:        [],
            originalModRules:       [],
            playElementSettings:    null,
            modLevelDataId:         null,
            thumbnailUrl:           { value: '[BB_PREFIX]/glacier/preApprovedThumbnails/fallback-abea2685.jpg' },
            attachments:            []
        });

        console.log('created', created);
    } catch(error: any) {
        console.error(error);
    }
})();
```

### Delete a `PlayElement`
> ![WARNING]
> This method is not "really" a delete method for a PlayElement, it will not deteled, it will archived internally and get the State `PublishState.ARCHIVED`!
```ts
import {
    Configuration,
    PlayElement,
} from "./Connector";

import { PublishState } from './generated/enum/PublishState';

(async function main() {
    Configuration.setSession('web-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

    /* Delete a PlayElement */
    try {
        await PlayElement.delete('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
    } catch(error: any) {
        console.error(error);
    }
})();
```

### Update a `PlayElement`
```ts
import {
    Configuration,
    PlayElement,
} from "./Connector";

import { PublishState } from './generated/enum/PublishState';

(async function main() {
    Configuration.setSession('web-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

    /* Update a PlayElement */
    try {
        const created = await PlayElement.update('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', {
            name:                   'My updated Example',
            publishState:           PublishState.DRAFT,
            description:            { value: 'This is my first updated example!' },
            mapRotation:            [],
            mutators:               [],
            assetCategories:        [],
            originalModRules:       [],
            playElementSettings:    null,
            modLevelDataId:         null,
            thumbnailUrl:           { value: '[BB_PREFIX]/glacier/preApprovedThumbnails/fallback-abea2685.jpg' },
            attachments:            []
        });

        console.log('created', created);
    } catch(error: any) {
        console.error(error);
    }
})();
```