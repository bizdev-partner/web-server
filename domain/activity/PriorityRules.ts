import { ValueObject } from "@vannatta-software/ts-domain";

export class PriorityRules extends ValueObject {
    public pending: number = 0;
    public due: number = 0;
    public overdue: number = 0;

    constructor(rules: Partial<PriorityRules>) {
        super()

        this.pending = rules?.pending ?? 0;
        this.due = rules?.due ?? 0;
        this.overdue = rules?.overdue ?? 0;
    }

    protected *getAtomicValues(): IterableIterator<any> {
        yield this.pending;
        yield this.due;
        yield this.overdue;
    }
}