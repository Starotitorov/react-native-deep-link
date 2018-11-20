const getInitialURLMock = jest.fn();
const addEventListenerMock = jest.fn();
const removeEventListenerMock = jest.fn();

const Linking = {
    canOpenURL: () => Promise.resolve(true),

    getInitialURL: getInitialURLMock,

    addEventListener: addEventListenerMock,

    removeEventListener: removeEventListenerMock,

    mockClear: () => {
        getInitialURLMock.mockClear();
        addEventListenerMock.mockClear();
        removeEventListenerMock.mockClear();
    }
};

export default Linking;
