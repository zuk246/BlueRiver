import * as vscode from 'vscode';
import { locale } from '../locale';

interface CommandItem extends vscode.QuickPickItem {
    command: string;
    secondaryCommand?: string;
}

const items: CommandItem[] = [
    {
        label: locale('command-name-timeline'),
        description: locale('command-desc-timeline'),
        command: 'blueriver.timeline',
        iconPath: new vscode.ThemeIcon('comment-discussion'),
    },
    {
        label: locale('command-name-post'),
        description: locale('command-desc-post'),
        command: 'blueriver.post',
        iconPath: new vscode.ThemeIcon('edit'),
    },
    {
        label: locale('command-name-like'),
        description: locale('command-desc-like'),
        command: 'blueriver.like',
        iconPath: new vscode.ThemeIcon('heart'),
    },
    {
        label: locale('command-name-notifications'),
        description: locale('command-desc-notifications'),
        command: 'blueriver.notifications',
        iconPath: new vscode.ThemeIcon('bell'),
    },
    {
        label: locale('command-name-account'),
        description: locale('command-desc-account'),
        command: 'blueriver.account',
        iconPath: new vscode.ThemeIcon('account'),
    },
    {
        kind: vscode.QuickPickItemKind.Separator,
        command: '',
        label: '',
    },
    {
        label: locale('command-name-settings'),
        description: locale('command-desc-settings'),
        command: 'workbench.action.openSettings',
        secondaryCommand: 'blueriver',
        iconPath: new vscode.ThemeIcon('gear'),
    },
];

export default async function listCommand() {
    const command = await vscode.window.showQuickPick(items);

    if (!command) {
        return;
    }

    vscode.commands.executeCommand(command.command, command.secondaryCommand);
}
