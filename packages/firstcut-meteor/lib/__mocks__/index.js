
//find stub examples here: https://github.com/orangecms/jest-meteor-stubs

let usersQueryResult = [];

export function __setUsersQueryResult(result) {
  usersQueryResult = result;
}

export const Meteor = {
  settings: {
    public: {
      s3bucket: 'testBucket', 
      s3: {}
    },
    email: {},
    lambda: {},
    slack: {}
  },
  users: {
    findOne: jest.fn().mockImplementation(() => usersQueryResult),
    find: jest.fn().mockImplementation(() => ({
      fetch: jest.fn().mockReturnValue(usersQueryResult),
      count: jest.fn(),
    })),
  },
  isServer: true,
  loginWithPassword: jest.fn(),
  loginWithFacebook: jest.fn(),
  methods: jest.fn(),
  call: jest.fn(),
  publish: jest.fn(),
  subscribe: jest.fn(),
  user: jest.fn(),
  userId: jest.fn().mockReturnValue('f00bar'),
  startup: jest.fn(),
  bindEnvironment: jest.fn(),
  wrapAsync: jest.fn(),
  Error: jest.fn(Error),
};

export const isDevelopment = () => true;

export const Mongo = {
  Collection: jest.fn().mockImplementation(() => ({
    _ensureIndex: (jest.fn()),
  })),
};

export const HTTP = {
  post: jest.fn(),
  get: jest.fn(),
};

export const ValidatedMethod = jest.fn();

export const Session = {};
