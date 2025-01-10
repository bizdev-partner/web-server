import { Schema } from "@vannatta-software/ts-core";
import { ValueObject } from "@vannatta-software/ts-domain";

export class Note extends ValueObject {
    @Schema({ type: String })
    public content: string;

    @Schema({ type: String })
    public authorId: string;

    @Schema({ type: Date })
    public createdDate: Date;

    @Schema({ type: Array, items: String, optional: true })
    public tags?: string[];

    constructor(note?: Partial<Note>) {
        super();
        this.content = note?.content ?? "";
        this.authorId = note?.authorId ?? "";
        this.createdDate = note?.createdDate ? new Date(note.createdDate) : new Date();
        this.tags = note?.tags ?? [];
    }

    /**
     * Updates the note content or tags.
     * @param newContent - New content for the note (optional).
     * @param newTags - New tags for the note (optional).
     */
    public update(newContent?: string, newTags?: string[]): void {
        if (newContent) {
            this.content = newContent;
        }
        if (newTags) {
            this.tags = newTags;
        }
    }

    /**
     * Checks if the note contains a specific tag.
     * @param tag - Tag to check.
     * @returns True if the tag exists in the note; otherwise, false.
     */
    public hasTag(tag: string): boolean {
        return this.tags?.includes(tag) ?? false;
    }

    /**
     * Implements the required `getAtomicValues` for `ValueObject`.
     */
    protected *getAtomicValues(): IterableIterator<any> {
        yield this.content;
        yield this.authorId;
        yield this.createdDate;
        yield this.tags;
    }

    /**
     * Provides a string representation of the note.
     */
    public toString(): string {
        return `[Note] ${this.content} (Author: ${this.authorId}, Created: ${this.createdDate.toISOString()})`;
    }
}
