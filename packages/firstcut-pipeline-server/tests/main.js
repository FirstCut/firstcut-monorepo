import assert from "assert";

describe("firstcut-pipeline-server", function () {
  it("package.json has correct name", async function () {
    const { name } = await import("../package.json");
    assert.strictEqual(name, "firstcut-pipeline-server");
  });

  it("handles a POST to executePipelineEvent", async function () {
    HTTP.methods({
      'executePipelineEvent': function(data) {
        handleEvent.call(data, (result) => {
          console.log('In the response');
          console.log(result);
        });
      }
    });
  });

  if (Meteor.isClient) {
    it("client is not server", function () {
      assert.strictEqual(Meteor.isServer, false);
    });
  }

  if (Meteor.isServer) {
    it("server is not client", function () {
      assert.strictEqual(Meteor.isClient, false);
    });
  }
});
