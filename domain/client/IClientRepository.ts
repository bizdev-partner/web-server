import { Client } from "./Client";
import { GlobalIdentifier, Repository, UniqueIdentifier } from "@vannatta-software/ts-domain";

export interface IClientRepository extends Repository<Client> {
    /**
     * Stores a new or updated client.
     * @param client The client to save.
     * @returns A promise resolving when the client is saved.
     */
    save(client: Client): Promise<void>;

    /**
     * Retrieves a client by its unique identifier.
     * @param clientId The unique identifier of the client.
     * @returns A promise resolving with the found client or undefined if not found.
     */
    findById(clientId: GlobalIdentifier): Promise<Client | undefined>;

    /**
     * Retrieves all clients with the specified status.
     * @param status The status of the clients to retrieve.
     * @returns A promise resolving with an array of clients with the specified status.
     */
    findByStatus(status: string): Promise<Client[]>;

    /**
     * Retrieves all clients with active campaigns.
     * @returns A promise resolving with an array of clients with active campaigns.
     */
    findWithActiveCampaigns(): Promise<Client[]>;

    /**
     * Retrieves all clients with associated sales packages.
     * @returns A promise resolving with an array of clients with associated sales packages.
     */
    findWithSalesPackages(): Promise<Client[]>;

    /**
     * Removes a client from the repository.
     * @param clientId The unique identifier of the client to remove.
     * @returns A promise resolving when the client is deleted.
     */
    delete(clientId: GlobalIdentifier): Promise<void>;

    getAll(): Promise<Client[]>
}
