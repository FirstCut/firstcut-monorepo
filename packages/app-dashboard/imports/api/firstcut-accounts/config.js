export default {
  google: {
    options: {
      forceApprovalPrompt: true,
      requestPermissions: ['https://www.googleapis.com/auth/calendar'],
      requestOfflineToken: true,
    },
  },
};
