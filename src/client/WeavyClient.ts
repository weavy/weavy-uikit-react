import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

export default class WeavyClient {
    uri;
    tokenFactory;
    connection;
    groups: string[];
    connectionEvents: any[];
    isConnectionStarted: any;

    EVENT_NAMESPACE = ".connection";
    EVENT_CLOSE = "close";
    EVENT_RECONNECTING = "reconnecting";
    EVENT_RECONNECTED = "reconnected";

    constructor(options: WeavyClientOptions) {
        this.uri = options.uri;
        this.tokenFactory = options.tokenFactory
        this.groups = [];
        this.connectionEvents = [];
         
        this.connection = new HubConnectionBuilder()
            .configureLogging(LogLevel.None)
            .withUrl(this.uri + "/hubs/rtm", {
                accessTokenFactory: this.tokenFactory
            })
            .withAutomaticReconnect()
            .build();
        
            this.isConnectionStarted = this.connection.start();           

        this.connection.onclose(error => this.triggerHandler(this.EVENT_CLOSE, error));
        this.connection.onreconnecting(error => this.triggerHandler(this.EVENT_RECONNECTING, error));
        this.connection.onreconnected(connectionId => this.triggerHandler(this.EVENT_RECONNECTED, connectionId));
        
    }


    async subscribe(group: string, event: string, callback: any) {        
        await this.isConnectionStarted;
        
        try {
            var name = group ? group + ":" + event : event;
            await this.connection.invoke("AddToGroup", name);
            this.groups.push(name);
            this.connection.on(name, callback);
        } catch(err: any){
            console.warn("Error in AddToGroup:", err)
        }
        
    }

    async unsubscribe(group: string, event: string, callback: any) {
        await this.isConnectionStarted;
        var name = group ? group + ":" + event : event;
        
        // get first occurence of group name and remove it                        
        const index = this.groups.findIndex(e => e === name);
        if(index !== -1){
            this.groups = this.groups.splice(index, 1);

            try {                
                // if no more groups, remove from server
                if(!this.groups.find(e => e === name)){
                    await this.connection.invoke("RemoveFromGroup", name);
                }
                
            } catch(err: any){
                console.warn("Error in RemoveFromGroup:", err)
            }
        }
            
        this.connection.off(name, callback);
    }
 
    triggerHandler(name: string, ...data: any) {
        name = name.endsWith(this.EVENT_NAMESPACE) ? name : name + this.EVENT_NAMESPACE;
        let event = new CustomEvent(name, { cancelable: false });

        console.debug("triggerHandler", name);

        this.connectionEvents.forEach((eventHandler) => {
            if (eventHandler.name === name) {
                eventHandler.handler(event, ...data);
            }
        });

        if (name === this.EVENT_RECONNECTED + this.EVENT_NAMESPACE) {
            // re-add to signalr groups after reconnect
            for (var i = 0; i < this.groups.length; i++) {
                this.connection.invoke("AddToGroup", this.groups[i]);
            }
        }
    }
}
