
"use strict";

import {Connection, ConnectionType, Events, States} from "./Connection";

/**
 * Connection from the mirror itself
 */
export class HostConnection extends Connection {

    /**
     * Returns the connection type friendly name
     *
     * @return {ConnectionType}
     */
    getType(): ConnectionType {
        return "host";
    }

    /**
     * Sets the state of the client to 'host'
     */
    init(): void {
        this.socket.emit(Events.setState, States.host);
    }
}