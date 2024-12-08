import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventPublisherService } from '../services/eventPublisher.service';
import { Entity } from '@vannatta-software/ts-domain';

@Injectable()
export abstract class BaseRepository<T extends Entity> {
    protected model: Model<T>;

    constructor(
        @InjectModel('ModelToken') model: Model<T>, // ModelToken will be replaced dynamically
        private eventPublisher: EventPublisherService
    ) {
        this.model = model;
    }

    async findAll(): Promise<T[]> {
        const docs = await this.model.find().exec();
        return docs.map(doc => new this.entityClass(doc)); // entityClass will be set in derived classes
    }

    async findById(id: string): Promise<T | null> {
        const doc = await this.model.findById(id).exec();
        return doc ? new this.entityClass(doc) : null; // Adjust for proper hydration if necessary
    }

    async insert(entity: T) {
        entity.create();

        await this.update(entity)
    }

    async update(entity: T): Promise<void> {
        const id = entity.id.value;
        const doc = entity.document; 

        await this.model.findByIdAndUpdate(id, doc, { upsert: true, new: true }).exec();

        this.eventPublisher.publishAll(entity);
    }

    async delete(entity: T): Promise<void> {
        await this.model.findByIdAndDelete(entity.id.value).exec(); 

        entity.delete(); 

        this.eventPublisher.publishAll(entity);
    }

    // Make sure to define entityClass in derived classes
    protected abstract get entityClass(): new (...args: any[]) => T;
}
