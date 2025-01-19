import { toNano } from '@ton/core';
import { EmptyMsg } from '../wrappers/EmptyMsg';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const emptyMsg = provider.open(EmptyMsg.createFromConfig({}, await compile('EmptyMsg')));

    await emptyMsg.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(emptyMsg.address);

    // run methods on `emptyMsg`
}
