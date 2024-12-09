import { Lead } from "@domain/lead/Lead";
import { LeadStatus } from "@domain/lead/LeadStatus";
import { Name } from "@domain/common/Name";
import { ContactInfo } from "@domain/common/ContactInfo";
import { Note } from "@domain/common/Note";
import { GlobalIdentifier } from "@vannatta-software/ts-domain";
import * as Contracts from "@domain/lead/contracts";
import { MockLeadRepository, MockLeadService } from "../mocks/lead.mocks";

describe("Lead Domain Tests", () => {
    let repository: MockLeadRepository;
    let service: MockLeadService;

    beforeEach(() => {
        repository = new MockLeadRepository();
        service = new MockLeadService(repository);
    });

    describe("MockLeadRepository", () => {
        it("should save and retrieve a lead by ID", async () => {
            const lead = new Lead({
                name: new Name({ firstName: "John", lastName: "Doe" }),
                contactInfo: new ContactInfo({ email: "john.doe@example.com", phone: "123-456-7890" }),
                status: LeadStatus.Known,
            });

            await repository.save(lead);

            const retrievedLead = await repository.findById(lead.id);
            expect(retrievedLead).toEqual(lead);
        });

        it("should delete a lead by ID", async () => {
            const lead = new Lead({
                name: new Name({ firstName: "John", lastName: "Doe" }),
                contactInfo: new ContactInfo({ email: "john.doe@example.com", phone: "123-456-7890" }),
                status: LeadStatus.Known,
            });

            await repository.save(lead);

            await repository.delete(lead.id);
            const retrievedLead = await repository.findById(lead.id);
            expect(retrievedLead).toBeUndefined();
        });
    });

    describe("MockLeadService", () => {
        it("should create a lead", async () => {
            const command: Contracts.ICreateLeadCommand = {
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                phone: "123-456-7890",
                notes: [new Note({ content: "Note 1", authorId: "12345" })],
                tags: ["VIP"],
            };

            const lead = await service.createLead(command);

            expect(lead.name.firstName).toBe("John");
            expect(lead.name.lastName).toBe("Doe");
            expect(lead.contactInfo.email).toBe("john.doe@example.com");
            expect(lead.contactInfo.phone).toBe("123-456-7890");
            expect(lead.notes[0].content).toBe("Note 1");
            expect(lead.tags).toEqual(["VIP"]);
            expect(lead.status).toEqual(LeadStatus.Known);
        });

        it("should update a lead", async () => {
            const lead = new Lead({
                name: new Name({ firstName: "John", lastName: "Doe" }),
                contactInfo: new ContactInfo({ email: "john.doe@example.com", phone: "123-456-7890" }),
                status: LeadStatus.Known,
            });

            await repository.save(lead);

            const updatedLead = await service.updateLead({
                leadId: lead.id.value,
                firstName: "Jonathan",
                tags: ["Updated"],
            });

            expect(updatedLead.name.firstName).toBe("Jonathan");
            expect(updatedLead.tags).toEqual(["Updated"]);
        });

        it("should update lead status", async () => {
            const lead = new Lead({
                name: new Name({ firstName: "John", lastName: "Doe" }),
                contactInfo: new ContactInfo({ email: "john.doe@example.com", phone: "123-456-7890" }),
                status: LeadStatus.Known,
            });

            await repository.save(lead);

            const updatedLead = await service.updateLeadStatus({
                leadId: lead.id.value,
                newStatus: "Won",
            });

            expect(updatedLead.status).toEqual(LeadStatus.Won);
        });

        it("should list leads with filters", async () => {
            const lead1 = new Lead({
                name: new Name({ firstName: "John", lastName: "Doe" }),
                contactInfo: new ContactInfo({ email: "john.doe@example.com", phone: "123-456-7890" }),
                status: LeadStatus.Known,
                tags: ["VIP"],
            });
            const lead2 = new Lead({
                name: new Name({ firstName: "Jane", lastName: "Doe" }),
                contactInfo: new ContactInfo({ email: "jane.doe@example.com", phone: "987-654-3210" }),
                status: LeadStatus.Won,
                tags: ["Standard"],
            });

            await repository.save(lead1);
            await repository.save(lead2);

            const leads = await service.listLeads({ status: "Known", tags: ["VIP"] });
            expect(leads).toEqual([lead1]);
        });
    });
});

