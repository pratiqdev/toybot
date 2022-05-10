export type T_CommandFunction = 
    (bb: any) => void

export interface I_CommandOption {
    name: string;
    type: string;
    description: string;
    required?: boolean;
    min?: number;
    max?: number;
}

export interface I_CommandStruct {
    name: string;
    command: T_CommandFunction;
    description: string;
    useSlash?: boolean;
    options?: I_CommandOption[];
}

export interface I_ToybotConfig {
    client: string;
    guild: string,
    commands: I_CommandStruct[];
    commandObj: any;
    intents?: string[];
    partials?: string[];
    prefix?: string;
}
