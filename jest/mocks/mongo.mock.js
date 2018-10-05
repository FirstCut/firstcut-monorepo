exports.Mongo = {
  Collection: jest.fn().mockImplementation(() => ({
    attachSchema: jest.fn(),
    find: jest.fn().mockImplementation(() => ({ observe: jest.fn() })),
  })),
};
