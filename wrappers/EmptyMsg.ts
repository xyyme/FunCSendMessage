import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type EmptyMsgConfig = {};

export function emptyMsgConfigToCell(config: EmptyMsgConfig): Cell {
    return beginCell().endCell();
}

export class EmptyMsg implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new EmptyMsg(address);
    }

    static createFromConfig(config: EmptyMsgConfig, code: Cell, workchain = 0) {
        const data = emptyMsgConfigToCell(config);
        const init = { code, data };
        return new EmptyMsg(contractAddress(workchain, init), init);
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
