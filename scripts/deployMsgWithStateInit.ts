import { toNano } from '@ton/core';
import { MsgWithStateInit } from '../wrappers/MsgWithStateInit';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const msgWithStateInit = provider.open(MsgWithStateInit.createFromConfig({}, await compile('MsgWithStateInit')));

    await msgWithStateInit.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(msgWithStateInit.address);

    // run methods on `msgWithStateInit`
}
