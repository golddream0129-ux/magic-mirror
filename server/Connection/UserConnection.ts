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
        socket.on(Events.Answers, this.answersHandler);
    }

    /**
     * Event: Events.JoinQueue
     *
     * Moves user connection from new connections to queue
     */
    joinQueueHandler = (): void => {
        console.log("adding user connection to queue - " + this.getIdentifierString());
        this._server.addQueuedUserConnection(this);
    };

    /**
     * Event: Events.Ready
     *
     * @param {boolean} ready
     */
    readyHandler = (ready: boolean): void => {
        console.log("user is ready? - " + ready);
        this._server.userReady(this, ready);
    };

    /**
     * Event: Events.CategorySelected
     *
     * @param {string} categoryName
     */
    categorySelectedHandler = (categoryName: string): void => {
        console.log("category selected - " + categoryName);
        this._server.relayActiveConnectionMessageToHost(this, Events.CategorySelected, categoryName);
    };

    /**
     * Event: Events.categorySelected
     *
     * @param {string[]} answerKeys
     */
    answersHandler = (answerKeys: string[]): void => {
        console.log("answers update", answerKeys);
        this._server.relayActiveConnectionMessageToHost(this, Events.Answers, answerKeys);
    };
}