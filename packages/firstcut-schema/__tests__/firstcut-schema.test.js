
import FirstCutSchema from '../src';

const exampleSchema = new FirstCutSchema({
  properties: {
    content: {
      required: ['text'],
      properties: {
        text: { type: 'string' },
        as_user: { type: 'string' },
        link_names: { type: 'string' },
        mrkdwn: { type: 'boolean' },
      },
    },
    channel: { type: 'string' },
  },
});

describe('firstcut-schema', () => {
  it('validate should return null for correct validation', () => {
    const result = exampleSchema.validate({
      content: { text: 'text' },
      channel: 'channel',
    });
    expect(result).toBe(null);
  });
});
