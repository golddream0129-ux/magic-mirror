
"use strict";

import {Connection, ConnectionType} from "./Connection";

/**
 * Connection from the mirror itself
 */
export class HostConnection extends Connection {
    getType(): ConnectionType {
        return "host";
    }
}