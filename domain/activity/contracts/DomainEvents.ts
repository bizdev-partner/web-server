import { IDomainEvent } from "@vannatta-software/ts-domain";
import { ActivityOutcome } from "../ActivityOutcome";
import { Activity } from "../Activity";

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

export class ActivityFlagged implements IDomainEvent {
    dateTimeOccurred: Date = new Date();

    constructor(
        public readonly activityId: string,
        public readonly flagged: boolean
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

export class ActivityRulesChanged implements IDomainEvent {
    dateTimeOccurred: Date = new Date();
    public readonly pending: number;
    public readonly due: number;
    public readonly overdue: number;

    constructor(activity: Activity) {
        this.pending = activity.rules.pending;
        this.due = activity.rules.due;
        this.overdue = activity.rules.overdue;
    }
}

