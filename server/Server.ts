///<reference path="../typings/index.d.ts"/>

import * as core from "express-serve-static-core";
import * as express from "express";
import * as http from "http";
import * as socketIO from "socket.io";
import {Connection} from "../server/connection/Connection";
import {HostConnection} from "../server/connection/HostConnection";
import {Events} from "./connection/Connection";
import {UserConnection} from "./connection/UserConnection";


/**
 * How long to wait before powering on the mirror after user is ready
 * @type {number}
 */
const DANCING_TIMEOUT = 1000;

/**
 * How long (in ms) to display the welcome message
 *
 * @type {number}
 */
const WELCOME_TIMEOUT = 1000;

/**
 * How long (in ms) to display the "Where did you go?" message before sleeping & offering to next user
 *
 * @type {number}
 */
const LOST_USER_TIMEOUT = 3000;

/**
 * How long (in ms) to display the fortune on the mirror before going back to sleep & offering to next user
 *
 * @type {number}
 */
const FORTUNE_TIMEOUT = 1000;

/**
 * How long (in ms) to wait before timing out the active user for a lack of response
 *
 * @type {number}
 */
const ACTIVE_TIMEOUT = 3000;

/**
 * Main node web server that handles client synchronisation
 */
export class Server {

    private _app: core.Express;
    private _server: http.Server;
    private _io: SocketIO.Server;

    /**
     *
     * @type {HostConnectionCollection}
     * @private
     */
    private _hostConnections: HostConnectionCollection = {};

    /**
     *
     * @type {UserConnectionCollection}
     * @private
     */
    private _newUserConnections: UserConnectionCollection = {};

    /**
     * @type {UserConnection[]}
     * @private
     */
    private _queuedUserConnections: UserConnection[] = [];

    /**
     * @type {UserConnection}
     */
    private _userConnectionUnderOffer: UserConnection;

    /**
     * @type {NodeJS.Timer}
     */
    private _userOfferCountdownTimerInterval: NodeJS.Timer;

    /**
     * @type UserConnection
     * @private
     */
    private _activeUserConnection: UserConnection;

    /**
     * Timeout for active user operations screen
     */
    private _userHostTimeout;

    /**
     * Timeout for active user ping check
     */
    private _activeUserPingTimeout;

    /**
     * @constructor
     */
    constructor() {
        this._app = express();
        this._server = http.createServer(this._app);
        this._io = socketIO(this._server);

        this.addStaticFileHandler();

        this.addSocketConnectionHandler();
    }

    /**
     * Starts the server listing on port 3000
     */
    public listen() {
        this._server.listen(3000, function () {
            console.log("listening on *:3000");
        });
    }

    /**
     * Adds static routes
     */
    addStaticFileHandler(): void {

        let staticServer: core.Handler = express.static(__dirname + "/../web");

        // noinspection TypeScriptValidateTypes
        this._app.use(staticServer);
    }

    /**
     * Adds handlers for socket
     */
    addSocketConnectionHandler(): void {
        this._io.on(Events.Connect, this.newConnectionHandler);
    }

    /**
     * Handles all new connections
     * @param socket
     */
    newConnectionHandler = (socket: SocketIO.Socket) => {

        let connection: Connection;

        if ("localhost:3000" === socket.handshake.headers.host) {
            let hostConnection = new HostConnection(this, socket);
            this.addHostConnection(hostConnection);
            connection = hostConnection;
        } else {
            let userConnection = new UserConnection(this, socket);
            this.addNewUserConnection(userConnection);
            connection = userConnection;
        }

        connection.init();
    };

    // -----------------------------------------------------------------------------------------------------------------
    // User management methods
    // -----------------------------------------------------------------------------------------------------------------

    private updateUsersQueuePosition(connection?: UserConnection): void {
        for (let i in this._queuedUserConnections) {
            if (!connection || connection === this._queuedUserConnections[i]) {
                this._queuedUserConnections[i].emit(Events.QueuePosition, Number(i) + 1);
            }
        }
    }

    /**
     * Activates the next user
     */
    private offerToNextUser() {

        // Do nothing if there aren't any queued users
        if (!this._queuedUserConnections.length) {
            return;
        }

        // Do nothing if there's already a user under offer
        if (this._userConnectionUnderOffer) {
            return;
        }

        this._userConnectionUnderOffer = this._queuedUserConnections.shift();

        this.updateUsersQueuePosition();

        let countdownTimer = 10;
        console.log("offering to " + this._userConnectionUnderOffer.getIdentifierString());
        this.emitToUserUnderOffer(Events.ReadyTimer, countdownTimer);
        this.emitToUserUnderOffer(Events.Ready);

        this._userOfferCountdownTimerInterval = setInterval(() => {
            countdownTimer--;
            this._userConnectionUnderOffer.emit(Events.ReadyTimer, countdownTimer);

            if (0 === countdownTimer) {
                this.cancelOfferToUser();
            }
        }, 1000);
    }

    /**
     * Cancels the offer to the user currently under offer
     */
    private cancelOfferToUser = (): void => {
        if (this._userOfferCountdownTimerInterval) {
            clearInterval(this._userOfferCountdownTimerInterval);
            this._userOfferCountdownTimerInterval = undefined;
        }
        this._userConnectionUnderOffer.emit(Events.Timeout);

        this._userConnectionUnderOffer = undefined;

        this.offerToNextUser();
    };

    /**
     *
     * @param {UserConnection} connection
     * @param {boolean} ready
     */
    public userReady(connection: UserConnection, ready: boolean) {

        if (connection !== this._userConnectionUnderOffer) {
            console.log("ignoring ready request as not from the user under offer");
        }

        console.log("user ready - " + connection.getIdentifierString());

        // Either way, clear the timeout.  We'll handle things manually from here
        if (this._userOfferCountdownTimerInterval) {
            clearTimeout(this._userOfferCountdownTimerInterval);
            this._userOfferCountdownTimerInterval = undefined;
        }

        this.activateUserConnection(connection);
    }

    /**
     * Activates the user
     *
     * @param {UserConnection} connection
     */
    private activateUserConnection(connection: UserConnection) {

        if (connection !== this._userConnectionUnderOffer) {
            console.log("ignoring ready request as not from the user under offer");
        }

        this._userConnectionUnderOffer = undefined;

        // User shouldn't be in the queue, but make sure
        this.removeQueuedUserConnection(connection);

        this._activeUserConnection = connection;

        this.emitToActiveUser(Events.Activate, DANCING_TIMEOUT);

        this.updateUsersQueuePosition();

        // For now, we'll set a timeout on the dancing…

        // @todo Replace with motion detection...
        // @todo Add Dancing comment page?
        this._userHostTimeout = setTimeout(() => {
            this.emitToActiveUserAndHostConnections(Events.Welcome, WELCOME_TIMEOUT);

            // Redirect after time to read
            this._userHostTimeout = setTimeout(() => {
                this._userHostTimeout = undefined;
                this.emitToActiveUserAndHostConnections(Events.Categories);
                this.resetActiveUserPingTimeout(this._activeUserConnection);
            }, WELCOME_TIMEOUT);
        }, DANCING_TIMEOUT);
    }

    /**
     * Starts the countdown before the hosts go to sleep again
     */
    startFinishedTimeout(connection: UserConnection): void {

        // Only allow the current active user to start their own finished timer
        if (connection !== this._activeUserConnection) {
            return;
        }

        setTimeout((): void => {
            this.removeActiveUserConnection();
            this.emitToHosts(Events.Reset);
        }, FORTUNE_TIMEOUT);
    }

    // -----------------------------------------------------------------------------------------------------------------
    // User check methods
    // -----------------------------------------------------------------------------------------------------------------

    /**
     * The active user is given a certain amount of time to respond, otherwise they're timed out
     */
    resetActiveUserPingTimeout(connection: UserConnection): void {

        // Don't reset for active user
        if (connection !== this._activeUserConnection) {
            console.log("not resetting ping timer as non-active user");
            return;
        }

        console.log("Resetting active user ping timer");

        // Clear existing timeout
        this.clearActiveUserPingTimeout(connection);

        // And start a new one
        console.log("adding new active user ping timer");
        this._activeUserPingTimeout = setTimeout((): void => {
            if (this._activeUserConnection) {
                this._activeUserPingTimeout = undefined;
                this.dropConnection(this._activeUserConnection);
            }
        }, ACTIVE_TIMEOUT);
    };

    /**
     * Clears (if set) the current active user ping timeout
     */
    clearActiveUserPingTimeout(connection: UserConnection): void {

        // Don't reset for active user
        if (connection !== this._activeUserConnection) {
            console.log("not resetting ping timer as non-active user");
            return;
        }

        console.log("clearing active user ping timer");
        if (this._activeUserPingTimeout) {
            clearTimeout(this._activeUserPingTimeout);
        }
    }

    // -----------------------------------------------------------------------------------------------------------------
    // Helper methods
    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Emits the give event to all host connections
     *
     * @param args
     */
    emitToHosts(...args: any[]): void {
        console.log("emitting " + args[0] + " to all hosts", args.slice(1));
        for (let i in this._hostConnections) {
            let hostConnection = this._hostConnections[i];
            hostConnection.emit.apply(hostConnection, args);
        }
    }

    /**
     * Emits to user connection currently under offer
     *
     * @param args
     */
    emitToUserUnderOffer(...args: any[]): void {

        // Check we have a user under offer
        if (!this._userConnectionUnderOffer) {
            return;
        }

        this._userConnectionUnderOffer.emit.apply(this._userConnectionUnderOffer, args);
    }

    /**
     * Emits the given event to the active user connection
     *
     * Checks for the active user first
     *
     * @param args
     */
    emitToActiveUser(...args: any[]): void {
        // check for active user first
        if (!this._activeUserConnection) {
            return;
        }

        this._activeUserConnection.emit.apply(this._activeUserConnection, args);
    }

    /**
     * Emits the given event to the active user, and all host connections
     *
     * @param args
     */
    emitToActiveUserAndHostConnections(...args: any[]): void {
        this.emitToActiveUser.apply(this, args);
        this.emitToHosts.apply(this, args);
    }

    /**
     *
     * @param {UserConnection} connection
     * @param eventName
     * @param args
     */
    relayActiveConnectionMessageToHost(connection: UserConnection, eventName: string, ...args): void {
        if (connection !== this._activeUserConnection) {
            return;
        }

        // Clone the array so as not to modify the original array, apssed by reference
        args = args.slice(0);

        // Prepend the event name to the args
        args.unshift(eventName);

        this.emitToHosts.apply(this, args);
    }

    /**
     * Emits the give event to all user connections
     *
     * @param args
     */
    emitToAllUsers(...args: any[]): void {
        console.log("emitting " + args[0] + " to all users", args.slice(1));
        if (this._activeUserConnection) {
            this._activeUserConnection.emit.apply(this._activeUserConnection, args);
        }
        for (let i = 0; i < this._queuedUserConnections.length; i++) {
            let userConnection = this._queuedUserConnections[i];
            userConnection.emit.apply(userConnection, args);
        }
    }

    // -----------------------------------------------------------------------------------------------------------------
    // Getters & Setters
    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Adds a host connection to the hash of host connections
     *
     * @param {HostConnection} connection
     */
    public addHostConnection(connection: HostConnection) {
        console.log("adding host connection " + connection.getIdentifierString());
        this._hostConnections[connection.id] = connection;

        // If this is the first host, let waiting clients know
        if (1 === Object.keys(this._hostConnections).length) {
            this.offerToNextUser();
        }
    }

    /**
     * Adds a user connection to the hash of new user connections
     *
     * @param {UserConnection} connection
     */
    public addNewUserConnection(connection: UserConnection) {
        console.log("adding new user connection " + connection.getIdentifierString());
        this._newUserConnections[connection.id] = connection;
    }

    /**
     * Adds a user connection to the hash of new user connections
     *
     * @param {UserConnection} connection
     */
    public addQueuedUserConnection(connection: UserConnection) {
        console.log("removing connection " + connection.getIdentifierString() + " from new user connections");
        delete this._newUserConnections[connection.id];
        console.log("adding connection " + connection.getIdentifierString() + " to user queue");
        this._queuedUserConnections.push(connection);

        console.log(Object.keys(this._hostConnections));
        if (!Object.keys(this._hostConnections).length) {
            connection.emit(Events.MirrorOffline);
            return;
        }

        this.updateUsersQueuePosition(connection);

        if (!this._activeUserConnection) {
            this.offerToNextUser();
        }
    }

    /**
     * Removes a user conenction from the queue
     *
     * @param {UserConnection} connection
     */
    public removeQueuedUserConnection(connection: UserConnection) {
        console.log("attempting to remove user from queue - " + connection.getIdentifierString());
        for (let i = this._queuedUserConnections.length - 1; i >= 0; i--) {
            console.log("i: " + i);
            if (this._queuedUserConnections[i] === connection) {
                console.log("Found & removed ");
                this._queuedUserConnections.splice(i, 1);
            }
        }
    }

    /**
     * Drops a connection
     *
     * @param {Connection} connection
     */
    dropConnection(connection: Connection) {
        if (connection instanceof HostConnection) {
            this.dropHostConnection(connection);
        } else if (connection instanceof UserConnection) {
            this.dropUserConnection(connection);
        } else {
            throw "Unknown connection type";
        }

        // Terminate the connection to be sure
        connection.disconnect();
    }

    /**
     * Drops a host connection
     *
     * @param {HostConnection} connection
     */
    private dropHostConnection(connection: HostConnection) {
        console.log("dropping host connection " + connection.getIdentifierString());
        delete this._hostConnections[connection.id];
        this.dumpHostConnections();

        if (!Object.keys(this._hostConnections).length) {
            // Move the active user back onto the top of queue
            this.putActiveUserBackAtBeginningOfQueue();

            // And notify all the mirror is offline
            this.emitToAllUsers(Events.MirrorOffline);
        }
    }

    /**
     * Puts the active user back on the beginning of the queue
     */
    putActiveUserBackAtBeginningOfQueue(): void {
        if (!this._activeUserConnection) {
            return;
        }

        this._queuedUserConnections.unshift(this._activeUserConnection);
        this._activeUserConnection = undefined;
    }


    /**
     * Drops a user connection
     *
     * @param {UserConnection} connection
     */
    private dropUserConnection(connection: UserConnection) {
        console.log("dropping user connection " + connection.getIdentifierString());

        // Remove from new cuser connections
        if (this._newUserConnections[connection.id]) {
            delete this._newUserConnections[connection.id];
        }
        this.dumpNewUserConnections();

        this.removeQueuedUserConnection(connection);
        this.dumpQueuedUserConnections();

        this.removeUserUnderOfferConnection(connection);

        this.lostActiveUserConnection(connection);
    }

    /**
     * Removes the currently active user
     */
    private removeUserUnderOfferConnection(connection?: UserConnection) {
        console.log("removing user under offer");
        console.log("connection: " + (connection ? connection.getIdentifierString() : "[not specified]"));
        if (!connection || (this._userConnectionUnderOffer === connection)) {
            this.cancelOfferToUser();
        }
    }

    /**
     * Removes the currently active user if their connection is lost
     */
    private lostActiveUserConnection(connection?: UserConnection) {
        console.log("removing active user");
        console.log("connection: " + (connection ? connection.getIdentifierString() : "[not specified]"));
        if (connection && (this._activeUserConnection !== connection)) {
            console.log("... actually, this is not the active user, so not removing them");
            return;
        }

        this.emitToHosts(Events.LostUser);
        this._activeUserConnection.emit(Events.Timeout);

        this._activeUserConnection = undefined;
        if (this._userHostTimeout) {
            clearTimeout(this._userHostTimeout);
            this._userHostTimeout = undefined;
        }
        setTimeout(() => {
            this.emitToHosts(Events.Reset);
            this.offerToNextUser();
        }, LOST_USER_TIMEOUT);
    }

    private removeActiveUserConnection(connection?: UserConnection) {
        console.log("removing active user");
        console.log("connection: " + (connection ? connection.getIdentifierString() : "[not specified]"));
        if (connection && (this._activeUserConnection !== connection)) {
            return;
        }

        this._activeUserConnection = undefined;
        if (this._userHostTimeout) {
            clearTimeout(this._userHostTimeout);
            this._userHostTimeout = undefined;
        }
        this._userHostTimeout = undefined;
        this.emitToHosts(Events.Reset);
        this.offerToNextUser();
    }

    // -----------------------------------------------------------------------------------------------------------------
    // Debugging methods
    // -----------------------------------------------------------------------------------------------------------------

    public dumpAllQueues(): void {
        this.dumpHostConnections();
        this.dumpNewUserConnections();
        this.dumpQueuedUserConnections();
        this.dumpUserUnderOfferConnection();
        this.dumpActiveUserConnection();
    }

    /**
     * Logs the current pending connection stack
     */
    private dumpHostConnections() {

        let connectionCount: number = Object.keys(this._hostConnections).length;

        console.log("Host connections (" + connectionCount + ")...");

        if (!connectionCount) {
            console.log("  [None]");
            return;
        }

        for (let i in this._hostConnections) {
            console.log("  " + this._hostConnections[i].getIdentifierString());
        }
    }

    /**
     * Logs the current pending connection stack
     */
    private dumpNewUserConnections() {

        let connectionCount: number = Object.keys(this._newUserConnections).length;

        console.log("New user connections (" + connectionCount + ")...");

        if (!connectionCount) {
            console.log("  [None]");
            return;
        }

        for (let i in this._newUserConnections) {
            console.log("  " + this._newUserConnections[i].getIdentifierString());
        }
    }

    /**
     * Logs the current pending connection stack
     */
    private dumpQueuedUserConnections() {

        let connectionCount: number = Object.keys(this._queuedUserConnections).length;

        console.log("Queued user connections (" + connectionCount + ")...");

        if (!connectionCount) {
            console.log("  [None]");
            return;
        }

        for (let i in this._queuedUserConnections) {
            console.log("  " + this._queuedUserConnections[i].getIdentifierString());
        }
    }

    /**
     * Logs the current pending connection stack
     */
    private dumpUserUnderOfferConnection() {

        console.log("User under offer connection...");

        if (!this._userConnectionUnderOffer) {
            console.log("  [None]");
            return;
        }

        console.log("  " + this._userConnectionUnderOffer.getIdentifierString());
    }

    /**
     * Logs the current pending connection stack
     */
    private dumpActiveUserConnection() {

        console.log("Active user connection...");

        if (!this._activeUserConnection) {
            console.log("  [None]");
            return;
        }

        console.log("  " + this._activeUserConnection.getIdentifierString());
    }
}


interface HostConnectionCollection {
    [id: string]: HostConnection;
}

interface UserConnectionCollection {
    [id: string]: UserConnection;
}