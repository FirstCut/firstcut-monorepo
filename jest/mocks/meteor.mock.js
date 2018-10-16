exports.Meteor = {
  user: jest.fn(),
  loginWithPassword: jest.fn(),
  loginWithFacebook: jest.fn(),
  methods: jest.fn(),
  startup: jest.fn(),
  call: jest.fn(),
  subscribe: jest.fn(),
  publish: jest.fn(),
  settings: {
    public: {
      PLATFORM_ROOT_URL: 'http://82c2f41d.ngrok.io',
      PIPELINE_ROOT: 'http://82c2f41d.ngrok.io',
      environment: 'development',
      isPipelineDeployment: true,
      DEFAULT_TIMEZONE: 'America/Los_Angeles',
      s3bucket: 'firstcut-app-dev',
      source_footage_bucket: 'assets-in-transit-dev',
      target_footage_bucket: 'firstcut-editor-dev',
      footage_folder: 'footage-folders',
      test_email: 'lucyannerichards@gmail.com',
      salesforceRoot: 'https://firstcut.my.salesforce.com',
      intercom: {
        id: 'e9ee9b3u',
        allowAnonymous: true,
      },
      stripe: {
        PUBLIC_KEY: 'pk_test_TYooMQauvdEDq54NiTphI7jx',
      },
      s3: {
        key: 'AKIAJPWDGE5BVBYIZP3Q',
        region: 'us-west-2',
        assets_bucket: 'firstcut-app-dev',
      },
    },
    stripe: {
      SECRET: 'sk_test_4eC39HqLyjWDarjtT1zdp7dc',
    },
    slack: {
      client_id: '138116433079.355203473991',
      client_secret: '3d932b6c1d7d140c0bcf3db22f0244d5',
      verification_token: '4iMzyOpiS2a3LZlei6XeDO8c',
      api_token: 'xoxp-138116433079-272740758433-355262141607-81335d2a76d05637737f1f5e39f4cd56',
      oauth_token: 'xoxp-138116433079-272740758433-354156815490-6939e55392663d9c0faf3f813a07e43c',
    },
    	intercom: {
    		personalAccessToken: 'dG9rOmE5MzIyYTdhXzZlZjlfNDhjN19hNzE0X2VjMmZhMDQzYzUzNjoxOjA=',
      secret: 'FSwnKKjTNiOPE5yQ1InrZ9YVVJHciFb-1DLU7f31',
    	},
    oauth_credentials_user: 'pFtAkKcrLQG838bnw',
    twilio: {
      sid: 'AC47ea64834d57e800df7c052e33ddabd5',
      authToken: 'e37b1ff46b9ec44370cbc8973f9d6ea8',
    },
    email: {
      api_key: '18d159d0518371524c915f74ca2efc36c6d26257',
    },
    s3: {
      key: 'AKIAJPWDGE5BVBYIZP3Q',
      secret: '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',
      region: 'us-west-2',
    },
    lambda: {
      snippet_creator: 'videobot-serverless-dev-create_snippet',
      copy_footage: 'moveFootage',
    },
    cf_access_key: 'APKAJHM5KLOESP5FPPWA',
    fckey: '4HTCIgSVHBysOL02b3yFIG0aU3sT5ACu',
    	'galaxy.meteor.com': {
        	env: {
        PLAID_CLIENT_ID: '5b9708dc5d37d30015fd22e8',
        PLAID_SECRET: '5c1424e7c6fa8db0ba1c499e52b899',
        PLAID_PUBLIC_KEY: '6fa0368efe4d221058364069e8ab49',
        PLAID_ENV: 'sandbox',
         		MONGO_URL: 'mongodb://firstcut:mate@ds137149.mlab.com:37149/firstcut-dev',
        GOOGLE_CLIENT_ID: '233828260875-kfjiskdc5092oudle11bvi7ermisjtpr.apps.googleusercontent.com',
        GOOGLE_CLIENT_SECRET: 'dDEvld1JJQ6RCOjKsbvrR_uu',
         	},
       	},
  },
};
