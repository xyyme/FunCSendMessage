import { Blockchain, printTransactionFees, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { MsgWithBody } from '../wrappers/MsgWithBody';
import { MsgWithBodyRecv } from '../wrappers/MsgWithBodyRecv';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('MsgWithBody', () => {
    let code: Cell;
    let recvCode: Cell;

    beforeAll(async () => {
        code = await compile('MsgWithBody');
        recvCode = await compile('MsgWithBodyRecv');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let msgWithBody: SandboxContract<MsgWithBody>;
    let msgWithBodyRecv: SandboxContract<MsgWithBodyRecv>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        msgWithBody = blockchain.openContract(MsgWithBody.createFromConfig({}, code));
        msgWithBodyRecv = blockchain.openContract(MsgWithBodyRecv.createFromConfig({}, recvCode));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await msgWithBody.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: msgWithBody.address,
            deploy: true,
            success: true,
        });

        const deployRectResult = await msgWithBodyRecv.sendDeploy(deployer.getSender(), toNano('0.05'));
        expect(deployRectResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: msgWithBodyRecv.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and msgWithBody are ready to use
        const sendMsgResult = await msgWithBody.sendSendMsg(deployer.getSender(), toNano('0.05'), msgWithBodyRecv.address);
        printTransactionFees(sendMsgResult.transactions);
    });
});
