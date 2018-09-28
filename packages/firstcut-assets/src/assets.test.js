
import sinon from 'sinon';
import Models from 'firstcut-models';

const sandbox = sinon.createSandbox({});

const stub = {
  _id: 'aHzrrAXD4dqwQ8Hje',
  fileSize: 1777502,
  name: 'IMG_20171222_204039.jpg',
  type: 'image/jpeg',
  extension: 'jpg',
  ext: 'jpg',
  mime: 'image/jpeg',
  versions: {
    original: {
      path: 'public/MWYgu4hBsj3ef5mHm.jpg',
      size: 38326,
      type: 'image/jpeg',
      extension: 'jpg',
      meta: {
        pipePath: 'branding/ACME_ky5zKCPwZCjubw3k9/Screen Shot 2018-05-10 at 5.36.15 PM.jpg-original-dkzKjxuuzb9sxLz5m.jpg',
      },
    },
  },
  history: [
    {
      event: 'record_created',
      initiator_player_id: 'u9tosohXhyxwdYxAw',
      timestamp: '2018-07-11T21:31:18.546Z',
    },
  ],
  createdBy: 'pFtAkKcrLQG838bnw',
  createdAt: '2018-07-11T21:31:18.309Z',
  updatedAt: '2018-07-11T21:31:18.549Z',
  meta: { root: 'branding/ACME_ky5zKCPwZCjubw3k9' },
};

describe('action', () => {
  before(() => {
  });

  after(() => {
  });

  it('should initialize from json properties correctly', () => {
    const asset = Models.Asset.createNew(stub);
    expect(asset.versions).to.deep.equal({
      original: {
        path: 'public/MWYgu4hBsj3ef5mHm.jpg',
        size: 38326,
        type: 'image/jpeg',
        extension: 'jpg',
        meta: {
          pipePath: 'branding/ACME_ky5zKCPwZCjubw3k9/Screen Shot 2018-05-10 at 5.36.15 PM.jpg-original-dkzKjxuuzb9sxLz5m.jpg',
        },
      },
    });
  });
});
