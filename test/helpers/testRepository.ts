import { Entity } from "@vannatta-software/ts-domain";

export function testRepository<R extends Entity>(e: R, extra: object = {}) {
    return {
        findAll: jest.fn().mockResolvedValue([ e ]),
        findById: jest.fn().mockImplementation((id) => Promise.resolve(e)),
        insert: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        ...extra
      }
}