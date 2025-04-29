declare global {
  interface Window {
    clevertap?: {
      inbox?: {
        showInbox?: () => void;
        initializeInbox?: () => void;
      };
      notifications?: {
        push: (config: {
          titleText: string;
          bodyText: string;
          okButtonText: string;
          rejectButtonText: string;
          serviceWorkerPath: string;
        }) => void;
      };
      event?: { push: (eventName: string, eventProps?: any) => void };
      profile?: { push: (profileData: any) => void };
      onUserLogin?: { push: (profileData: any) => void };
      getLocation?: (lat?: number, lon?: number) => void;
    };
  }
}