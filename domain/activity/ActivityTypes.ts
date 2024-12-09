import { Enumeration } from "@vannatta-software/ts-domain";
import { ActivityOutcome } from "./ActivityOutcome";
import { EnumUtils } from "@domain/common/EnumUtils";

export class ActivityType extends Enumeration {
    public outcomes: ActivityOutcome[];

    constructor(props: Partial<ActivityType>) {
        super(props);
    }

    public addOutcomes(outcomes: ActivityOutcome[]) {
        this.outcomes = outcomes;

        return this;
    }

    // Predefined ActivityTypes with corresponding ActivityOutcomes
    public static readonly EmailOutreach = new ActivityType(
        { id: 1, name: "Email Outreach" }).addOutcomes(
        [
            new ActivityOutcome({ description: "Email Sent", success: true }),
            new ActivityOutcome({ description: "Bounced", success: false }),
            new ActivityOutcome({ description: "No Response", success: false }),
        ]
    );

    public static readonly PhoneCall = new ActivityType(
        { id: 2, name: "Phone Call" }).addOutcomes(
        [
            new ActivityOutcome({ description: "Call Connected", success: true }),
            new ActivityOutcome({ description: "No Answer", success: false }),
            new ActivityOutcome({ description: "Wrong Number", success: false }),
        ]
    );

    public static readonly InPersonMeeting = new ActivityType(
        { id: 3, name: "In-Person Meeting" }).addOutcomes(
        [
            new ActivityOutcome({ description: "Meeting Held", success: true }),
            new ActivityOutcome({ description: "Client Cancelled", success: false }),
            new ActivityOutcome({ description: "No Show", success: false }),
        ]
    );

    public static readonly ProductDemo = new ActivityType(
        { id: 4, name: "Product Demo" }).addOutcomes(
        [
            new ActivityOutcome({ description: "Demo Completed", success: true }),
            new ActivityOutcome({ description: "Client Uninterested", success: false }),
            new ActivityOutcome({ description: "Technical Issues", success: false }),
        ]
    );

    public static readonly NetworkingEvent = new ActivityType(
        { id: 5, name: "Networking Event" }).addOutcomes(
        [
            new ActivityOutcome({ description: "Connections Made", success: true }),
            new ActivityOutcome({ description: "Low Engagement", success: false }),
            new ActivityOutcome({ description: "Event Cancelled", success: false }),
        ]
    );

    public static readonly SocialMediaEngagement = new ActivityType(
        { id: 6, name: "Social Media Engagement" }).addOutcomes(
        [
            new ActivityOutcome({ description: "Post Liked", success: true }),
            new ActivityOutcome({ description: "Post Ignored", success: false }),
            new ActivityOutcome({ description: "Negative Feedback", success: false }),
        ]
    );

    public static readonly ProposalSubmission = new ActivityType(
        { id: 7, name: "Proposal Submission" }).addOutcomes(
        [
            new ActivityOutcome({ description: "Proposal Accepted", success: true }),
            new ActivityOutcome({ description: "Proposal Rejected", success: false }),
            new ActivityOutcome({ description: "Awaiting Response", success: false }),
        ]
    );

    public static readonly FollowUp = new ActivityType(
        { id: 8, name: "Follow-Up" }).addOutcomes(
        [
            new ActivityOutcome({ description: "Follow-Up Successful", success: true }),
            new ActivityOutcome({ description: "No Response", success: false }),
            new ActivityOutcome({ description: "Client Uninterested", success: false }),
        ]
    );

    public static readonly ContractNegotiation = new ActivityType(
        { id: 9, name: "Contract Negotiation" }).addOutcomes(
        [
            new ActivityOutcome({ description: "Contract Finalized", success: true }),
            new ActivityOutcome({ description: "Negotiations Failed", success: false }),
            new ActivityOutcome({ description: "Client Requested Revisions", success: false }),
        ]
    );

    public static readonly Closing = new ActivityType(
        { id: 10, name: "Closing" }).addOutcomes(
        [
            new ActivityOutcome({ description: "Deal Closed", success: true }),
            new ActivityOutcome({ description: "Deal Fell Through", success: false }),
            new ActivityOutcome({ description: "Postponed", success: false }),
        ]
    );

    public static fromName(name: string): ActivityType {
        return EnumUtils.fromName(ActivityType, name);
    }
}


export class PriorityType extends Enumeration {
    public static High = new PriorityType({ id: 1, name: "High" });
    public static Medium = new PriorityType({ id: 2, name: "Medium" });
    public static Low = new PriorityType({ id: 3, name: "Low" });

    constructor(partial: Partial<PriorityType>) {
        super(partial)
    }

    protected *getAtomicValues(): IterableIterator<any> {
        yield this.id;
        yield this.name;
    }

    public static fromName(name: string): PriorityType {
        return EnumUtils.fromName(PriorityType, name);
    }
}

export class ActivityStatus extends Enumeration {
    public static Open = new ActivityStatus({ id: 1, name: "Open" });
    public static InProgress = new ActivityStatus({ id: 2, name: "InProgress" });
    public static Complete = new ActivityStatus({ id: 3, name: "Complete" });
    public static Cancelled = new ActivityStatus({ id: 4, name: "Cancelled" });

    constructor(partial: Partial<ActivityStatus>) {
        super(partial)
    }

    protected *getAtomicValues(): IterableIterator<any> {
        yield this.id;
        yield this.name;
    }

    public static fromName(name: string): ActivityStatus {
        return EnumUtils.fromName(ActivityStatus, name);
    }
}
