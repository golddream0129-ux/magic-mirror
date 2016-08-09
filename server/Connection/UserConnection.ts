import {Connection, ConnectionType} from "./Connection";

/**
 * Connections to user clients
 */
export class UserConnection extends Connection {

    /**
     * @return {string}
     */
    getType(): ConnectionType {
        return "user";
    }
}