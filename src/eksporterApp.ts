import React from 'react';
import ReactDOM from 'react-dom';

const renderApp = (component: React.FunctionComponent) => (element: HTMLElement, props: Object) => {
    ReactDOM.render(React.createElement(component, props), element);
};

const unmountApp = (element: HTMLElement) => {
    ReactDOM.unmountComponentAtNode(element);
};

const eksporterApp = (navn: string, component: any) => {
    (window as any)[navn] = {
        render: renderApp(component),
        unmount: unmountApp,
    };
};

export default eksporterApp;
