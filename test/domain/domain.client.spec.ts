import { Client } from "@domain/client/Client";
import { ClientStatus } from "@domain/client/ClientStatus";
import * as Contracts from "@domain/client/contracts";
import { ContactInfo } from "@domain/common/ContactInfo";
import { Name } from "@domain/common/Name";
import { Note } from "@domain/common/Note";
import { MockClientRepository, MockClientService } from "../mocks/client.mocks";

describe("Client Domain Tests", () => {
    let repository: MockClientRepository;
    let service: MockClientService;

    beforeEach(() => {
        repository = new MockClientRepository();
        service = new MockClientService(repository);
    });

    describe("MockClientRepository", () => {
        it("should save and retrieve a client by ID", async () => {
            const client = new Client({
                name: new Name({ firstName: "John", lastName: "Doe" }),
                contactInfo: new ContactInfo({ email: "john.doe@example.com", phone: "123-456-7890" }),
                status: ClientStatus.Active,
                notes: [],
                salesPackages: [],
                activeCampaigns: [],
                tags: ["VIP"],
            });

            await repository.save(client);
            const retrievedClient = await repository.findById(client.id);
            expect(retrievedClient).toEqual(client);
        });

        it("should delete a client by ID", async () => {
            const client = new Client({
                name: new Name({ firstName: "John", lastName: "Doe" }),
                contactInfo: new ContactInfo({ email: "john.doe@example.com", phone: "123-456-7890" }),
                status: ClientStatus.Active,
                notes: [],
                salesPackages: [],
                activeCampaigns: [],
                tags: [],
            });

            await repository.save(client);
            await repository.delete(client.id);
            const retrievedClient = await repository.findById(client.id);
            expect(retrievedClient).toBeUndefined();
        });
    });

    describe("MockClientService", () => {
        it("should create a new client", async () => {
            const command: Contracts.ICreateClientCommand = {
                name: new Name({ firstName: "Jane", lastName: "Doe" }),
                contactInfo: new ContactInfo({ email: "jane.doe@example.com", phone: "123-456-7890" }),
                notes: [new Note({ content: "Important client", authorId: "user-1" })],
                tags: ["VIP"],
            };

            const client = await service.createClient(command);
            expect(client.name.toString()).toBe("Jane Doe");
            expect(client.contactInfo.email).toBe("jane.doe@example.com");
            expect(client.tags).toContain("VIP");
        });

        it("should update a client", async () => {
            const client = new Client({
                name: new Name({ firstName: "John", lastName: "Doe" }),
                contactInfo: new ContactInfo({ email: "john.doe@example.com", phone: "123-456-7890" }),
                status: ClientStatus.Active,
                notes: [],
                salesPackages: [],
                activeCampaigns: [],
                tags: [],
            });

            await repository.save(client);

            const updatedClient = await service.updateClient({
                clientId: client.id.value,
                updatedFields: { tags: ["VIP"] },
            });

            expect(updatedClient.tags).toContain("VIP");
        });

        it("should list clients with filters", async () => {
            const client1 = new Client({
                name: new Name({ firstName: "Jane", lastName: "Doe" }),
                contactInfo: new ContactInfo({ email: "jane.doe@example.com", phone: "123-456-7890" }),
                status: ClientStatus.Active,
                notes: [],
                salesPackages: [],
                activeCampaigns: [],
                tags: ["VIP"],
            });

            const client2 = new Client({
                name: new Name({ firstName: "John", lastName: "Doe" }),
                contactInfo: new ContactInfo({ email: "john.doe@example.com", phone: "123-456-7890" }),
                status: ClientStatus.Inactive,
                notes: [],
                salesPackages: [],
                activeCampaigns: [],
                tags: [],
            });

            await repository.save(client1);
            await repository.save(client2);

            const filteredClients = await service.listClients({
                filter: { tags: ["VIP"] },
            });

            expect(filteredClients).toEqual([client1]);
        });
    });
});
