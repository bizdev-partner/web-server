import { Injectable } from '@nestjs/common';
import { EventHandler, HandleEvent } from 'src/services/eventPublisher.service';
import { NotificationService } from 'src/services/notification.service';
import { Contracts } from '@domain/example/index';

// ExampleCreatedEvent

@Injectable()
@HandleEvent(Contracts.ExampleCreatedEvent)
export class ExampleCreatedHandler implements EventHandler<Contracts.ExampleCreatedEvent> {
    constructor(private readonly notifications: NotificationService) {}

    handle(event: Contracts.ExampleCreatedEvent) {
        this.notifications.notify(new Contracts.ExampleCreatedNotification(event.exampleId));
    }
}

@Injectable()
@HandleEvent(Contracts.ExampleDeletedEvent)
export class ExampleDeletedHandler implements EventHandler<Contracts.ExampleDeletedEvent> {
    constructor(
        private readonly notifications: NotificationService,
    ) {}

    handle(event: Contracts.ExampleDeletedEvent) {
        this.notifications.notify(new Contracts.ExampleDeletedNotification(event.exampleId));
    }
}

@HandleEvent(Contracts.ExampleMetadataUpdatedEvent)
@Injectable()
export class ExampleMetadataUpdatedHandler implements EventHandler<Contracts.ExampleMetadataUpdatedEvent> {
    constructor(
        private readonly notifications: NotificationService,
    ) {}

    handle(event: Contracts.ExampleMetadataUpdatedEvent) {
        this.notifications.notify(new Contracts.ExampleMetadataNotification(event.exampleId, event.metadata));
    }
}