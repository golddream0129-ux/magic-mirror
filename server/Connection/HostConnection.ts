import {Connection, ConnectionType} from "../../server/connection/Connection";

/**
 * Connection to host (mirror) device used to send socket messages back & forth
 */
export class HostConnection extends Connection {

    /**
     * Returns a friendly connection type string
     *
     * @return {string}
     */
    getType(): ConnectionType {
        return "host";
    }

    /**
     * Implements all host connection specific handlers
     *
     * @param {SocketIO.Socket} socket
     */
    protected addHandlers(socket: SocketIO.Socket) {
    }
}