import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { MsgWithStateInitRecv } from '../wrappers/MsgWithStateInitRecv';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('MsgWithStateInitRecv', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('MsgWithStateInitRecv');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let msgWithStateInitRecv: SandboxContract<MsgWithStateInitRecv>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        msgWithStateInitRecv = blockchain.openContract(MsgWithStateInitRecv.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await msgWithStateInitRecv.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: msgWithStateInitRecv.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and msgWithStateInitRecv are ready to use
    });
});
