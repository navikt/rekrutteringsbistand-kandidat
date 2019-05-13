import * as React from 'react';

declare module 'nav-frontend-typografi' {

    export interface TypografiProps {
        /**
         * Egendefinert innhold
         */
        children: React.ReactNode | React.ReactChild | React.ReactChildren;
        /**
         * Angi hvilken HTML-tag som skal brukes ('h1', 'h2', osv...)
         */
        tag?: string;
        /**
         * Egendefinert klassenavn
         */
        className?: string;

        /**
         *  Ikke inkludert i typedefinisjonen i nav-frontend, selv om den inkluderes i htmlen
         */
        id?: string;
    }

    export class Normaltekst extends React.Component<TypografiProps> {
    }

    export class Sidetittel extends React.Component<TypografiProps> {
    }

    export class Undertekst extends React.Component<TypografiProps> {
    }

    export class UndertekstBold extends React.Component<TypografiProps> {
    }

    export class Element extends React.Component<TypografiProps> {
    }

    export class Systemtittel extends React.Component<TypografiProps> {
    }
}
