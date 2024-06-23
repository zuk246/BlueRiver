import * as vscode from 'vscode';
import { langs } from '../data/lang';
import Bluesky from '../bluesky';
import { LocaleKey, locale } from '../locale';

export default async function postCommand(bluesky: Bluesky) {
    const text = await vscode.window.showInputBox({
        placeHolder: locale('app-post-message'),
        validateInput: (value) => {
            if (!value) {
                return locale('app-post-invalid');
            }
        },
    });

    if (!text) {
        return;
    }

    const defaultLang = LocaleKey;
    const langPickItems: vscode.QuickPickItem[] = [];

    // defaultLang が一番上に来るようにする
    if (defaultLang) {
        const defaultLangData = langs.find((lang) => lang.id === defaultLang);

        if (defaultLangData) {
            langPickItems.push({
                label: defaultLangData.id,
                description: `${defaultLangData.name} - default`,
            });
        }
    }

    for (const lang of langs.sort((a, b) => b.population - a.population)) {
        if (lang.id === defaultLang) {
            continue;
        }

        langPickItems.push({
            label: lang.id,
            description: lang.name,
        });
    }

    const lang = await vscode.window.showQuickPick(langPickItems, {
        placeHolder: locale('app-post-select-lang'),
    });

    if (!lang || !langs.find((l) => l.id === lang.label)) {
        return;
    }

    await bluesky.post(text, lang.label).then(() => {
        vscode.window.showInformationMessage(`${locale('app-post-done')}`);
    });
}
