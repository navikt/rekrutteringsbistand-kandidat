import { FunctionComponent, ReactNode } from 'react';

import Cv from '../../../cv/reducer/cv-typer';
import { Nettressurs, Nettstatus } from '../../../api/Nettressurs';
import Lenker from '../lenker/Lenker';
import css from './Kandidatmeny.module.css';

type Props = {
    cv: Nettressurs<Cv>;
    tabs: ReactNode;
    children?: ReactNode;
};

const Kandidatmeny: FunctionComponent<Props> = ({ cv, tabs, children }) => {
    return (
        <div className={css.wrapper}>
            <div className={css.meny}>
                <nav className={css.faner}>{tabs}</nav>
                {cv.kind === Nettstatus.Suksess && (
                    <Lenker className={css.lenkerIMeny} fødselsnummer={cv.data.fodselsnummer} />
                )}
                <div className={css.høyre}>{children}</div>
            </div>
            {cv.kind === Nettstatus.Suksess && (
                <Lenker className={css.lenkerUnderMeny} fødselsnummer={cv.data.fodselsnummer} />
            )}
        </div>
    );
};

export default Kandidatmeny;
