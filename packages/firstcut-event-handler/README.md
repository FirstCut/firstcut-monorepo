# `firstcut-event-handler`

executes the side effects of Firstcut events. Events may include project requests, new shoots, shoots wrapped, etc.
Event templates generate actions given event data. Actions include slack notifications, emails, creating calendar events, etc...

Will eventually exist as an independent microservice.

## Usage

```
import { handleEvent, EVENTS } from 'firstcut-event-handler';
```
