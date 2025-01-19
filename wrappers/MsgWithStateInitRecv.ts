import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type MsgWithStateInitRecvConfig = {};

export function msgWithStateInitRecvConfigToCell(config: MsgWithStateInitRecvConfig): Cell {
    return beginCell().endCell();
}

export class MsgWithStateInitRecv implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new MsgWithStateInitRecv(address);
    }

    static createFromConfig(config: MsgWithStateInitRecvConfig, code: Cell, workchain = 0) {
        const data = msgWithStateInitRecvConfigToCell(config);
        const init = { code, data };
        return new MsgWithStateInitRecv(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
