import { Example } from "./Example";
import * as Contracts from './contracts';

export interface IExampleService {
    getAll(query: Contracts.GetAllExamplesQuery): Promise<Example[]>;
    getById(query: Contracts.GetExampleByIdQuery): Promise<Example>;
    create(command: Contracts.CreateExampleCommand): Promise<boolean>;
    delete(command: Contracts.DeleteExampleCommand): Promise<boolean>;
    updateVersion(command: Contracts.UpdateVersionCommand): Promise<boolean>;
}