import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { MsgWithBodyRecv } from '../wrappers/MsgWithBodyRecv';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('MsgWithBodyRecv', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('MsgWithBodyRecv');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let msgWithBodyRecv: SandboxContract<MsgWithBodyRecv>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        msgWithBodyRecv = blockchain.openContract(MsgWithBodyRecv.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await msgWithBodyRecv.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: msgWithBodyRecv.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and msgWithBodyRecv are ready to use
    });
});
