import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        {/* CleverTap Web SDK */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              var clevertap = {event:[], profile:[], account:[], onUserLogin:[], notifications:[], privacy:[]};
              clevertap.account.push({"id": "886-85W-7Z7Z"}, "eu1");
              clevertap.privacy.push({optOut: false});
              clevertap.privacy.push({useIP: true});
              (function () {
                var wzrk = document.createElement('script');
                wzrk.type = 'text/javascript';
                wzrk.async = true;
                wzrk.src = (document.location.protocol === 'https:' ? 
                            'https://d2r1yp2w7bby2u.cloudfront.net' : 
                            'http://static.clevertap.com') + '/js/clevertap.min.js';
                var s = document.getElementsByTagName('script')[0];
                s.parentNode.insertBefore(wzrk, s);
              })();
            `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}