import { toNano } from '@ton/core';
import { MsgWithBodyRecv } from '../wrappers/MsgWithBodyRecv';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const msgWithBodyRecv = provider.open(MsgWithBodyRecv.createFromConfig({}, await compile('MsgWithBodyRecv')));

    await msgWithBodyRecv.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(msgWithBodyRecv.address);

    // run methods on `msgWithBodyRecv`
}
