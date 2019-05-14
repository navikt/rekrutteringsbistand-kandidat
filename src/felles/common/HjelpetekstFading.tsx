import * as React from 'react';
import AlertStripe from 'nav-frontend-alertstriper';

interface Props {
    synlig: boolean,
    type: 'info' | 'suksess' | 'advarsel' | 'feil',
    tekst: string,
    id?: string,
    className?: string
}

const HjelpetekstFading : React.FunctionComponent<Props> = ({ synlig, type, tekst, id, className = '' }) => (
    <div aria-live="assertive">
        <AlertStripe id={id} type={type} className={`${className}${synlig ? ' HjelpetekstFading fading synlig' : ' HjelpetekstFading fading'}`} solid>
            {tekst}
        </AlertStripe>
    </div>
);

export default HjelpetekstFading;
