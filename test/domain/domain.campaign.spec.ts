import { Activity, ActivityStatus } from "@domain/activity";
import { Campaign } from "@domain/campaign/Campaign";
import { CampaignStatus } from "@domain/campaign/CampaignStatus";
import { UniqueIdentifier } from "@vannatta-software/ts-domain";
import { MockCampaignRepository, MockCampaignService } from "../mocks/campaign.mocks";

describe("Campaign Domain Tests", () => {
    let repository: MockCampaignRepository;
    let service: MockCampaignService;

    beforeEach(() => {
        repository = new MockCampaignRepository();
        service = new MockCampaignService(repository);
    });

    describe("MockCampaignRepository", () => {
        it("should save and retrieve a campaign by ID", async () => {
            const campaign = new Campaign({
                name: "Test Campaign",
                salesPackageId: new UniqueIdentifier({ value: "package-1" }),
                targetLeads: [new UniqueIdentifier({ value: "lead-1" })],
                workflowId: new UniqueIdentifier({ value: "workflow-1" }),
                activities: [],
                startDate: new Date(),
                endDate: new Date(),
                status: CampaignStatus.Planned,
                metrics: {
                    totalLeads: 1,
                    completedActivities: 0,
                    successfulOutcomes: 0,
                    failedOutcomes: 0,
                },
            });

            await repository.save(campaign);

            const retrievedCampaign = await repository.findById(campaign.id);
            expect(retrievedCampaign).toEqual(campaign);
        });

        it("should retrieve campaigns by status", async () => {
            const campaign1 = new Campaign({
                name: "Active Campaign",
                salesPackageId: new UniqueIdentifier({ value: "package-1" }),
                targetLeads: [],
                workflowId: new UniqueIdentifier({ value: "workflow-1" }),
                activities: [],
                startDate: new Date(),
                endDate: new Date(),
                status: CampaignStatus.Active,
                metrics: {
                    totalLeads: 0,
                    completedActivities: 0,
                    successfulOutcomes: 0,
                    failedOutcomes: 0,
                },
            });

            const campaign2 = new Campaign({
                name: "Planned Campaign",
                salesPackageId: new UniqueIdentifier({ value: "package-2" }),
                targetLeads: [],
                workflowId: new UniqueIdentifier({ value: "workflow-2" }),
                activities: [],
                startDate: new Date(),
                endDate: new Date(),
                status: CampaignStatus.Planned,
                metrics: {
                    totalLeads: 0,
                    completedActivities: 0,
                    successfulOutcomes: 0,
                    failedOutcomes: 0,
                },
            });

            await repository.save(campaign1);
            await repository.save(campaign2);

            const activeCampaigns = await repository.findByStatus(CampaignStatus.Active.name);
            expect(activeCampaigns).toEqual([campaign1]);
        });

        it("should delete a campaign by ID", async () => {
            const campaign = new Campaign({
                name: "Test Campaign",
                salesPackageId: new UniqueIdentifier({ value: "package-1" }),
                targetLeads: [],
                workflowId: new UniqueIdentifier({ value: "workflow-1" }),
                activities: [],
                startDate: new Date(),
                endDate: new Date(),
                status: CampaignStatus.Planned,
                metrics: {
                    totalLeads: 0,
                    completedActivities: 0,
                    successfulOutcomes: 0,
                    failedOutcomes: 0,
                },
            });

            await repository.save(campaign);
            await repository.delete(campaign.id);

            const retrievedCampaign = await repository.findById(campaign.id);
            expect(retrievedCampaign).toBeUndefined();
        });
    });

    describe("MockCampaignService", () => {
        it("should launch a campaign", async () => {
            const campaign = new Campaign({
                name: "Test Campaign",
                salesPackageId: new UniqueIdentifier({ value: "package-1" }),
                targetLeads: [],
                workflowId: new UniqueIdentifier({ value: "workflow-1" }),
                activities: [],
                startDate: new Date(),
                endDate: new Date(),
                status: CampaignStatus.Planned,
                metrics: {
                    totalLeads: 0,
                    completedActivities: 0,
                    successfulOutcomes: 0,
                    failedOutcomes: 0,
                },
            });

            await repository.save(campaign);

            const launchedCampaign = await service.launchCampaign({ 
                campaignId: campaign.id.value, 
                workflowId: campaign.workflowId.value, 
                salesPackageId: campaign.salesPackageId.value, 
                startDate: new Date(), 
                endDate: new Date(), 
                leads: [] 
            });
            expect(launchedCampaign.status).toBe(CampaignStatus.Active);
        });

        it("should track activity completion", async () => {
            const campaignActivity = new Activity({
                leadId: new UniqueIdentifier({ value: "lead-1" }),
                scheduledDate: new Date(),
                completionDate: null,
                outcome: null,
                status: ActivityStatus.Open,
            });

            const campaign = new Campaign({
                name: "Test Campaign",
                salesPackageId: new UniqueIdentifier({ value: "package-1" }),
                targetLeads: [],
                workflowId: new UniqueIdentifier({ value: "workflow-1" }),
                activities: [campaignActivity],
                startDate: new Date(),
                endDate: new Date(),
                status: CampaignStatus.Active,
                metrics: {
                    totalLeads: 1,
                    completedActivities: 0,
                    successfulOutcomes: 0,
                    failedOutcomes: 0,
                },
            });

            await repository.save(campaign);

            const updatedActivity = await service.trackActivityCompletion(campaignActivity.id);
            expect(updatedActivity.status).toBe(ActivityStatus.Complete);
        });

        it("should pause a campaign", async () => {
            const campaign = new Campaign({
                name: "Active Campaign",
                salesPackageId: new UniqueIdentifier({ value: "package-1" }),
                targetLeads: [],
                workflowId: new UniqueIdentifier({ value: "workflow-1" }),
                activities: [],
                startDate: new Date(),
                endDate: new Date(),
                status: CampaignStatus.Active,
                metrics: {
                    totalLeads: 0,
                    completedActivities: 0,
                    successfulOutcomes: 0,
                    failedOutcomes: 0,
                },
            });

            await repository.save(campaign);

            const pausedCampaign = await service.pauseCampaign({ campaignId: campaign.id.value });
            expect(pausedCampaign.status).toBe(CampaignStatus.Paused);
        });
    });
});
