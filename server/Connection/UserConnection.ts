import {Connection, ConnectionType, Events} from "./Connection";

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

    /**
     * Implements all user connection specific handlers
     *
     * @param {SocketIO.Socket} socket
     */
    protected addHandlers(socket: SocketIO.Socket) {
        socket.on(Events.JoinQueue, this.joinQueue);
    }

    /**
     * Event: Events.JoinQueue
     *
     * Moves user connection from new connections to queue
     */
    joinQueue = () => {
        console.log("adding user connection to queue - " + this.getIdentifierString());
        this._server.addQueuedUserConnection(this);
    }
}