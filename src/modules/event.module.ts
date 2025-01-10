import { Module, OnModuleInit } from '@nestjs/common';
import { ModulesContainer } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventHandler, EventPublisherService } from 'src/services/eventPublisher.service';
import { NotificationService } from 'src/services/notification.service';
import * as ExampleEvents from "../events/example.events";

@Module({
    imports: [EventEmitterModule.forRoot()],
    providers: [
        NotificationService,
        EventPublisherService,
        ...Object.values(ExampleEvents),
        // Add other handlers here
    ], 
})
export class EventHandlersModule implements OnModuleInit {
    constructor(
        private readonly modulesContainer: ModulesContainer,
        private readonly eventPublisher: EventPublisherService,
    ) {}
    
    onModuleInit(): void {
        new Array(...this.modulesContainer.values())
            .flatMap(module => [...module.providers.values()])
            .forEach(EventHandler.bind((event, eventHandler) => 
                this.eventPublisher.subscribe(event, eventHandler)
            ));
    }
}