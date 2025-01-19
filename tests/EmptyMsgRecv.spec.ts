import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { EmptyMsgRecv } from '../wrappers/EmptyMsgRecv';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('EmptyMsgRecv', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('EmptyMsgRecv');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let emptyMsgRecv: SandboxContract<EmptyMsgRecv>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        emptyMsgRecv = blockchain.openContract(EmptyMsgRecv.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await emptyMsgRecv.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: emptyMsgRecv.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and emptyMsgRecv are ready to use
    });
});
