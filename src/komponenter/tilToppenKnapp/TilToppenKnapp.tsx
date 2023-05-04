import React, { useEffect, useRef, useState } from 'react';
import { ChevronUpDoubleIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import throttle from 'lodash.throttle';
import classNames from 'classnames';
import css from './TilToppenKnapp.module.css';

export const TilToppenKnapp = () => {
    const [scrollPosition, setScrollPosition] = useState<number | undefined>();
    const knappRef = useRef<HTMLButtonElement>(null);

    const onScroll = throttle(() => {
        setScrollPosition(window.scrollY);
    }, 1000);

    const onClick = () => {
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
        <Button
            ref={knappRef}
            className={classNames(css.knapp, {
                [css.skjult]: !knappSkalVises,
            })}
            aria-hidden={!knappSkalVises}
            onClick={onClick}
            icon={<ChevronUpDoubleIcon />}
        />
    );
};
