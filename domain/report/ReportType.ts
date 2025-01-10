import { Enumeration } from "@vannatta-software/ts-domain";

export class ReportType extends Enumeration {
    public static readonly ActivitySummary = new ReportType({ id: 1, name: "ActivitySummary" });
    public static readonly LeadStatusChanges = new ReportType({ id: 2, name: "LeadStatusChanges" });
    public static readonly WonLeads = new ReportType({ id: 3, name: "WonLeads" });

    constructor(type: Partial<ReportType>) {
        super(type)
    }
}

export class ReportFormat extends Enumeration {
    public static readonly PDF = new ReportFormat({ id: 1, name: "PDF" });
    public static readonly Excel = new ReportFormat({ id: 2, name: "Excel" });
    public static readonly HTML = new ReportFormat({ id: 3, name: "HTML" });
    public static readonly Dashboard = new ReportFormat({ id: 4, name: "Dashboard" });

    constructor(type: Partial<ReportFormat>) {
        super(type)
    }
}

export class ReportStatus extends Enumeration {
    public static readonly Pending = new ReportStatus({ id: 1, name: "Pending" });
    public static readonly InProgress = new ReportStatus({ id: 2, name: "InProgress" });
    public static readonly Completed = new ReportStatus({ id: 3, name: "Completed" });
    public static readonly Failed = new ReportStatus({ id: 4, name: "Failed" });

    constructor(type: Partial<ReportStatus>) {
        super(type)
    }
}
