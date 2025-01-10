import { IDomainEvent } from "@vannatta-software/ts-domain";

export class ReportRequested implements IDomainEvent {
    dateTimeOccurred: Date = new Date();

    constructor(
        public readonly reportId: string,
        public readonly requestedBy: string,
        public readonly requestedAt: Date
    ) {}
}

export class ReportDeleted implements IDomainEvent {
    dateTimeOccurred: Date = new Date();

    constructor(
        public readonly reportId: string,
        public readonly deletedAt: Date
    ) {}
}

export class ReportGenerated implements IDomainEvent {
    dateTimeOccurred: Date = new Date();

    constructor(
        public readonly reportId: string,
        public readonly generatedAt: Date
    ) {}
}

export class ReportGenerationFailed implements IDomainEvent {
    dateTimeOccurred: Date = new Date();

    constructor(
        public readonly reportId: string,
        public readonly failedAt: Date,
        public readonly reason: string
    ) {}
}

