import { AggregateRoot, UniqueIdentifier } from "@vannatta-software/ts-domain";
import { ActivityType, PriorityType,  ActivityStatus } from "./ActivityTypes";
import { Note } from "../common/Note";
import * as Contracts from "./contracts";
import { Schema } from "@vannatta-software/ts-core";
import { ActivityOutcome } from "./ActivityOutcome";
import { EnumUtils } from "@domain/common/EnumUtils";

export class Activity extends AggregateRoot {
    @Schema({ type: ActivityType, enum: EnumUtils.names(ActivityType)})
    public type: ActivityType;

    @Schema({ type: PriorityType, enum: EnumUtils.names(PriorityType) })
    public priority: PriorityType;

    @Schema({ type: ActivityOutcome, embedded: true })
    public outcome: ActivityOutcome;

    @Schema({ type: ActivityStatus,  enum: EnumUtils.names(ActivityStatus) })
    public status: ActivityStatus;

    @Schema({ type: Date, optional: true })
    public scheduledDate?: Date;

    @Schema({ type: Date, optional: true })
    public completionDate?: Date;

    @Schema({ type: Array, items: Note, optional: true, embedded: true })
    public notes: Note[];

    @Schema({ type: UniqueIdentifier, optional: true, embedded: true })
    public leadId?: UniqueIdentifier;

    constructor(activity?: Partial<Activity>) {
        super(activity);
        this.type = activity?.type ?? ActivityType.EmailOutreach; // Default to Email Outreach
        this.priority = activity?.priority ?? PriorityType.Medium;  // Default to Medium
        this.outcome = undefined; // Default to Pending
        this.status = activity?.status ?? ActivityStatus.Open; // Default to Open
        this.scheduledDate = activity?.scheduledDate ?? undefined;
        this.completionDate = activity?.completionDate ?? undefined;
        this.notes = activity?.notes ?? [];
        this.leadId = activity?.leadId ?? undefined;
    }

    public create(): void {
        this.addDomainEvent(new Contracts.ActivityScheduled(this.id.value, this.scheduledDate ?? new Date()));
    }

    public delete(): void {
        this.addDomainEvent(new Contracts.ActivityCancelled(this.id.value));
    }

    public schedule(date: Date): void {
        this.scheduledDate = date;
        this.status = ActivityStatus.Open;
        this.addDomainEvent(new Contracts.ActivityScheduled(this.id.value, date));
    }

    public complete(outcome: ActivityOutcome): void {
        this.completionDate = new Date();
        this.status = ActivityStatus.Complete;
        this.outcome = outcome;
        this.addDomainEvent(new Contracts.ActivityCompleted(this.id.value, outcome, this.completionDate));
    }

    public cancel(): void {
        this.status = ActivityStatus.Cancelled;
        this.addDomainEvent(new Contracts.ActivityCancelled(this.id.value));
    }

    public reschedule(newDate: Date): void {
        this.scheduledDate = newDate;
        this.addDomainEvent(new Contracts.ActivityRescheduled(this.id.value, newDate));
    }

    /**
     * Generates a template list of activities based on all predefined ActivityTypes.
     * @returns An array of Activity objects, each templated from ActivityType.
     */
    public static generateTemplates(): Activity[] {
        return EnumUtils.all(ActivityType).map((type) => {
            return new Activity({
                type: type,
                priority: PriorityType.Medium, // Default priority
                status: ActivityStatus.Open, // Default status
                notes: [], // No notes by default
            });
        });
    }
}
