import { Entity, IDomainEvent } from '@vannatta-software/ts-domain';
import { ClassType, StringUtils } from '@vannatta-software/ts-core';
import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import 'reflect-metadata';

export const EVENT_HANDLER_METADATA = 'EVENT_HANDLER_METADATA';

export abstract class EventHandler<TEvent extends IDomainEvent> {
    abstract handle(event: TEvent): void;

    public static bind(callback) {
        return (handler) => {
            const instance = handler.instance as EventHandler<any>;
    
            if (instance && instance.handle) {
                const metadata = Reflect.getMetadata(EVENT_HANDLER_METADATA, instance.constructor);
                callback(metadata.event, instance.handle.bind(instance));
            }
        }
    }
}

export function HandleEvent(event: any): ClassDecorator {
    return function (constructor: Function) {
        Reflect.defineMetadata(EVENT_HANDLER_METADATA, {event}, constructor);
    };
}

@Injectable()
export class EventPublisherService {
    private readonly logger = new Logger("EventPublisher")
    constructor(private readonly eventEmitter: EventEmitter2) {
        this.subscribe.bind(this);
        this.publish.bind(this);
        this.publishAll.bind(this);
    }

    subscribe<T>(e: ClassType<T>, callback: (...args: any[]) => void) {
        this.eventEmitter.on(StringUtils.className(e), callback);
        this.logger.log("Subscribed to: " + StringUtils.className(e))
    }

    publish(event: any) {
        this.logger.log("Emitted: " + event.constructor.name)
        this.eventEmitter.emit(event.constructor.name, event);
    }

    publishAll(entity: Entity) {
        entity.domainEvents.forEach(event => this.publish(event));
        entity.clearDomainEvents();
    }
}
