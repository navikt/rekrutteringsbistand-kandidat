module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        "^.+\\.(css|less)$": "./styleMock.js"
      }
};
