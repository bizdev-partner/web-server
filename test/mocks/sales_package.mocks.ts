import { ISalesPackageRepository } from "@domain/sales_package/ISalesPackageRepository";
import { ISalesPackageService } from "@domain/sales_package/ISalesPackageService";
import { SalesPackage } from "@domain/sales_package/SalesPackage";
import { GlobalIdentifier, UniqueIdentifier } from "@vannatta-software/ts-domain";
import * as Contracts from "@domain/sales_package/contracts"
import { Note } from "@domain/common/Note";
import { Pricing } from "@domain/sales_package/Pricing";
import { Validity } from "@domain/sales_package/Validity";

export class MockSalesPackageRepository implements ISalesPackageRepository {
    private salesPackages: Map<string, SalesPackage> = new Map();

    async save(salesPackage: SalesPackage): Promise<void> {
        this.salesPackages.set(salesPackage.id.value, salesPackage);
    }

    async findById(packageId: GlobalIdentifier): Promise<SalesPackage | undefined> {
        return this.salesPackages.get(packageId.value);
    }

    async findByWorkflowId(workflowId: UniqueIdentifier): Promise<SalesPackage[]> {
        return Array.from(this.salesPackages.values()).filter(
            (salesPackage) => salesPackage.workflowId.value === workflowId.value
        );
    }

    async getAll(filter?: Record<string, any>): Promise<SalesPackage[]> {
        return Array.from(this.salesPackages.values()).filter((pkg) => {
            if (filter?.workflowId) {
                return pkg.workflowId.value === filter.workflowId;
            }
            return true;
        });
    }    

    async delete(packageId: GlobalIdentifier): Promise<void> {
        this.salesPackages.delete(packageId.value);
    }
}


export class MockSalesPackageService implements ISalesPackageService {
    private repository: ISalesPackageRepository;

    constructor(repository: ISalesPackageRepository = new MockSalesPackageRepository()) {
        this.repository = repository;
    }

    async createPackage(command: Contracts.ICreatePackageCommand): Promise<SalesPackage> {
        const salesPackage = new SalesPackage({
            name: command.name,
            workflowId: new UniqueIdentifier({ value: command.workflowId }),
            leads: command.leads.map((leadId) => new UniqueIdentifier({ value: leadId })),
            pricing: new Pricing( {
                basePrice: command.basePrice,
                discount: command.discount,
            }),
            validity: new Validity({
                startDate: command.startDate,
                endDate: command.endDate,
            }),
            feedback: [],
        });

        await this.repository.save(salesPackage);
        return salesPackage;
    }

    async updatePackage(command: Contracts.IUpdatePackageCommand): Promise<SalesPackage> {
        const salesPackage = await this.repository.findById(new GlobalIdentifier(command.packageId));
        if (!salesPackage) {
            throw new Error(`SalesPackage with ID ${command.packageId} not found.`);
        }
    
        Object.assign(salesPackage, command.updatedFields);
        await this.repository.save(salesPackage);
    
        return salesPackage;
    }    

    async addFeedback(command: Contracts.IAddFeedbackCommand): Promise<Note[]> {
        const salesPackage = await this.repository.findById(new GlobalIdentifier(command.packageId));
        if (!salesPackage) {
            throw new Error(`SalesPackage with ID ${command.packageId} not found.`);
        }

        const note = new Note({
            content: command.content,
            authorId: command.authorId,
            tags: command.tags,
        });

        salesPackage.feedback.push(note);

        await this.repository.save(salesPackage);
        return salesPackage.feedback;
    }

    async deletePackage(command: Contracts.IDeletePackageCommand): Promise<void> {
        const salesPackage = await this.repository.findById(new GlobalIdentifier(command.packageId));
        if (!salesPackage) {
            throw new Error(`SalesPackage with ID ${command.packageId} not found.`);
        }

        await this.repository.delete(new GlobalIdentifier(command.packageId));
    }

    async getPackageDetails(query: Contracts.IGetPackageDetailsQuery): Promise<SalesPackage> {
        const salesPackage = await this.repository.findById(new GlobalIdentifier(query.packageId));
        if (!salesPackage) {
            throw new Error(`SalesPackage with ID ${query.packageId} not found.`);
        }

        return salesPackage;
    }

    async listPackages(query: Contracts.IListPackagesQuery): Promise<SalesPackage[]> {
        return this.repository.getAll(query.filter);
    }
}

