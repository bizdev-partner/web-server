import { Enumeration } from "@vannatta-software/ts-domain";

export class ClientStatus extends Enumeration {
    public static Active = new ClientStatus({ id: 1, name: "Active" });
    public static Inactive = new ClientStatus({ id: 2, name: "Inactive" });

    constructor(partial: Partial<ClientStatus>) {
        super(partial);
    }

    protected *getAtomicValues(): IterableIterator<any> {
        yield this.id;
        yield this.name;
    }
}
