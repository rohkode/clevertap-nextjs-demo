import { useEffect, useState } from "react";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";

// Type declaration for clevertap
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

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function Home() {
  const [isInboxInitialized, setIsInboxInitialized] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const interval = setInterval(() => {
        const inbox = window.clevertap?.inbox;

        if (inbox?.initializeInbox) {
          inbox.initializeInbox();
          console.log("Web Inbox initialized.");
          setIsInboxInitialized(true);
          clearInterval(interval);
        }
      }, 200);

      if ("serviceWorker" in navigator) {
        navigator.serviceWorker
          .register("/clevertap-sw.js")
          .then((registration) => {
            console.log("Service Worker registered:", registration.scope);

            window.clevertap?.notifications?.push({
              titleText: "Would you like to receive Push Notifications?",
              bodyText:
                "We promise to only send you relevant content and give you updates on your transactions",
              okButtonText: "Yes",
              rejectButtonText: "No",
              serviceWorkerPath: "/clevertap-sw.js",
            });
          })
          .catch((error) => {
            console.error("Service Worker registration failed:", error);
          });
      }
    }
  }, []);

  const handleOnUserLogin = () => {
    window.clevertap?.onUserLogin?.push?.({
      Site: {
        Name: "Test-User-4",
        Identity: 4235342334,
        Email: "test.user.4@example.com",
        Phone: "+911234567894",
        Gender: "M",
        DOB: new Date("1997-09-16"),
        "MSG-email": true,
        "MSG-push": true,
        "MSG-sms": true,
        "MSG-whatsapp": true,
      },
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          window.clevertap?.getLocation?.(latitude, longitude);
          console.log("Location set via coordinates:", latitude, longitude);
        },
        (error) => {
          console.warn("Geolocation error:", error.message);
          window.clevertap?.getLocation?.();
          console.log("Fallback to auto location detection.");
        }
      );
    } else {
      window.clevertap?.getLocation?.();
      console.log("Geolocation not supported, using fallback.");
    }

    alert("onUserLogin event triggered!");
  };

  const handleCustomEvent = () => {
    window.clevertap?.event?.push?.("Web App Opened", {
      platform: "Next.js",
      page: "Home",
    });
    alert("Custom event triggered!");
  };

  const handleChargedEvent = () => {
    window.clevertap?.event?.push?.("Charged", {
      Amount: 300,
      "Payment mode": "Credit Card",
      "Charged ID": 240520133,
      Items: [
        { Category: "Books", "Book name": "The Millionaire Next Door", Quantity: 1 },
        { Category: "Books", "Book name": "Achieving Inner Zen", Quantity: 1 },
        { Category: "Books", "Book name": "Chuck It, Let's Do It", Quantity: 5 },
      ],
    });
    alert("Charged event triggered!");
  };

  const handleProfilePush = () => {
    window.clevertap?.profile?.push?.({
      Site: {
        "Favorite Sport": "Cricket",
        "Team Support": "India",
        "Active Player": true,
        "Matches Played": 27,
      },
    });
    alert("User profile pushed!");
  };

  const handleOpenInbox = () => {
    if (isInboxInitialized && window.clevertap?.inbox?.showInbox) {
      window.clevertap.inbox.showInbox();
    } else {
      alert("Inbox not initialized yet!");
    }
  };

  return (
    <div
      className={`${geistSans.className} ${geistMono.className} flex flex-col items-center justify-start min-h-screen bg-white dark:bg-black text-black dark:text-white pt-16 space-y-8`}
    >
      <div className="flex items-center space-x-4">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={120}
          height={30}
          priority
        />
        <span className="text-2xl font-semibold tracking-tight">CleverTap</span>
      </div>

      <div className="flex flex-col sm:flex-row flex-wrap gap-4 max-w-4xl justify-center">
        <button onClick={handleOnUserLogin} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
          Trigger onUserLogin
        </button>
        <button onClick={handleCustomEvent} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Trigger Custom Event
        </button>
        <button onClick={handleChargedEvent} className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
          Trigger Charged Event
        </button>
        <button onClick={handleProfilePush} className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition">
          Trigger Profile Push
        </button>
        <button onClick={handleOpenInbox} className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition">
          Open Web Inbox
        </button>
      </div>

      <div id="clevertap-inbox-container" className="inbox" />
    </div>
  );
}