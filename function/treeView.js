const vscode = require('vscode');
const axios = require('axios');

module.exports = class TreeProvider {
    constructor(context) {
        this.context = context;
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        setInterval(() => {
            this.refresh();
        }, 10000)
    }

    refresh() {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(TreeItem) {
        return {
            label: `${TreeItem.coinType} $${TreeItem.last}/¥${TreeItem.lastCny}`,
            collapsibleState: 0,
            tooltip: "hover效果",
        };
    }

    onDidChangeTreeData() {
        console.log('onDidChangeTreeData')
    }

    async getChildren() {

        const gateRes      = await axios.get('https://data.gateapi.io/api2/1/tickers');
        const vsConfig     = vscode.workspace.getConfiguration();
        const vsConfig_btc = vsConfig.get('vscodePluginCoinPrices.symbol');
        const gateCoinList = (gateRes.status === 200) ? gateRes.data : {};

        // 获取用户配置交易对
        const userCoinList = vsConfig_btc.map((coinType) => {
            const curCoinInfo = gateCoinList[coinType] ? gateCoinList[coinType] : {};
            const lastCny     = Number(curCoinInfo.last * 6.35).toFixed(2);
            const key         = coinType;
            return { ...curCoinInfo, key, lastCny, coinType, };
        });

        // 返回交易对列表 [{ last, lastCny, low24hr, high24hr, key }]
        return userCoinList;
    }
}