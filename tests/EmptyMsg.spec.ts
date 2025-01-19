import { Blockchain, printTransactionFees, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { EmptyMsg } from '../wrappers/EmptyMsg';
import { EmptyMsgRecv } from '../wrappers/EmptyMsgRecv';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('EmptyMsg', () => {
    let code: Cell;
    let recvCode: Cell;

    beforeAll(async () => {
        code = await compile('EmptyMsg');
        recvCode = await compile('EmptyMsgRecv');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let emptyMsg: SandboxContract<EmptyMsg>;
    let emptyMsgRecv: SandboxContract<EmptyMsgRecv>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        emptyMsg = blockchain.openContract(EmptyMsg.createFromConfig({}, code));
        emptyMsgRecv = blockchain.openContract(EmptyMsgRecv.createFromConfig({}, recvCode));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await emptyMsg.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: emptyMsg.address,
            deploy: true,
            success: true,
        });

        const deployRecvResult = await emptyMsgRecv.sendDeploy(deployer.getSender(), toNano('0.05'));
        expect(deployRecvResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: emptyMsgRecv.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and emptyMsg are ready to use
        const sendMsgResult = await emptyMsg.sendSendMsg(deployer.getSender(), toNano('0.01'), emptyMsgRecv.address);
        printTransactionFees(sendMsgResult.transactions);
    });
});
