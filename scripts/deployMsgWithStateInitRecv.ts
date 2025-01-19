import { toNano } from '@ton/core';
import { MsgWithStateInitRecv } from '../wrappers/MsgWithStateInitRecv';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const msgWithStateInitRecv = provider.open(MsgWithStateInitRecv.createFromConfig({}, await compile('MsgWithStateInitRecv')));

    await msgWithStateInitRecv.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(msgWithStateInitRecv.address);

    // run methods on `msgWithStateInitRecv`
}
