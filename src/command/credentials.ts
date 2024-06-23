import Bluesky from '../bluesky';
import * as vscode from 'vscode';

export default async function setCredentials(
    bluesky: Bluesky,
    context: vscode.ExtensionContext
) {
    await bluesky.setCredentials(context);
}
