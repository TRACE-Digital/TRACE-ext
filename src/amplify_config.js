const configuration = {
    Auth: {

        // REQUIRED - Amazon Cognito Region
        region: 'us-east-2',

        // OPTIONAL - Amazon Cognito User Pool ID
        userPoolId: 'us-east-2_kS3Rl0H4z',

        // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
        userPoolWebClientId: '24jufelj2nr0cbt52nv3l4vqep',

        // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
        mandatorySignIn: false,

        // // OPTIONAL - Configuration for cookie storage
        // // Note: if the secure flag is set to true, then the cookie transmission requires a secure protocol
        // cookieStorage: {
        // // REQUIRED - Cookie domain (only required if cookieStorage is provided)
        //     domain: window.location.host,
        // // OPTIONAL - Cookie path
        //     path: '/',
        // // OPTIONAL - Cookie expiration in days
        //     expires: 365,
        // // OPTIONAL - See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite
        //     // sameSite: "lax",
        // // OPTIONAL - Cookie secure flag
        // // Either true or false, indicating if the cookie transmission requires a secure protocol (https).
        //     secure: false
        // },

        // OPTIONAL - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
        authenticationFlowType: 'USER_PASSWORD_AUTH',

        // OPTIONAL - Manually set key value pairs that can be passed to Cognito Lambda Triggers
        // clientMetadata: { myCustomKey: 'myCustomValue' },
    }
};

export default configuration;