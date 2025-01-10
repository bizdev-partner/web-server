import { ValueObject } from "@vannatta-software/ts-domain";
import { Schema } from "@vannatta-software/ts-core";

export class ContactInfo extends ValueObject {
    @Schema({ type: String, optional: true })
    public email?: string;

    @Schema({ type: String, optional: true })
    public phone?: string;

    @Schema({ type: String, optional: true })
    public company?: string;

    @Schema({ type: String, optional: true })
    public address?: string;

    constructor(props: Partial<ContactInfo>) {
        super();
        this.email = props.email || undefined;
        this.phone = props.phone || undefined;
        this.company = props.company || undefined;
        this.address = props.address || undefined;
    }

    /**
     * Validates the ContactInfo's email and phone.
     * @returns True if at least one contact method is provided, otherwise false.
     */
    public isValid(): boolean {
        return !!this.email || !!this.phone;
    }

    protected *getAtomicValues(): IterableIterator<any> {
        yield this.email;
        yield this.phone;
    }

    /**
     * Converts the ContactInfo to a readable string.
     * @returns A string representation of the email and phone.
     */
    public toString(): string {
        return `Email: ${this.email || "N/A"}, Phone: ${this.phone || "N/A"}`;
    }
}
