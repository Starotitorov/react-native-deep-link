# react-native-deep-link

[![Build Status](https://travis-ci.org/Starotitorov/react-native-deep-link.svg?branch=master)](https://travis-ci.org/Starotitorov/react-native-deep-link)
[![npm version](https://img.shields.io/npm/v/react-native-deep-link.svg)](https://www.npmjs.com/package/react-native-deep-link)
[![NPM Downloads](https://img.shields.io/npm/dt/react-native-deep-link.svg)](https://www.npmjs.com/package/react-native-deep-link)

[![NPM](https://nodei.co/npm/react-native-deep-link.png)](https://nodei.co/npm/react-native-deep-link/)

React Native deep linking library.
If you need to handle deep links in your project, just create a schemes config, the package will do the rest!

* [Why do I need this package?](#why-do-i-need-this-package)
* [Installation](#installation)
* [Configuring Android](#configuring-android)
* [Configuring iOS](#configuring-ios)
* [Example](#example)
* [Usage](#usage)
* [API](#api)
* [Contributing](#contributing)
* [License](#license)

## Why do I need this package?

**This package allows you to handle deep links in React Native applications.
The package can be added to your project irrespective of what solution you are using for navigation,
what state management library you decided to use. I will try to provide some examples below
just to show why you may need this package.**

If you are using react-navigation, you should know that it supports deep linking out of the box,
**but sometimes this solution does not meet your needs well.** 

**React-navigation deep linking implementation only allows you to navigate user to some screen when application receives the url.
This package provides you an ability to decide how to handle the url by specifying your own handler in the config,
read the [docs](#usage) below.**

Also, in real applications it is a common practice to add navigation state to Redux.
**According to the react-navigation documentation, in this case you have to handle deep links manually,
react-native-deep-link provides a solution.**
Adding navigation to Redux gives you more control on the navigation state,
allows to dispatch navigation actions from your redux-thunk actions.

**The package does not require Redux as a dependency,
so you can use it in your React Native apps without Redux.**
For example, you can implement your own NavigationService
as it is described in [react-navigation docs](https://reactnavigation.org/docs/en/navigating-without-navigation-prop.html)
and use it in route callbacks, read the [docs](#usage) below.

## Installation

```
yarn add react-native-deep-link
# or with npm
# npm install --save react-native-deep-link
```

## Configuring Android

For instructions on how to add support for deep linking on Android, refer to [Enabling Deep Links for App Content - Add Intent Filters for Your Deep Links](https://developer.android.com/training/app-links/deep-linking.html#adding-filters).

If you wish to receive the intent in an existing instance of MainActivity, you may set the `launchMode` of MainActivity to `singleTask` in `AndroidManifest.xml`. See `<activity>` documentation for more information.

```
<activity
  android:name=".MainActivity"
  android:launchMode="singleTask">
```

## Configuring iOS

On iOS, you'll need to link `RCTLinking` to your project by following the steps described [here](https://facebook.github.io/react-native/docs/linking-libraries-ios.html#manual-linking). If you also want to listen to incoming app links during your app's execution, you'll need to add the following lines to your `*AppDelegate.m`:

```
// iOS 9.x or newer
#import <React/RCTLinkingManager.h>

- (BOOL)application:(UIApplication *)application
   openURL:(NSURL *)url
   options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:application openURL:url options:options];
}
```

If you're targeting iOS 8.x or older, you can use the following code instead:

```
// iOS 8.x or older
#import <React/RCTLinkingManager.h>

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
{
  return [RCTLinkingManager application:application openURL:url
                      sourceApplication:sourceApplication annotation:annotation];
}
```

If your app is using [Universal Links](https://developer.apple.com/library/content/documentation/General/Conceptual/AppSearch/UniversalLinks.html), you'll need to add the following code as well:

```
- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity
 restorationHandler:(void (^)(NSArray * _Nullable))restorationHandler
{
 return [RCTLinkingManager application:application
                  continueUserActivity:userActivity
                  restorationHandler:restorationHandler];
}
```

## Examples

An Example of usage this package in the Redux application available in the `example/` folder.

In the `NavigationServiceExample/` folder you can find an example of usage the package in the application without Redux.

## Usage

After installing the package, you need to follow a few simple steps:

1. Use `createDeepLinkingHandler` to get a higher order component, pass schemes config to this function.

```js
import { createDeepLinkingHandler } from 'react-native-deep-link';

/**
 * This function receives a result of url parsing,
 * you can find the structure of this object in the API docs below, and returns a function.
 * The returned function receives component props.
 */
const handleInvitationToChannel = ({ params: { channelId } }) => ({ dispatch }) => {
    // addCurrentUserToChannel is a redux-thunk action,
    // which was defined somewhere in the code.
    dispatch(addCurrentUserToChannel(channelId));
}

const schemes = [
    {
        name: 'example:',
        routes: [
            {
                expression: '/channels/:channelId',
                callback: handleInvitationToChannel
            }
        ]
    }
];

const withDeepLinking = createDeepLinkingHandler(schemes);
```

2. Use the higher-order component returned from `createDeepLinkingHandler`.

```js
export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withDeepLinking
)(App);
```

**That was it, you have added react-native-deep-link package to the project!**

Optionally, if you need to handle situations, when the url is not supported or a handler was not found for the url,
you can pass callbacks to withDeepLinking:

```js
import { createDeepLinkingHandler } from 'react-native-deep-link';

const App = createDeepLinkingHandler(schemes)(AppComponent);

class Root extends Component {
    render() {
        return (
            <App
                onGetInitialUrlError={err => console.log(err)}
                onCanOpenUrlError={err => console.log(err)}
                onUrlIsNotSupported={url => console.log(`The ${url} is not supported.`)}
                onCannotHandleUrl={url => console.log(`A handler for the ${url} was not found.`)}
            />
        );
    }
}
```

## API

`createDeepLinkingHandler` takes an array of schemes as a parameter. Each scheme should have a `name` and an array of `routes`.

Each route should have an `expression` and a `callback` to be invoked in case of successful matching of the url to the route specified using an `expression` property.
Follow the next pattern to specify named url parameters `:<parameter_name>`.
Examples: `/users/:userId`, `/conversations/:conversationId/messages/:messageId`.

Route `callback` is a higher-order function which receives the result of url parsing and returns a function.
This returned function receives component props.

A result of url parsing is an object with the next set of properties:
```js
{
    scheme: 'example:', // Scheme name
    route: '/colors/:color', // Route expression
    query: {}, // Query string parameters
    params: {} // Url parameters
}
```

`createDeepLinkingHandler` returns a higher order component,
the next props can be passed to this component:

Property              | Type     | Optional | Default     | Description
--------------------- | -------- | -------- | ----------- | -----------
onGetInitialUrlError  | function | true     | () => {}    | a callback, which will be called in case the application throws an error trying to get initial url. The function receives the error.
onCanOpenUrlError     | function | true     | () => {}    | a callback, which will be called in case the application throws an error trying to open url. The function receives the error.
onUrlIsNotSupported   | function | true     | () => {}    | a callback, which will be called in case the application does not support received url. The function receives the url.
onCannotHandleUrl     | function | true     | () => {}    | a callback, which will be called in case a handler for the given url was not specified. The function receives the url.

## Contributing

You are welcome! Create pull requests and help to improve the package.

## License

react-native-deep-link is licensed under the [MIT License](LICENSE).
