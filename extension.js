const vscode = require('vscode');
const TreeView = require('./function/treeView.js');

function activate(context) {

	// 树的渲染
	vscode.window.registerTreeDataProvider("subMenu1", new TreeView(context));

	// 刷新
	vscode.commands.registerCommand("subMenu1.refresh", () => {
		vscode.window.showInformationMessage('已刷新');
		vscode.window.registerTreeDataProvider("subMenu1", new TreeView(context));
	});

	// 添加
	vscode.commands.registerCommand("subMenu1.addEntry", () => {
		vscode.window.showInformationMessage('已添加');
		const config = vscode.workspace.getConfiguration();
		const priceArr = config.get('vscodePluginCoinPrices.symbol');
		const priceArrAdd = [...priceArr, 'ela_usdt'];
		config.update('vscodePluginCoinPrices.symbol', priceArrAdd);
	});

	// 删除
	vscode.commands.registerCommand("subMenu1.deleteEntry", (item) => {
		vscode.window.showInformationMessage('已删除');
		const config = vscode.workspace.getConfiguration();
		const priceArr = config.get('vscodePluginCoinPrices.symbol');
	    const priceArrDel = priceArr.filter(priceItem => priceItem !== item.key);
		config.update('vscodePluginCoinPrices.symbol', priceArrDel);
	});
}

function deactivate() { }

module.exports = {
	activate,
	deactivate
}
