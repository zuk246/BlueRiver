import * as vscode from 'vscode';

interface CommandItem extends vscode.QuickPickItem {
    command: string;
    secondaryCommand?: string;
}

const items: CommandItem[] = [
    {
        label: 'Timeline',
        description: 'Show the timeline',
        command: 'blueriver.timeline',
        iconPath: new vscode.ThemeIcon('comment-discussion'),
    },
    {
        label: 'Post',
        description: 'Create a new post',
        command: 'blueriver.post',
        iconPath: new vscode.ThemeIcon('edit'),
    },
    {
        label: 'Like',
        description: 'Like the post',
        command: 'blueriver.like',
        iconPath: new vscode.ThemeIcon('heart'),
    },
    {
        label: 'Notifications',
        description: 'Show the notifications',
        command: 'blueriver.notifications',
        iconPath: new vscode.ThemeIcon('bell'),
    },
    {
        kind: vscode.QuickPickItemKind.Separator,
        command: '',
        label: '',
    },
    {
        label: 'Settings',
        description: 'Show the settings',
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
