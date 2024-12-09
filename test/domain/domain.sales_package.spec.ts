import * as Contracts from "@domain/sales_package/contracts";
import { Pricing } from "@domain/sales_package/Pricing";
import { SalesPackage } from "@domain/sales_package/SalesPackage";
import { Validity } from "@domain/sales_package/Validity";
import { UniqueIdentifier } from "@vannatta-software/ts-domain";
import { MockSalesPackageRepository, MockSalesPackageService } from "../mocks/sales_package.mocks";

describe("SalesPackage Domain Tests", () => {
    let repository: MockSalesPackageRepository;
    let service: MockSalesPackageService;

    beforeEach(() => {
        repository = new MockSalesPackageRepository();
        service = new MockSalesPackageService(repository);
    });

    describe("MockSalesPackageRepository", () => {
        it("should save and retrieve a sales package by ID", async () => {
            const salesPackage = new SalesPackage({
                name: "Test Package",
                workflowId: new UniqueIdentifier({ value: "workflow-1" }),
                leads: [],
                pricing: new Pricing({ basePrice: 100, discount: 10 }),
                validity: new Validity({ startDate: new Date(), endDate: new Date() }),
                feedback: [],
            });

            await repository.save(salesPackage);
            const retrievedPackage = await repository.findById(salesPackage.id);
            expect(retrievedPackage).toEqual(salesPackage);
        });

        it("should delete a sales package by ID", async () => {
            const salesPackage = new SalesPackage({
                name: "Test Package",
                workflowId: new UniqueIdentifier({ value: "workflow-1" }),
                leads: [],
                pricing: new Pricing({ basePrice: 100, discount: 10 }),
                validity: new Validity({ startDate: new Date(), endDate: new Date() }),
                feedback: [],
            });

            await repository.save(salesPackage);
            await repository.delete(salesPackage.id);

            const retrievedPackage = await repository.findById(salesPackage.id);
            expect(retrievedPackage).toBeUndefined();
        });
    });

    describe("MockSalesPackageService", () => {
        it("should create a sales package", async () => {
            const command: Contracts.ICreatePackageCommand = {
                name: "Test Package",
                workflowId: "workflow-1",
                leads: [],
                basePrice: 200,
                discount: 20,
                startDate: new Date(),
                endDate: new Date(),
            };

            const salesPackage = await service.createPackage(command);

            expect(salesPackage.name).toBe("Test Package");
            expect(salesPackage.workflowId.value).toBe("workflow-1");
            expect(salesPackage.pricing.basePrice).toBe(200);
            expect(salesPackage.pricing.discount).toBe(20);
        });

        it("should update a sales package", async () => {
            const salesPackage = new SalesPackage({
                name: "Test Package",
                workflowId: new UniqueIdentifier({ value: "workflow-1" }),
                leads: [],
                pricing: new Pricing({ basePrice: 100, discount: 10 }),
                validity: new Validity({ startDate: new Date(), endDate: new Date() }),
                feedback: [],
            });

            await repository.save(salesPackage);

            const command: Contracts.IUpdatePackageCommand = {
                packageId: salesPackage.id.value,
                updatedFields: { name: "Updated Package", pricing: { basePrice: 150 } },
            };

            const updatedPackage = await service.updatePackage(command);

            expect(updatedPackage.name).toBe("Updated Package");
            expect(updatedPackage.pricing.basePrice).toBe(150);
        });

        it("should add feedback to a sales package", async () => {
            const salesPackage = new SalesPackage({
                name: "Test Package",
                workflowId: new UniqueIdentifier({ value: "workflow-1" }),
                leads: [],
                pricing: new Pricing({ basePrice: 100, discount: 10 }),
                validity: new Validity({ startDate: new Date(), endDate: new Date() }),
                feedback: [],
            });

            await repository.save(salesPackage);

            const command: Contracts.IAddFeedbackCommand = {
                packageId: salesPackage.id.value,
                content: "Great package!",
                authorId: "user-1",
                tags: ["Positive"],
            };

            const feedback = await service.addFeedback(command);

            expect(feedback).toHaveLength(1);
            expect(feedback[0].content).toBe("Great package!");
        });
    });
});
