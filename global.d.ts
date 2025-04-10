export {};

declare global {
  interface Window {
    clevertap: {
      event: any[];
      profile: any[];
      account: any[];
      onUserLogin: any[];
      notifications: {
        push: (config: {
          titleText: string;
          bodyText: string;
          okButtonText: string;
          rejectButtonText: string;
          serviceWorkerPath: string;
        }) => void;
      };
      privacy: any[];
    };
  }
}
