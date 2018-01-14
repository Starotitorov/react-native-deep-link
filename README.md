# react-native-deep-link

## Overview

React Native deep linking library.

## Installation

```
npm i --save react-native-deep-link
```

**Important:** To know how to configure ios and android take a look at [docs](https://facebook.github.io/react-native/docs/linking.html)

## Example

Example is available in example folder.

You can follow a [tutorial](https://medium.com/@starotitorov1997/handle-deep-links-in-react-native-apps-b22055149b3a) with a step by step implementation.

## Usage

#### 1. Create deep linking handler.

```js
const withDeepLinking = createDeepLiningHandler([
    {
        name: 'example:',
        routes: [
            {
                name: '/colors/:color',
                callback: ({ dispatch }) => ({ params: { color } }) => {
                    dispatch(NavigationActions.navigate({
                        routeName: 'Color',
                        params: {
                            color
                        }
                    }));
                }
            }
        ]
    }
]);
```

#### 2. Use higher-order component returned from createDeepLiningHandler.

```js
export default connect(mapStateToProps, mapDispatchToProps)(withDeepLinking(App));
```

## API

`createDeepLiningHandler` takes an array of schemes as a parameter. Each scheme should have a `name` and an array of `routes`.

Each route should have a `name` and a `callback` to be invoked in case of successful mapping of url to route expression set using `name` property. To specify named url parameters follow the next pattern `:<parameter_name>`.
Examples: `/users/:userId`, `/conversations/:conversationId/messages/:messageId`.

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

React-native-deep-link is licensed under the [MIT License](LICENSE).
