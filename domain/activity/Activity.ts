import { AggregateRoot, UniqueIdentifier } from "@vannatta-software/ts-domain";
import { ActivityType, PriorityType,  ActivityStatus } from "./ActivityTypes";
import { Note } from "../common/Note";
import * as Contracts from "./contracts";
import { Schema } from "@vannatta-software/ts-core";
import { ActivityOutcome } from "./ActivityOutcome";
import { EnumUtils } from "@domain/common/EnumUtils";
import { PriorityRules } from "./PriorityRules";


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

    @Schema({ type: UniqueIdentifier, optional: true, embedded: true })
    public campaignId?: UniqueIdentifier;

    @Schema({ type: PriorityRules, embedded: true})
    public rules: PriorityRules;

    @Schema({ type: Boolean })
    public flagged: boolean;

    constructor(activity?: Partial<Activity>) {
        super(activity);
        this.type = activity?.type ?? ActivityType.EmailOutreach; // Default to Email Outreach
        this.priority = activity?.priority ?? PriorityType.Medium;  // Default to Medium
        this.outcome = activity?.outcome; // Default to Pending
        this.status = activity?.status ?? ActivityStatus.Open; // Default to Open
        this.scheduledDate = activity?.scheduledDate ?? undefined;
        this.completionDate = activity?.completionDate ?? undefined;
        this.notes = activity?.notes ?? [];
        this.leadId = activity?.leadId ?? undefined;
        this.campaignId = activity?.campaignId ?? undefined;
        this.flagged = activity?.flagged ?? false;
        this.rules = new PriorityRules(activity?.rules ?? {});
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

    public setRules(rules: Partial<PriorityRules>) {
        this.rules = new PriorityRules({ ...this.rules, ...rules });
        this.addDomainEvent(new Contracts.ActivityRulesChanged(this));
    }

    public setFlag(flag: boolean) {
        this.flagged = flag;
        this.addDomainEvent(new Contracts.ActivityFlagged(this.id.value, flag))
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

    public static getType(type: string): ActivityType {
        return this.generateTemplates().find(a => a.type.name == type).type;
    }
}