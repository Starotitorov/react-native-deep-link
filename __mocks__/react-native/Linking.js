const getInitialURLMock = jest.fn();
const addEventListenerMock = jest.fn();
const removeEventListenerMock = jest.fn();
const canOpenUrl = jest.fn();

const Linking = {
    canOpenURL: jest.fn(),

    getInitialURL: getInitialURLMock,

    addEventListener: addEventListenerMock,

    removeEventListener: removeEventListenerMock,

    mockClear: () => {
        canOpenUrl.mockClear();
        getInitialURLMock.mockClear();
        addEventListenerMock.mockClear();
        removeEventListenerMock.mockClear();
    }
};

export default Linking;
