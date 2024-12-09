import { SalesPackage } from "@domain/sales_package/SalesPackage";
import { Note } from "@domain/common/Note";
import { GlobalIdentifier, UniqueIdentifier } from "@vannatta-software/ts-domain";
import * as Contracts from "@domain/sales_package/contracts";
import { MockSalesPackageRepository, MockSalesPackageService } from "./mocks/sales_package.mocks";
import { Pricing } from "@domain/sales_package/Pricing";
import { Validity } from "@domain/sales_package/Validity";

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

        it("should retrieve sales packages by workflow ID", async () => {
            const workflowId = new UniqueIdentifier({ value: "workflow-1" });
            const package1 = new SalesPackage({
                name: "Package 1",
                workflowId,
                leads: [],
                pricing: new Pricing({ basePrice: 100, discount: 10 }),
                validity: new Validity({ startDate: new Date(), endDate: new Date() }),
                feedback: [],
            });
            const package2 = new SalesPackage({
                name: "Package 2",
                workflowId,
                leads: [],
                pricing: new Pricing({ basePrice: 150 }),
                validity: new Validity({ startDate: new Date(), endDate: new Date() }),
                feedback: [],
            });

            await repository.save(package1);
            await repository.save(package2);

            const packages = await repository.findByWorkflowId(workflowId);
            expect(packages).toEqual([package1, package2]);
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

        it("should retrieve all sales packages with filters", async () => {
            const package1 = new SalesPackage({
                name: "Package 1",
                workflowId: new UniqueIdentifier({ value: "workflow-1" }),
                leads: [],
                pricing: new Pricing({ basePrice: 100, discount: 10 }),
                validity: new Validity({ startDate: new Date(), endDate: new Date() }),
                feedback: [],
            });
            const package2 = new SalesPackage({
                name: "Package 2",
                workflowId: new UniqueIdentifier({ value: "workflow-2" }),
                leads: [],
                pricing: new Pricing({ basePrice: 150 }),
                validity: new Validity({ startDate: new Date(), endDate: new Date() }),
                feedback: [],
            });

            await repository.save(package1);
            await repository.save(package2);

            const packages = await repository.getAll({ workflowId: "workflow-1" });
            expect(packages).toEqual([package1]);
        });
    });

    describe("MockSalesPackageService", () => {
        it("should create a sales package", async () => {
            const command = new Contracts.CreatePackageCommand();
            command.name = "Test Package";
            command.workflowId = "workflow-1";
            command.leads = [];
            command.basePrice = 200;
            command.discount = 20;
            command.startDate = new Date();
            command.endDate = new Date();

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

            const command = new Contracts.UpdatePackageCommand();
            command.packageId = salesPackage.id.value;
            command.updatedFields = { 
                name: "Updated Package", 
                pricing: new Pricing({ basePrice: 150, discount: 10 }) 
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

            const command = new Contracts.AddFeedbackCommand();
            command.packageId = salesPackage.id.value;
            command.content = "Great package!";
            command.authorId = "user-1" ;

            const feedback = await service.addFeedback(command);

            expect(feedback).toHaveLength(1);
            expect(feedback[0].content).toBe("Great package!");
        });

        it("should delete a sales package", async () => {
            const salesPackage = new SalesPackage({
                name: "Test Package",
                workflowId: new UniqueIdentifier({ value: "workflow-1" }),
                leads: [],
                pricing: new Pricing({ basePrice: 100, discount: 10 }),
                validity: new Validity({ startDate: new Date(), endDate: new Date() }),
                feedback: [],
            });

            await repository.save(salesPackage);

            const command = new Contracts.DeletePackageCommand(salesPackage.id.value);
            await service.deletePackage(command);

            const retrievedPackage = await repository.findById(salesPackage.id);
            expect(retrievedPackage).toBeUndefined();
        });

        it("should list sales packages with filters", async () => {
            const package1 = new SalesPackage({
                name: "Package 1",
                workflowId: new UniqueIdentifier({ value: "workflow-1" }),
                leads: [],
                pricing: new Pricing({ basePrice: 100, discount: 10 }),
                validity: new Validity({ startDate: new Date(), endDate: new Date() }),
                feedback: [],
            });
            const package2 = new SalesPackage({
                name: "Package 2",
                workflowId: new UniqueIdentifier({ value: "workflow-2" }),
                leads: [],
                pricing: new Pricing({ basePrice: 150 }),
                validity: new Validity({ startDate: new Date(), endDate: new Date() }),
                feedback: [],
            });

            await repository.save(package1);
            await repository.save(package2);

            const query = new Contracts.ListPackagesQuery();
            query.filter = { workflowId: "workflow-1" };

            const packages = await service.listPackages(query);

            expect(packages).toEqual([package1]);
        });
    });
});
