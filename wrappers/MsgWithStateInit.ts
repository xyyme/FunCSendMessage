import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type MsgWithStateInitConfig = {
    recvCode: Cell;
};

export function msgWithStateInitConfigToCell(config: MsgWithStateInitConfig): Cell {
    return beginCell().storeRef(config.recvCode).endCell();
}

export class MsgWithStateInit implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new MsgWithStateInit(address);
    }

    static createFromConfig(config: MsgWithStateInitConfig, code: Cell, workchain = 0) {
        const data = msgWithStateInitConfigToCell(config);
        const init = { code, data };
        return new MsgWithStateInit(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendSendMsg(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeAddress(via.address).endCell(),
        });
    }
}
