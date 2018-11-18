module.exports = {
  servers: {
    one: {
      host: '34.222.12.148',
      username: 'ubuntu',
      pem: '~/Scripts/lucys_fc_ec2_pem.pem'
    }
  },

  app: {
    name: 'marketplace',
    path: '../',

    servers: {
      one: {},
    },

    buildOptions: {
      serverOnly: true,
    },

    env: {
      ROOT_URL: 'http://34.222.12.148',
     	MONGO_URL: "mongodb://mate:firstcut33@ds145711-a0.mlab.com:45711,ds145711-a1.mlab.com:45711/firstcut?replicaSet=rs-ds145711",
      MONGO_OPLOG_URL: "mongodb://oplog-reader:firstcut123@ds145711-a0.mlab.com:45711,ds145711-a1.mlab.com:45711/local?replicaSet=rs-ds145711&authSource=admin",
      GOOGLE_CLIENT_ID: "233828260875-kfjiskdc5092oudle11bvi7ermisjtpr.apps.googleusercontent.com",
      GOOGLE_CLIENT_SECRET: "dDEvld1JJQ6RCOjKsbvrR_uu"
    },

    docker: {
      image: 'abernix/meteord:node-8.4.0-base',
    },

    // Show progress bar while uploading bundle to server
    // You might need to disable it on CI servers
    enableUploadProgressBar: true
  },

  // (Optional)
  // Use the proxy to setup ssl or to route requests to the correct
  // app when there are several apps

  // proxy: {
  //   domains: 'mywebsite.com,www.mywebsite.com',

  //   ssl: {
  //     // Enable Let's Encrypt
  //     letsEncryptEmail: 'email@domain.com'
  //   }
  // }
};
