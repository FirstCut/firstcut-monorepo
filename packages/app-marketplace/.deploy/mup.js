module.exports = {
  servers: {
    one: {
      host: '34.218.253.100',
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
      ROOT_URL: 'http://marketplace.firstcut.io',
      MONGO_URL: 'mongodb://firstcut:mate@ds137149.mlab.com:37149/firstcut-dev'
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
