import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type EmptyMsgRecvConfig = {};

export function emptyMsgRecvConfigToCell(config: EmptyMsgRecvConfig): Cell {
    return beginCell().endCell();
}

export class EmptyMsgRecv implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new EmptyMsgRecv(address);
    }

    static createFromConfig(config: EmptyMsgRecvConfig, code: Cell, workchain = 0) {
        const data = emptyMsgRecvConfigToCell(config);
        const init = { code, data };
        return new EmptyMsgRecv(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
