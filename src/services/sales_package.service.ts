import { Injectable } from '@nestjs/common';
import { Note } from '@domain/common/Note';
import { GlobalIdentifier, UniqueIdentifier } from '@vannatta-software/ts-domain';
import { ISalesPackageService } from '@domain/sales_package/ISalesPackageService';
import { SalesPackageRepository } from 'src/repositories/sales_package.repository';
import * as Contracts from "@domain/sales_package/contracts"
import { SalesPackage } from '@domain/sales_package/SalesPackage';
import { Pricing } from '@domain/sales_package/Pricing';
import { Validity } from '@domain/sales_package/Validity';

@Injectable()
export class SalesPackageService implements ISalesPackageService {
    constructor(private readonly repository: SalesPackageRepository) {}

    async getPackageDetails(query: Contracts.IGetPackageDetailsQuery): Promise<SalesPackage> {
        const salesPackage = await this.repository.findById(query.packageId);
        if (!salesPackage) throw new Error('Sales Package not found');
        return salesPackage;
    }

    async listPackages(query: Contracts.IListPackagesQuery): Promise<SalesPackage[]> {
        if (query.filter && query.filter.workflowId) {
            return this.repository.findByWorkflowId(new UniqueIdentifier({ value: query.filter.workflowId }));
        }
        return this.repository.findAll();
    }

    async createPackage(command: Contracts.ICreatePackageCommand): Promise<SalesPackage> {
        const salesPackage = new SalesPackage({
            name: command.name,
            workflowId: new UniqueIdentifier({ value: command.workflowId }),
            leads: command.leads.map((leadId) => new UniqueIdentifier({ value: leadId })),
            pricing: new Pricing({ basePrice: command.basePrice, discount: command.discount }),
            validity: new Validity({ startDate: command.startDate, endDate: command.endDate }),
            feedback: [],
        });

        await this.repository.insert(salesPackage);
        return salesPackage;
    }

    async updatePackage(command: Contracts.IUpdatePackageCommand): Promise<SalesPackage> {
        const salesPackage = await this.getPackageDetails(command);
        salesPackage.name = command.updatedFields.name ?? salesPackage.name;
        salesPackage.pricing = new Pricing({ ...salesPackage.pricing, ...command.updatedFields.pricing });
        salesPackage.validity = new Validity({ ...salesPackage.validity, ...command.updatedFields });
        salesPackage.leads = command.updatedFields.leads?.map(leadId => new UniqueIdentifier({ value: leadId })) ?? salesPackage.leads;
        salesPackage.workflowId = new UniqueIdentifier({ value: command.updatedFields.workflowId ?? salesPackage.workflowId.value });
        await this.repository.update(salesPackage);
        return salesPackage;
    }

    async addFeedback(command: Contracts.IAddFeedbackCommand): Promise<Note[]> {
        const salesPackage = await this.getPackageDetails(command);
        salesPackage.feedback.push(new Note(command));
        await this.repository.update(salesPackage);
        return salesPackage.feedback;
    }

    async deletePackage(command: Contracts.IDeletePackageCommand): Promise<void> {
        var salesPackage = await this.repository.findById(command.packageId);

        await this.repository.delete(salesPackage);
    }
}
