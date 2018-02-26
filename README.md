# react-native-deep-link

[![Build Status](https://travis-ci.org/Starotitorov/react-native-deep-link.svg?branch=master)](https://travis-ci.org/Starotitorov/react-native-deep-link)
[![npm version](https://img.shields.io/npm/v/react-native-deep-link.svg)](https://www.npmjs.com/package/react-native-deep-link)
[![NPM Downloads](https://img.shields.io/npm/dt/react-native-deep-link.svg)](https://www.npmjs.com/package/react-native-deep-link)

React Native deep linking library.
To add deep linking to your project just create a routes config.
The package will do the rest!

If you are using react-navigation you should know that it supports deep linking out of the box,
**but it is a common practice to add navigation state to redux**. **In this case you have to handle deep links manually**.
**This package solves the problem, provides ready to use solution to handle deep links.**
Adding navigation to redux gives you more control on navigation state, allows to dispatch navigation actions from your redux actions. 

* [Installation](#installation)
* [Configuring Android](#configuring-android)
* [Configuring iOS](#configuring-ios)
* [Example](#example)
* [Usage](#usage)
* [Contributing](#contributing)
* [License](#license)

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

Example is available in example folder.

You can follow a [tutorial](https://medium.com/@starotitorov1997/handle-deep-links-in-react-native-apps-b22055149b3a) with a step by step implementation.

## Usage

#### Using withDeepLinking HOC

```js
/**
 * The function receives component props and returns a function.
 * The result of parsing of deep link will be passed to the returned function.
 * You can find the object structure in the API docs below.
 */
const handleColorScreenDeepLink = ({ dispatch }) => ({ params: { color } }) => {
   dispatch(NavigationActions.navigate({
       routeName: 'Color',
       params: { color }
   }));
}

/**
 * The function receives component props and returns a function.
 * The result of parsing of deep link will be passed to the returned function.
 * You can find the object structure in the API docs below.
 */
const handleColorsScreenDeepLink = ({ dispatch }) => () => {
   dispatch(NavigationActions.navigate({ routeName: 'Colors' }));
}

DeepLinking.registerRoute('example:', '/colors/:color', handleColorScreenDeepLink);

DeepLinking.registerRoute('example:', '/colors', handleColorsScreenDeepLink);

export default connect(mapStateToProps, mapDispatchToProps)(withDeepLinking(App));
```

#### Using createDeepLinkingHandler

1. Create deep linking handler.

```js
/**
 * The function receives component props and returns a function.
 * The result of parsing of deep link will be passed to the returned function.
 * You can find the object structure in the API docs below.
 */
const handleColorScreenDeepLink = ({ dispatch }) => ({ params: { color } }) => {
   dispatch(NavigationActions.navigate({
       routeName: 'Color',
       params: { color }
   }));
}

const withDeepLinking = createDeepLinkingHandler([{
    name: 'example:',
    routes: [{
        name: '/colors/:color',
        // Function to be called on link receive.
        callback: handleColorScreenDeepLink
    }]
}]);
```

2. Use higher-order component returned from createDeepLinkingHandler.

```js
export default connect(mapStateToProps, mapDispatchToProps)(withDeepLinking(App));
```

## API

`createDeepLinkingHandler` takes an array of schemes as a parameter. Each scheme should have a `name` and an array of `routes`.

Each route should have a `name` and a `callback` to be invoked in case of successful mapping of url to route expression set using `name` property. To specify named url parameters follow the next pattern `:<parameter_name>`.
Examples: `/users/:userId`, `/conversations/:conversationId/messages/:messageId`.

Also DeepLinking module has several useful methods to manage routes and schemes such as `registerRoute`, `unregisterRoute`, `registerScheme`, `unregisterScheme`, `registerSchemes`, `unregisterSchemes`.

```js
DeepLinking.registerRoute('example:', '/colors/:color', handler);
DeepLinking.unregisterRoute('example:', '/colors/:color');

DeepLinking.registerScheme('example:', [{ name: '/colors/:color', callback }]);
DeepLinking.unregisterScheme('example:');

DeepLinking.registerSchemes([{
    name: 'example:',
    routes: [{
        name: '/colors/:color',
        callback
    }]
}]);
DeepLinking.unregisterSchemes();
```

Route `callback` is a higher-order function which receives component props and returns a function. An object with the next set of fields will be passed to the function:
```js
{
    scheme: 'example:',
    route: '/colors/:color',
    query: {}, // Query string parameters
    params: {} // Url parameters
}
```

## Contributing

You are welcome! Create pull requests and help to improve the package.

## License

react-native-deep-link is licensed under the [MIT License](LICENSE).
