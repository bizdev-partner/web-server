import { IDomainEvent } from "@vannatta-software/ts-domain";
import { ActivityOutcome } from "../ActivityOutcome";

export class ActivityScheduled implements IDomainEvent {
    dateTimeOccurred: Date = new Date();

    constructor(
        public readonly activityId: string,
        public readonly scheduledDate: Date
    ) {}
}

export class ActivityCompleted implements IDomainEvent {
    dateTimeOccurred: Date = new Date();

    constructor(
        public readonly activityId: string,
        public readonly outcome: ActivityOutcome,
        public readonly completionDate: Date
    ) {}
}

export class ActivityCancelled implements IDomainEvent {
    dateTimeOccurred: Date = new Date();

    constructor(public readonly activityId: string) {}
}

export class ActivityRescheduled implements IDomainEvent {
    dateTimeOccurred: Date = new Date();

    constructor(
        public readonly activityId: string,
        public readonly newScheduledDate: Date
    ) {}
}
