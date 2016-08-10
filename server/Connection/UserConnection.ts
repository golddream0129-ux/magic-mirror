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
        socket.on(Events.JoinQueue, this.joinQueueHandler);
        socket.on(Events.Ready, this.readyHandler);
        socket.on(Events.CategorySelected, this.categorySelectedHandler);
    }

    /**
     * Event: Events.JoinQueue
     *
     * Moves user connection from new connections to queue
     */
    joinQueueHandler = () => {
        console.log("adding user connection to queue - " + this.getIdentifierString());
        this._server.addQueuedUserConnection(this);
    };

    /**
     * Event: Events.Ready
     *
     * @param {boolean} ready
     */
    readyHandler = (ready: boolean) => {
        this._server.userReady(this, ready);
    };

    /**
     * Event: Events.categorySelected
     *
     * @param {string} categoryName
     */
    categorySelectedHandler = (categoryName: string) => {
        this._server.relayActiveConnectionMessageToHost(this, Events.CategorySelected, categoryName);
    };
}