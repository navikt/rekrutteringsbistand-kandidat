import classNames from 'classnames';
import { FunctionComponent, ReactNode } from 'react';
import css from './InfoUnderKandidat.module.css';

type Props = {
    className?: string;
    children?: ReactNode;
};

const InfoUnderKandidat: FunctionComponent<Props> = ({ className, children }) => {
    return (
        <div className={css.wrapper}>
            <div className={classNames(css.innhold, className)}>{children}</div>
        </div>
    );
};

export default InfoUnderKandidat;
