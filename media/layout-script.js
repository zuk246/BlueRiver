window.addEventListener('DOMContentLoaded', () => {
    const vscode = acquireVsCodeApi();

    // sidebar
    const sidebar_items = document.getElementsByClassName('sidebar-item');

    let sidebar_items_array = Array.from(sidebar_items);

    for (let sidebar_item of sidebar_items_array) {
        sidebar_item.addEventListener('click', () => {
            const id = sidebar_item.id;
            vscode.postMessage({
                command: 'sidebar',
                id: id,
            });
        });
    }
});
