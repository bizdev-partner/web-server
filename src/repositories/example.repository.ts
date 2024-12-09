import { Example } from '@domain/example';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventPublisherService } from '../services/eventPublisher.service';
import { BaseRepository } from './base.repository';

@Injectable()
export class ExampleRepository extends BaseRepository<Example> {
    constructor(
        @InjectModel(Example.name) exampleModel: Model<Example>,
        eventPublisherService: EventPublisherService
    ) {
        super(exampleModel, eventPublisherService);
    }

    protected get entityClass(): new (...args: any[]) => Example {
        return Example;
    }
}
