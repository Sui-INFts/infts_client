interface ContractConfig {
    [key: string]: string;
}

export function getContractConfig(): ContractConfig {
    try {
        // Load testnet contract configuration
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const testnetModule = require('./contracts_testnet');
        return testnetModule.testnet as unknown as ContractConfig;
    } catch (error) {
        console.error('Failed to load testnet config', { cause: error });
        return {};
    }
}
