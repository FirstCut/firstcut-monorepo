
const Slack = jest.fn().mockImplementation(() => ({ postMessage: jest.fn() }));
export default Slack;
