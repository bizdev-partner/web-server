import { Server } from 'socket.io';
import { Global, Injectable, Logger } from '@nestjs/common';
import { Socket } from "socket.io";

export class ClientMap {
    public users: Record<string, Socket[]>;
    public applications: Record<string, Socket>;
    public sockets: Record<string, Socket>;

    constructor( ) {
        this.sockets = {}
        this.applications = {}
        this.users = {}
    }

    public connect(socket: Socket) {
        this.sockets[socket.id ?? ""] = socket;
    }

    public disconnect(socket: Socket) {
        try {
            delete this.sockets[socket.id ?? ""];

            Object.keys(this.applications).forEach(app => {
                if (this.applications[app].id == socket.id)
                    delete this.applications[app]
            })
            
            Object.keys(this.users).forEach(user => {
                this.users[user] = this.users[user].filter(s => s.id != socket.id)
            })
        } catch {
        }
    }

    public remember(socket: Socket, app: string) {
        this.applications[app] = socket;
    }   

    public forget(app: string) {
        delete this.applications[app];
    }

    public login(socket: Socket, userId: string) {  
        this.users[userId] = this.users[userId]?.filter(s => s.id != socket.id);
        this.getSockets(userId).push(socket);
    }   

    public logout(userId: string) {
        delete this.users[userId];
    }

    public all() {
        return Object.values(this.sockets)
    }

    public getSocket(appId: string) {
        try {
            return this.applications[appId]
        } catch {
            return undefined;
        }
    }

    public getSockets(userId: string): Socket[] {
        try {
            if (!this.users[userId])
                this.users[userId] = [];
                
            return this.users[userId]
        } catch {
            return [];
        }
    }

    public toString(): string {
        let result = 'WebSockets:\n';

        result += `Sockets: ${Object.keys(this.sockets).length} \n`;
        Object.keys(this.sockets).forEach((socket) => {
            result += `  ${socket}\n`;
        });

        result += `Applications: ${Object.keys(this.applications).length} \n`;
        Object.keys(this.applications).forEach((app) => {
            result += `  ${app}: ${this.applications[app].id}\n`;
        });

        result += `Users: ${Object.keys(this.users).length} \n`;
        Object.keys(this.users).forEach((user) => {
            result += `  ${user}: [${this.users[user].map(s => s.id).join(', ')}]\n`;
        });

        return result;
    }
}

@Global()
@Injectable()
export class NotificationService  {
    logger: Logger = new Logger("NotificationService");

    private static _server: Server;
    public static _clients: ClientMap = new ClientMap();
    
    constructor() {}

    public get clients(): ClientMap {
        return NotificationService._clients;
    }

    public get server(): Server {
        return NotificationService._server;
    }

    public initialize(server: Server) {
        NotificationService._server = NotificationService._server ?? server;
        this.logger.log("initialized");
    }

    public notify<T>(notification: T) {
        const topic = notification.constructor.name;

        this.clients.all().forEach(client => client.emit(topic, notification))
        this.logger.log("notified:  " + topic)
    }

    public notifyUser(userId: string, event: string, body: any) {
        const sockets = this.clients.getSockets(userId);

        sockets.forEach(socket => socket.emit(event, body));
    }

    public notifyApp(appID: string, event: string, body: any) {
        const socket = this.clients.getSocket(appID);

        socket.emit(event, body);
    }
}