import { Blockchain, printTransactionFees, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { MsgWithStateInit } from '../wrappers/MsgWithStateInit';
import { MsgWithStateInitRecv } from '../wrappers/MsgWithStateInitRecv';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('MsgWithStateInit', () => {
    let code: Cell;
    let recvCode: Cell;

    beforeAll(async () => {
        code = await compile('MsgWithStateInit');
        recvCode = await compile('MsgWithStateInitRecv');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let msgWithStateInit: SandboxContract<MsgWithStateInit>;
    let MsgWithStateInitRecv: SandboxContract<MsgWithStateInitRecv>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        msgWithStateInit = blockchain.openContract(MsgWithStateInit.createFromConfig({
            recvCode: recvCode,
        }, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await msgWithStateInit.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: msgWithStateInit.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and msgWithStateInit are ready to use
        const sendMsgResult = await msgWithStateInit.sendSendMsg(deployer.getSender(), toNano('0.05'));
        printTransactionFees(sendMsgResult.transactions);
    });
});
