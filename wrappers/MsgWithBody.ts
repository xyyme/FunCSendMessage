import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type MsgWithBodyConfig = {};

export function msgWithBodyConfigToCell(config: MsgWithBodyConfig): Cell {
    return beginCell().endCell();
}

export class MsgWithBody implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new MsgWithBody(address);
    }

    static createFromConfig(config: MsgWithBodyConfig, code: Cell, workchain = 0) {
        const data = msgWithBodyConfigToCell(config);
        const init = { code, data };
        return new MsgWithBody(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendSendMsg(provider: ContractProvider, via: Sender, value: bigint, to: Address) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeAddress(to).endCell(),
        });
    }
}
