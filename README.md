# react-native-deep-link

[![Build Status](https://travis-ci.org/Starotitorov/react-native-deep-link.svg?branch=master)](https://travis-ci.org/Starotitorov/react-native-deep-link)
[![npm version](https://img.shields.io/npm/v/react-native-deep-link.svg)](https://www.npmjs.com/package/react-native-deep-link)
[![NPM Downloads](https://img.shields.io/npm/dt/react-native-deep-link.svg)](https://www.npmjs.com/package/react-native-deep-link)

[![NPM](https://nodei.co/npm/react-native-deep-link.png)](https://nodei.co/npm/react-native-deep-link/)

React Native deep linking library.
If you need to handle deep links in your project, just create a routes config, the package will do the rest!

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

**First of all, this is a package for React Native applications.
You can use it irrespective of what solution you are using for navigation in our project,
what state management library you have added to the project. I will try to provide some examples below
just to show why you may need this package.**

If you are using react-navigation, you should know that it supports deep linking out of the box,
**but sometimes this solution does not meet your needs well.** 

**React-navigation deep linking implementation only allows you to navigate user to some screen when application receives the url.
This package provides you an ability to decide how to handle the url by specifying your own handler in the routes config,
read the [docs](#usage) below.**

Also, it is a common practice to add navigation state to redux.
**In this case, you have to handle deep links manually**.
**This package solves the problem, provides ready to use solution.**
Adding navigation to redux gives you more control on the navigation state,
allows to dispatch navigation actions from your redux-thunk actions.

**In general, this package does not require Redux as a dependency,
so you can use it in your React Native apps without Redux.**
For example, you can implement your own NavigationService
as it is described in [react-navigation docs](https://reactnavigation.org/docs/en/navigating-without-navigation-prop.html)
and use it in route callbacks, read the [docs](#usage) below.

## Installation

```
npm i --save react-native-deep-link
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

## Example

Example is available in the `example/` folder.

You can follow a [tutorial](https://medium.com/@starotitorov1997/handle-deep-links-in-react-native-apps-b22055149b3a)
with a step by step implementation.

## Usage

After installing the package, you need to follow a few simple steps:

1. Create deep linking handler.

```js
/**
 * This function receives a result of url parsing,
 * you can find the structure of this object in the API docs below, and returns a function.
 * The returned function receives component props.
 */
const handleColorScreenDeepLink = ({ params: { color } }) => ({ dispatch }) => {
   dispatch(NavigationActions.navigate({
       routeName: 'Color',
       params: { color }
   }));
}

const withDeepLinkingHandler = createDeepLinkingHandler([{
    name: 'example:',
    routes: [{
        name: '/colors/:color',
        callback: handleColorScreenDeepLink
    }]
}]);
```

2. Use higher-order component returned from createDeepLinkingHandler.

```js
export default connect(mapStateToProps, mapDispatchToProps)(withDeepLinkingHandler(App));
```

## API

`createDeepLinkingHandler` takes an array of schemes as a parameter. Each scheme should have a `name` and an array of `routes`.

Each route should have a `name` and a `callback` to be invoked in case of successful matching of the url to the route expression specified using `name` property.
Follow the next pattern to specify named url parameters `:<parameter_name>`.
Examples: `/users/:userId`, `/conversations/:conversationId/messages/:messageId`.

Route `callback` is a higher-order function which receives the result of url parsing and returns a function.
This returned function receives component props.

A result of url parsing is an object with the next set of properties:
```js
{
    scheme: 'example:', // Scheme name
    route: '/colors/:color', // Route name
    query: {}, // Query string parameters
    params: {} // Url parameters
}
```

## Contributing

You are welcome! Create pull requests and help to improve the package.

## License

react-native-deep-link is licensed under the [MIT License](LICENSE).
