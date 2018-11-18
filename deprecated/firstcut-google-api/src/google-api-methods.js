export function initApiMethods() {
  Meteor.methods({
  // Obtain a new access token using the refresh token
    checkOauthCredentials() {
      const config = Accounts.loginServiceConfiguration.findOne({ service: 'google' });
      const params = {
        client_id: config.clientId,
        scope: 'https://www.googleapis.com/auth/calendar',
        response_type: 'code',
        redirect_uri: 'http://localhost:3000/_oauth/google',
      };
      const auth_url = 'https://accounts.google.com/o/oauth2/v2/auth';
      try {
        const result = HTTP.call('POST', auth_url, { params });
      } catch (e) {
        if (e) {
          const code = e.response ? e.response.statusCode : 500;
          throw new Meteor.Error(code, 'Unable to verify google oauth credentials.', e.response);
        }
      }
    },

    exchangeRefreshToken(userId) {
      this.unblock();

      if (this.connection) { // when called from client
        if (this.userId) {
          userId = this.userId;
        } else {
          throw new Meteor.Error(403, 'Must be signed in to use Google API.');
        }
      }

      let user;
      if (userId && Meteor.isServer) {
        user = Meteor.users.findOne({ _id: userId });
      } else {
        user = Meteor.user();
      }

      const config = Accounts.loginServiceConfiguration.findOne({ service: 'google' });
      if (!config) throw new Meteor.Error(500, 'Google service not configured.');

      if (!user.services || !user.services.google || !user.services.google.refreshToken) throw new Meteor.Error(500, 'Refresh token not found.');

      try {
        var result = HTTP.call('POST',
          'https://accounts.google.com/o/oauth2/token',
          {
            params: {
              client_id: config.clientId,
              client_secret: config.secret,
              refresh_token: user.services.google.refreshToken,
              grant_type: 'refresh_token',
            },
          });
      } catch (e) {
        const code = e.response ? e.response.statusCode : 500;
        throw new Meteor.Error(code, 'Unable to exchange google refresh token.', e.response);
      }

      if (result.statusCode === 200) {
      // console.log('success');
      // console.log(EJSON.stringify(result.data));

        Meteor.users.update(user._id, {
          $set: {
            'services.google.accessToken': result.data.access_token,
            'services.google.expiresAt': (+new Date()) + (1000 * result.data.expires_in),
          },
        });

        return result.data;
      }
      throw new Meteor.Error(result.statusCode, 'Unable to exchange google refresh token.', result);
    },
  });
}
