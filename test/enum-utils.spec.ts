import { EnumUtils } from "@domain/common/EnumUtils";

class TestEnum {
    static First = new TestEnum({ id: 1, name: "First" });
    static Second = new TestEnum({ id: 2, name: "Second" });
    static Third = new TestEnum({ id: 3, name: "Third" });

    id: number;
    name: string;

    constructor(partial: Partial<TestEnum>) {
        this.id = partial.id!;
        this.name = partial.name!;
    }
}

describe("EnumUtils", () => {
    it("should retrieve all static instances of the enumeration class", () => {
        const allInstances = EnumUtils.all(TestEnum);

        expect(allInstances).toHaveLength(3);
        expect(allInstances).toEqual([
            TestEnum.First,
            TestEnum.Second,
            TestEnum.Third,
        ]);
    });

    it("should retrieve an enumeration instance by name", () => {
        const instance = EnumUtils.fromName(TestEnum, "Second");

        expect(instance).toEqual(TestEnum.Second);
    });

    it("should throw an error if no instance is found by name", () => {
        expect(() => EnumUtils.fromName(TestEnum, "NonExistent")).toThrow(
            "No instance found with name: NonExistent. Available: First, Second, Third"
        );
    });

    it("should retrieve all names of the enumeration instances", () => {
        const names = EnumUtils.names(TestEnum);

        expect(names).toEqual(["First", "Second", "Third"]);
    });
});
