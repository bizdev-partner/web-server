import { ValueObject } from "@vannatta-software/ts-domain";
import { Schema } from "@vannatta-software/ts-core";

export class Name extends ValueObject {
    @Schema({ type: String })
    public firstName: string;

    @Schema({ type: String })
    public lastName: string;

    constructor(props: Partial<Name>) {
        super();
        this.firstName = props.firstName || "";
        this.lastName = props.lastName || "";
    }

    /**
     * Converts the Name to a full string representation.
     * @returns The full name as "FirstName LastName".
     */
    public toString(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    /**
     * Compares two Name objects for equality.
     * @param other The other Name object to compare.
     * @returns True if equal, otherwise false.
     */
    public equals(other: Name): boolean {
        return (
            this.firstName === other.firstName && this.lastName === other.lastName
        );
    }

    protected *getAtomicValues(): IterableIterator<any> {
        yield this.firstName;
        yield this.lastName;
    }
}
