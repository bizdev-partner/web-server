import { Client } from "./Client";
import { Note } from "../common/Note";
import { GlobalIdentifier, UniqueIdentifier } from "@vannatta-software/ts-domain";
import * as Contracts from "./contracts";

export interface IClientService {
    /**
     * Validates and creates a new client.
     * @param command The command containing details to create a client.
     * @returns The created client.
     */
    createClient(command: Contracts.ICreateClientCommand): Promise<Client>;

    /**
     * Updates client details and propagates changes as needed.
     * @param command The command containing details to update a client.
     * @returns The updated client.
     */
    updateClient(command: Contracts.IUpdateClientCommand): Promise<Client>;

    /**
     * Deletes a client and performs necessary cleanup.
     * @param command The command containing details to delete a client.
     * @returns A promise resolving when the client is deleted.
     */
    deleteClient(command: Contracts.IDeleteClientCommand): Promise<void>;

    /**
     * Associates a sales package with a client.
     * @param command The command containing details to associate a sales package with a client.
     * @returns The updated client.
     */
    associateSalesPackage(command: Contracts.IAssociateSalesPackageCommand): Promise<Client>;

    /**
     * Associates a campaign with a client.
     * @param command The command containing details to associate a campaign with a client.
     * @returns The updated client.
     */
    associateCampaign(command: Contracts.IAssociateCampaignCommand): Promise<Client>;

    /**
     * Retrieves detailed information about a client.
     * @param query The query containing the client ID to retrieve details for.
     * @returns The detailed client.
     */
    getClientDetails(query: Contracts.IGetClientDetailsQuery): Promise<Client>;

    /**
     * Retrieves a list of clients, optionally filtered by status.
     * @param query The query containing the optional status filter.
     * @returns A list of clients matching the filter.
     */
    listClients(query: Contracts.IListClientsQuery): Promise<Client[]>;

    /**
     * Retrieves the sales packages associated with a client.
     * @param query The query containing the client ID to retrieve sales packages for.
     * @returns A list of sales packages associated with the client.
     */
    getClientSalesPackages(query: Contracts.IGetClientSalesPackagesQuery): Promise<UniqueIdentifier[]>;

    /**
     * Retrieves the campaigns associated with a client.
     * @param query The query containing the client ID to retrieve campaigns for.
     * @returns A list of campaigns associated with the client.
     */
    getClientCampaigns(query: Contracts.IGetClientCampaignsQuery): Promise<UniqueIdentifier[]>;

    /**
     * Adds a note to a client's notes array.
     * @param clientId The unique identifier of the client.
     * @param note The note to add.
     * @returns The updated client.
     */
    addNoteToClient(clientId: GlobalIdentifier, note: Note): Promise<Client>;
}

