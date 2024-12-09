import { Client } from "@domain/client/Client";
import { MockClientRepository, MockClientService } from "../mocks/client.mocks";
import { GlobalIdentifier, UniqueIdentifier } from "@vannatta-software/ts-domain";
import { Note } from "@domain/common/Note";
import { ContactInfo } from "@domain/common/ContactInfo";
import { Name } from "@domain/common/Name";
import * as Contracts from "@domain/client/contracts";
import { ClientStatus } from "@domain/client/ClientStatus";

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

        it("should retrieve clients by status", async () => {
            const client1 = new Client({
                name: new Name({ firstName: "Jane", lastName: "Smith" }),
                contactInfo: new ContactInfo({ email: "jane.smith@example.com", phone: "123-456-7890" }),
                status: ClientStatus.Active,
                notes: [],
                salesPackages: [],
                activeCampaigns: [],
                tags: [],
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

            const activeClients = await repository.findByStatus(ClientStatus.Active.name);
            expect(activeClients).toEqual([client1]);
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
            const command = new Contracts.CreateClientCommand()

            command.name = new Name({ firstName: "Jane", lastName: "Doe" });
            command.contactInfo = new ContactInfo({ email: "jane.doe@example.com", phone: "123-456-7890" });
            command.notes = [ new Note({ content: "Important client", authorId: "user-1" })];
            command.tags = ["VIP"];

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

            const command = new Contracts.UpdateClientCommand()

            command.clientId = client.id.value;
            command.updatedFields = { tags: ["VIP"] };

            const updatedClient = await service.updateClient(command);

            expect(updatedClient.tags).toContain("VIP");
        });

        it("should delete a client", async () => {
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

            const command = new Contracts.DeleteClientCommand(client.id.value);
            await service.deleteClient(command);

            const retrievedClient = await repository.findById(client.id);
            expect(retrievedClient).toBeUndefined();
        });

        it("should associate a sales package with a client", async () => {
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

            const command = new Contracts.AssociateSalesPackageCommand()
                
            command.clientId = client.id.value;
            command.salesPackageId = "package-1";

            const updatedClient = await service.associateSalesPackage(command);

            expect(updatedClient.salesPackages).toHaveLength(1);
            expect(updatedClient.salesPackages[0].value).toBe("package-1");
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

            const query = new Contracts.ListClientsQuery();
            
            query.filter.tags = [ "VIP" ]
            
            const filteredClients = await service.listClients(query);

            expect(filteredClients).toEqual([client1]);
        });
    });
});
