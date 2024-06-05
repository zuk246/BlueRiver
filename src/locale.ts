import * as vscode from 'vscode';
import localeDefault from '../package.nls.json';
import localeJa from '../package.nls.ja.json';
import localeFr from '../package.nls.fr.json';
import localeEs from '../package.nls.es.json';
import localeZhCn from '../package.nls.zh-cn.json';

export type LocaleKeyType = keyof typeof localeDefault;

interface LocaleEntry {
    [key: string]: string;
}

const localeTableKey = vscode.env.language;
const localeTable = Object.assign(
    localeDefault,
    (<{ [key: string]: LocaleEntry }>{
        ja: localeJa,
        fr: localeFr,
        es: localeEs,
        'zh-cn': localeZhCn,
    })[localeTableKey] || {}
);

const localeString = (key: string): string => localeTable[key] || key;

export const locale = (key: LocaleKeyType): string => localeString(key);
