import React, { useEffect, useRef, useState } from 'react';
import './TilToppenKnapp.less';
import { Knapp } from 'nav-frontend-knapper';
import throttle from 'lodash.throttle';
import classNames from 'classnames';

export const TilToppenKnapp = () => {
    const [scrollPosition, setScrollPosition] = useState<number | undefined>();
    const knappRef = useRef<HTMLButtonElement>(null);

    const onScroll = throttle(() => {
        setScrollPosition(window.scrollY);
    }, 1000);

    const onClick = (e) => {
        if (knappSkalVises) {
            window.scrollTo({ top: 0 });
        }
        if (knappRef && knappRef.current) {
            knappRef.current.blur();
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', onScroll);

        return () => {
            window.removeEventListener('scroll', onScroll);
        };
    }, [onScroll]);

    const knappSkalVises = scrollPosition && scrollPosition > window.innerHeight;

    return (
        <button
            ref={knappRef}
            className={classNames(
                'tilToppenKnapp',
                'knapp',
                'knapp--hoved',
                !knappSkalVises && 'tilToppenKnapp--skjul'
            )}
            aria-hidden={!knappSkalVises}
            onClick={onClick}
        >
            <svg width="33" height="36" viewBox="0 0 22 24" xmlns="http://www.w3.org/2000/svg">
                <title>Til toppen</title>
                <path
                    d="M7.14 23.51v-12H1.4a.48.48 0 0 1-.34-.82l9.575-9.607a.482.482 0 0 1 .68-.001l9.604 9.609a.48.48 0 0 1-.34.82h-5.76v12a.48.48 0 0 1-.48.48h-6.72a.48.48 0 0 1-.48-.482z"
                    fillRule="evenodd"
                />
            </svg>
        </button>
    );
};
