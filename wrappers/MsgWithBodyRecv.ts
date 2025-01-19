import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type MsgWithBodyRecvConfig = {};

export function msgWithBodyRecvConfigToCell(config: MsgWithBodyRecvConfig): Cell {
    return beginCell().endCell();
}

export class MsgWithBodyRecv implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new MsgWithBodyRecv(address);
    }

    static createFromConfig(config: MsgWithBodyRecvConfig, code: Cell, workchain = 0) {
        const data = msgWithBodyRecvConfigToCell(config);
        const init = { code, data };
        return new MsgWithBodyRecv(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
