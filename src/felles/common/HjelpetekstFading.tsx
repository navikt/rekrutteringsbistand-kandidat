import * as React from 'react';
import AlertStripe from 'nav-frontend-alertstriper';
import { FunctionComponent } from 'react';
import { AlertStripeState, AlertStripeType } from './hooks/useTimeoutState';

interface Props {
    synlig: boolean,
    type: 'info' | 'suksess' | 'advarsel' | 'feil',
    innhold: string | React.ReactNode,
    id?: string,
    className?: string
}

const HjelpetekstFading: FunctionComponent<Props> = ({ synlig, type, innhold, id, className = '' }) => (
    <div aria-live="assertive">
        <AlertStripe id={id} type={type} className={`${className}${synlig ? ' HjelpetekstFading fading synlig' : ' HjelpetekstFading fading'}`} >
            {innhold}
        </AlertStripe>
    </div>
);

const FadingAlertStripeLitenBase: FunctionComponent<Props> = ({ synlig, type, innhold, id }) => (
    <div aria-live="assertive">
        <AlertStripe id={id} type={type} className={`FadingAlertStripeLiten fading ${synlig ? 'synlig' : ''}`} >
            {innhold}
        </AlertStripe>
    </div>
);

export const FadingAlertStripeLiten: FunctionComponent<{ alertStripeState: AlertStripeState }> = ({ alertStripeState }) => (
    <FadingAlertStripeLitenBase
        synlig={alertStripeState.kind !== AlertStripeType.LUKKET && alertStripeState.synlig}
        type={alertStripeState.kind === AlertStripeType.SUCCESS ? 'suksess' : 'feil'}
        innhold={alertStripeState.kind !== AlertStripeType.LUKKET ? alertStripeState.innhold : ''}
    />
);

export const FadingAlertStripe: FunctionComponent<{ alertStripeState: AlertStripeState }> = ({ alertStripeState }) => (
    <HjelpetekstFading
        synlig={alertStripeState.kind !== AlertStripeType.LUKKET && alertStripeState.synlig}
        type={alertStripeState.kind === AlertStripeType.SUCCESS ? 'suksess' : 'feil'}
        innhold={alertStripeState.kind !== AlertStripeType.LUKKET ? alertStripeState.innhold : ''}
    />
);

export default HjelpetekstFading;
