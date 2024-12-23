import { Model, Validation } from "@vannatta-software/ts-domain";
import { FieldType, Field } from "@vannatta-software/ts-core";
import { ActivityType } from "../ActivityTypes";
import { EnumUtils } from "@domain/common/EnumUtils";
import { PriorityRules } from "../PriorityRules";

export class ScheduleActivityCommand extends Model {
    @Field("Activity Type", FieldType.Select, EnumUtils.names(ActivityType))
    @Validation({ required: true })
    public type: string;

    @Field("Scheduled Date", FieldType.Text)
    @Validation({ required: true })
    public scheduledDate: Date;

    @Field("Campaign ID", FieldType.Text)
    public campaignId?: string;

    @Field("Lead ID", FieldType.Text)
    public leadId?: string;

    @Field("Notes", FieldType.TextArea)
    public notes?: string[];

    @Field("Priority", FieldType.Text)
    @Validation({ required: true })
    public priority: string;

    @Field("Rules", FieldType.TextArea)
    @Validation({ required: true })
    public rules: Partial<PriorityRules>
}

export type IScheduleActivityCommand = Pick<
    ScheduleActivityCommand,
    "type" | "scheduledDate" | "leadId" | "campaignId" | "notes" | "priority" | "rules"
>;

export class CompleteActivityCommand extends Model {
    @Field("Activity ID", FieldType.Text)
    @Validation({ required: true })
    public activityId: string;

    @Field("Outcome", FieldType.Text)
    @Validation({ required: true })
    public outcome: string;

    @Field("Success", FieldType.Text)
    @Validation({ required: true })
    public success: boolean;

    @Field("Completion Date", FieldType.Text)
    @Validation({ required: true })
    public completionDate: Date;
}

export type ICompleteActivityCommand = Pick<
    CompleteActivityCommand,
    "activityId" | "outcome" | "success" | "completionDate"
>;

export class RescheduleActivityCommand extends Model {
    @Field("Activity ID", FieldType.Text)
    @Validation({ required: true })
    public activityId: string;

    @Field("New Scheduled Date", FieldType.Text)
    @Validation({ required: true })
    public newScheduledDate: Date;
}

export type IRescheduleActivityCommand = Pick<
    RescheduleActivityCommand,
    "activityId" | "newScheduledDate"
>;

export class CancelActivityCommand extends Model {
    @Field("Activity ID", FieldType.Text)
    @Validation({ required: true })
    public activityId: string;
}

export type ICancelActivityCommand = Pick<
    CancelActivityCommand,
    "activityId"
>;
