import { Enumeration } from "@vannatta-software/ts-domain";

export class CampaignStatus extends Enumeration {
    public static Planned = new CampaignStatus({ id: 1, name: "Planned" });
    public static Active = new CampaignStatus({ id: 2, name: "Active" });
    public static Paused = new CampaignStatus({ id: 3, name: "Paused" });
    public static Completed = new CampaignStatus({ id: 4, name: "Completed" });
    public static Cancelled = new CampaignStatus({ id: 5, name: "Cancelled" });

    constructor(partial: Partial<CampaignStatus>) {
        super(partial);
    }
}
