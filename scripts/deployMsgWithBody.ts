import { toNano } from '@ton/core';
import { MsgWithBody } from '../wrappers/MsgWithBody';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const msgWithBody = provider.open(MsgWithBody.createFromConfig({}, await compile('MsgWithBody')));

    await msgWithBody.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(msgWithBody.address);

    // run methods on `msgWithBody`
}
