import { Model, Validation } from "@vannatta-software/ts-domain";
import { FieldType, Field } from "@vannatta-software/ts-core";
import { ActivityType } from "../ActivityTypes";
import { EnumUtils } from "@domain/common/EnumUtils";

export class ScheduleActivityCommand extends Model {
    @Field("Activity Type", FieldType.Select, EnumUtils.names(ActivityType))
    @Validation({ required: true })
    public type: string;

    @Field("Scheduled Date", FieldType.Text)
    @Validation({ required: true })
    public scheduledDate: Date;

    @Field("Lead ID", FieldType.Text)
    public leadId?: string;

    @Field("Notes", FieldType.TextArea)
    public notes?: string[];

    @Field("Priority", FieldType.Text)
    @Validation({ required: true })
    public priority: string;
}

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

export class RescheduleActivityCommand extends Model {
    @Field("Activity ID", FieldType.Text)
    @Validation({ required: true })
    public activityId: string;

    @Field("New Scheduled Date", FieldType.Text)
    @Validation({ required: true })
    public newScheduledDate: Date;
}

export class CancelActivityCommand extends Model {
    @Field("Activity ID", FieldType.Text)
    @Validation({ required: true })
    public activityId: string;
}
