import { IDomainEvent } from "@vannatta-software/ts-domain";

// CampaignLaunched Event
export class CampaignLaunched implements IDomainEvent {
    public readonly dateTimeOccurred: Date = new Date();

    constructor(
        public readonly campaignId: string,
        public readonly startDate: Date
    ) {}
}

// CampaignPaused Event
export class CampaignPaused implements IDomainEvent {
    public readonly dateTimeOccurred: Date = new Date();

    constructor(public readonly campaignId: string) {}
}

// CampaignResumed Event
export class CampaignResumed implements IDomainEvent {
    public readonly dateTimeOccurred: Date = new Date();

    constructor(public readonly campaignId: string) {}
}

// CampaignCompleted Event
export class CampaignCompleted implements IDomainEvent {
    public readonly dateTimeOccurred: Date = new Date();

    constructor(
        public readonly campaignId: string,
        public readonly metrics: {
            totalLeads: number;
            completedActivities: number;
            successfulOutcomes: number;
            failedOutcomes: number;
        }
    ) {}
}

// ActivityScheduled Event
export class CampaignActivityScheduled implements IDomainEvent {
    public readonly dateTimeOccurred: Date = new Date();

    constructor(
        public readonly activityId: string,
        public readonly scheduledDate: Date
    ) {}
}

// ActivityCompleted Event
export class CampaignActivityCompleted implements IDomainEvent {
    public readonly dateTimeOccurred: Date = new Date();

    constructor(
        public readonly activityId: string,
        public readonly outcome: string,
        public readonly completionDate: Date
    ) {}
}

// ActivityCancelled Event
export class CampaignActivityCancelled implements IDomainEvent {
    public readonly dateTimeOccurred: Date = new Date();

    constructor(public readonly activityId: string) {}
}

// ActivityRescheduled Event
export class CampaignActivityRescheduled implements IDomainEvent {
    public readonly dateTimeOccurred: Date = new Date();

    constructor(
        public readonly activityId: string,
        public readonly newScheduledDate: Date
    ) {}
}
