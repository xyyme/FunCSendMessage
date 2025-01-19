import { toNano } from '@ton/core';
import { EmptyMsgRecv } from '../wrappers/EmptyMsgRecv';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const emptyMsgRecv = provider.open(EmptyMsgRecv.createFromConfig({}, await compile('EmptyMsgRecv')));

    await emptyMsgRecv.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(emptyMsgRecv.address);

    // run methods on `emptyMsgRecv`
}
