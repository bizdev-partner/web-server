import { Enumeration } from "@vannatta-software/ts-domain";
import { ActivityOutcome } from "./ActivityOutcome";
import { EnumUtils } from "@domain/common/EnumUtils";
import { LeadStatus } from "@domain/lead";

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
            new ActivityOutcome({ description: "Email Sent",  leadStatus: LeadStatus.Pursued }),
            new ActivityOutcome({ description: "Bounced",  leadStatus: LeadStatus.Unqualified }),
            new ActivityOutcome({ description: "Reply in thread",  leadStatus: LeadStatus.Pursued }),
            new ActivityOutcome({ description: "Replied - Won",  leadStatus: LeadStatus.Won }),
            new ActivityOutcome({ description: "Replied - Lost",  leadStatus: LeadStatus.Lost }),
        ]
    );

    public static readonly PhoneCall = new ActivityType(
        { id: 2, name: "Phone Call" }).addOutcomes(
        [
            new ActivityOutcome({ description: "Call Connected",  leadStatus: LeadStatus.Pursued }),
            new ActivityOutcome({ description: "No Answer",  leadStatus: LeadStatus.Pursued }),
            new ActivityOutcome({ description: "Wrong Number",  leadStatus: LeadStatus.Unqualified }),
            new ActivityOutcome({ description: "Replied - Won",  leadStatus: LeadStatus.Won }),
            new ActivityOutcome({ description: "Replied - Lost",  leadStatus: LeadStatus.Lost }),
        ]
    );

    public static readonly InPersonVisit = new ActivityType(
        { id: 3, name: "In-Person Visit" }).addOutcomes(
        [
            new ActivityOutcome({ description: "Met with POC",  leadStatus: LeadStatus.Pursued }),
            new ActivityOutcome({ description: "Got POC info",  leadStatus: LeadStatus.Pursued }),
            new ActivityOutcome({ description: "No POC",  leadStatus: LeadStatus.Pursued }),
            new ActivityOutcome({ description: "No Need",  leadStatus: LeadStatus.Lost }),
            new ActivityOutcome({ description: "Meeting handoff scheduled",  leadStatus: LeadStatus.Won }),
            new ActivityOutcome({ description: "Not at location",  leadStatus: LeadStatus.Unqualified }),
        ]
    );

    public static readonly ProductDemo = new ActivityType(
        { id: 4, name: "Product Demo" }).addOutcomes(
        [
            new ActivityOutcome({ description: "Demo Completed",  leadStatus: LeadStatus.Pursued }),
            new ActivityOutcome({ description: "Uninterested",  leadStatus: LeadStatus.Lost }),
            new ActivityOutcome({ description: "Demo Completed - Won",  leadStatus: LeadStatus.Won }),
        ]
    );

    public static readonly NetworkingEvent = new ActivityType(
        { id: 5, name: "Networking Event" }).addOutcomes(
        [
            new ActivityOutcome({ description: "Connection Made",  leadStatus: LeadStatus.Pursued }),
            new ActivityOutcome({ description: "No Interest",  leadStatus: LeadStatus.Lost }),
            new ActivityOutcome({ description: "Meeting Scheduled", leadStatus: LeadStatus.Pursued }),
            new ActivityOutcome({ description: "Handoff To Client", leadStatus: LeadStatus.Won }),
        ]
    );

    public static readonly SocialMediaEngagement = new ActivityType(
        { id: 6, name: "Social Media Engagement" }).addOutcomes(
        [
            new ActivityOutcome({ description: "Post Liked",  leadStatus: LeadStatus.Pursued }),
            new ActivityOutcome({ description: "Post Commented",  leadStatus: LeadStatus.Pursued }),
            new ActivityOutcome({ description: "Request Sent",  leadStatus: LeadStatus.Pursued }),
            new ActivityOutcome({ description: "Confirmed Activity",  leadStatus: LeadStatus.Pursued }),
            new ActivityOutcome({ description: "Negative Feedback",  leadStatus: LeadStatus.Lost }),
            new ActivityOutcome({ description: "Direct Message - Won",  leadStatus: LeadStatus.Won }),
            new ActivityOutcome({ description: "Direct Message - Lost",  leadStatus: LeadStatus.Lost }),
        ]
    );

    public static readonly ProposalSubmission = new ActivityType(
        { id: 7, name: "Proposal Submission" }).addOutcomes(
        [
            new ActivityOutcome({ description: "Proposal Accepted",  leadStatus: LeadStatus.Won }),
            new ActivityOutcome({ description: "Proposal Rejected",  leadStatus: LeadStatus.Lost }),
            new ActivityOutcome({ description: "Awaiting Response",  leadStatus: LeadStatus.Pursued }),
        ]
    );

    public static readonly FollowUp = new ActivityType(
        { id: 8, name: "Follow-Up" }).addOutcomes(
        [
            new ActivityOutcome({ description: "Follow-Up Successful",  leadStatus: LeadStatus.Pursued }),
            new ActivityOutcome({ description: "Follow-Up Unsuccessful",  leadStatus: LeadStatus.Pursued }),
            new ActivityOutcome({ description: "Client Uninterested",  leadStatus: LeadStatus.Lost }),
            new ActivityOutcome({ description: "Client Interested",  leadStatus: LeadStatus.Won }),
        ]
    );

    public static readonly ContractNegotiation = new ActivityType(
        { id: 9, name: "Contract Negotiation" }).addOutcomes(
        [
            new ActivityOutcome({ description: "Contract Finalized",  leadStatus: LeadStatus.Won }),
            new ActivityOutcome({ description: "Negotiations Failed",  leadStatus: LeadStatus.Lost }),
            new ActivityOutcome({ description: "Client Requested Revisions",  leadStatus: LeadStatus.Pursued }),
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

    // Derived,
    // Open -> No outcome, not overdue
    // Complete -> Outcome attached
    // Overdue -> No outcome, rules.overdue > 0

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
