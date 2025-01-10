import { IDomainEvent } from "@vannatta-software/ts-domain";


export class WorkflowCreatedEvent implements IDomainEvent {
    dateTimeOccurred: Date = new Date();
    workflowId: string;
    name: string;

    constructor(workflowId: string, name: string) {
        this.workflowId = workflowId;
        this.name = name;
    }
}

export class WorkflowUpdatedEvent implements IDomainEvent {
    dateTimeOccurred: Date = new Date();
    workflowId: string;
    updatedFields: object;

    constructor(workflowId: string, updatedFields: object) {
        this.workflowId = workflowId;
        this.updatedFields = updatedFields;
    }
}

export class WorkflowActivatedEvent implements IDomainEvent {
    dateTimeOccurred: Date = new Date();
    workflowId: string;

    constructor(workflowId: string) {
        this.workflowId = workflowId;
    }
}

export class WorkflowPausedEvent implements IDomainEvent {
    dateTimeOccurred: Date = new Date();
    workflowId: string;

    constructor(workflowId: string) {
        this.workflowId = workflowId;
    }
}

export class WorkflowArchivedEvent implements IDomainEvent {
    dateTimeOccurred: Date = new Date();
    workflowId: string;

    constructor(workflowId: string) {
        this.workflowId = workflowId;
    }
}

export class WorkflowDeletedEvent implements IDomainEvent {
    dateTimeOccurred: Date = new Date();
    workflowId: string;

    constructor(workflowId: string) {
        this.workflowId = workflowId;
    }
}

export class WorkflowActivityCreatedEvent implements IDomainEvent {
    dateTimeOccurred: Date = new Date();
    activityId: string;
    type: string;

    constructor(activityId: string, type: string) {
        this.activityId = activityId;
        this.type = type;
    }
}

export class WorkflowActivityDeletedEvent implements IDomainEvent {
    dateTimeOccurred: Date = new Date();
    activityId: string;

    constructor(activityId: string) {
        this.activityId = activityId;
    }
}
