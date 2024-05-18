import * as vscode from 'vscode';
import { Lang, langs } from '../data/lang';
import Bluesky from '../bluesky';

export default async function postCommand() {
    const text = await vscode.window.showInputBox({
        placeHolder: `What's up?`,
        validateInput: (value) => {
            if (!value) {
                return 'Please enter some text';
            }
        },
    });

    if (!text) {
        return;
    }

    const langPickItems: vscode.QuickPickItem[] = Object.keys(langs).map(
        (lang) => ({
            label: lang,
            description: langs[lang as Lang],
        })
    );

    const lang = await vscode.window.showQuickPick(langPickItems);

    if (!lang || Object.keys(langs).indexOf(lang.label) === -1) {
        return;
    }

    const bluesky = new Bluesky();
    await bluesky.login();
    await bluesky.post(text, lang.label as Lang).then(() => {
        vscode.window.showInformationMessage(
            `Posted: ${text} in ${lang.description}`
        );
    });
}
