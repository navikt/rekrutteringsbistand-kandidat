import { ReactNode, FunctionComponent, useState, useLayoutEffect } from 'react';
import { Router } from 'react-router-dom';
import { History } from 'history';

type CustomRouterProps = {
    history: History;
    children: ReactNode;
};

const CustomRouter: FunctionComponent<CustomRouterProps> = ({ history, children }) => {
    const [state, setState] = useState({
        action: history.action,
        location: history.location,
    });

    useLayoutEffect(() => history.listen(setState as any), [history]);

    return (
        <Router
            children={children}
            location={state.location}
            navigationType={state.action as any}
            navigator={history}
        />
    );
};

export default CustomRouter;
