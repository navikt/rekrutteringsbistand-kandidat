import { useLayoutEffect } from 'react';
import { fnr } from '@navikt/fnrvalidator';
import { useSelector } from 'react-redux';
import AppState from '../AppState';

const erstatningstegn = '*';

const useMaskerFødselsnumre = () => {
    const maskerFødselsnumre = useSelector(
        (state: AppState) => state.søk.featureToggles['masker-fnr']
    );

    useLayoutEffect(() => {
        if (maskerFødselsnumre) {
            maskerAlleFødselsnumre(document.getElementById('rekrutteringsbistand-kandidat'));
        }
    });
};

const maskerAlleFødselsnumre = (fraElement: HTMLElement | null) => {
    if (fraElement) {
        const tekstnoder = hentAlleTekstnoder(fraElement);
        tekstnoder.forEach((node) => {
            maskerFødselsnummer(node);
        });
    }
};

const hentAlleTekstnoder = (el: HTMLElement) => {
    let alleTekstnoder: Node[] = [];
    let treeWalker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);

    let nesteNode: Node | null = treeWalker.nextNode();
    while (nesteNode !== null) {
        alleTekstnoder.push(nesteNode);
        nesteNode = treeWalker.nextNode();
    }

    return alleTekstnoder;
};

const erFødselsnummer = (tekst: string) => {
    return tekst.length === 11 && fnr(tekst).status === 'valid';
};

const maskerFødselsnummer = (node: Node) => {
    if (node.textContent) {
        if (erFødselsnummer(node.textContent)) {
            node.textContent = node.textContent.replace(/./g, erstatningstegn);
        }
    }
};

export default useMaskerFødselsnumre;
