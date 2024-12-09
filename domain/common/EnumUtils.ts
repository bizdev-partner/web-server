export class EnumUtils {
    /**
     * Retrieves all static instances of an enumeration class.
     * @param enumClass The enumeration class to extract static instances from.
     * @returns An array of all static instances of the enumeration class.
     */
    static all<T>(enumClass: new (...args: any[]) => T): T[] {
        const instances: T[] = [];
        const keys = Object.getOwnPropertyNames(enumClass);

        keys.forEach((key) => {
            const value = (enumClass as any)[key];
            if (value instanceof enumClass) {
                instances.push(value);
            }
        });

        return instances;
    }

    /**
     * Finds an enumeration instance by name.
     * @param enumClass The enumeration class to search.
     * @param name The name of the instance to find.
     * @returns The matching instance or throws an error if not found.
     */
    static fromName<T extends { name: string }>(
        enumClass: new (...args: any[]) => T,
        name: string
    ): T {
        if (!name) {
            throw new Error("No value was provided for the enum")
        }

        const allInstances = EnumUtils.all(enumClass);
        const instance = allInstances.find(
            (instance) => instance.name.toLowerCase() === name.toLowerCase()
        );

        if (!instance) {
            throw new Error(
                `No instance found with name: ${name}. Available: ${allInstances
                    .map((i) => i.name)
                    .join(", ")}`
            );
        }

        return instance;
    }

    /**
     * Retrieves the names of all static instances of an enumeration class.
     * @param enumClass The enumeration class to extract names from.
     * @returns An array of names of all static instances.
     */
    static names<T extends { name: string }>(enumClass: new (...args: any[]) => T): string[] {
        return EnumUtils.all(enumClass).map((instance) => instance.name);
    }
}
