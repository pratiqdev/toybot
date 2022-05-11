
export const generateSlashCommandOptions = (SLASH_COMMAND, commandName, packCommandOption) => {
    switch(packCommandOption.type.toLowerCase()){
        case 'i':
        case 'int':
        case 'integer':
            SLASH_COMMAND.addIntegerOption((OPTION:any) => {
                OPTION.setName(packCommandOption.name)
                OPTION.setDescription(packCommandOption.description || packCommandOption.name)
                    packCommandOption.required    && OPTION.setRequired(packCommandOption.required)
                    packCommandOption.min         && OPTION.setMinValue(packCommandOption.min)
                    packCommandOption.max         && OPTION.setMinValue(packCommandOption.max)
                return OPTION
            })
        break;
        case 'n':
        case 'num':
        case 'number':
            SLASH_COMMAND.addNumberOption((OPTION:any) => {
                OPTION.setName(packCommandOption.name)
                OPTION.setDescription(packCommandOption.description || packCommandOption.name)
                    packCommandOption.required    && OPTION.setRequired(packCommandOption.required)
                    packCommandOption.min         && OPTION.setMinValue(packCommandOption.min)
                    packCommandOption.max         && OPTION.setMinValue(packCommandOption.max)
                return OPTION
            })
        break;
        case 'b':
        case 'bool':
        case 'boolean':
            SLASH_COMMAND.addBooleanOption((OPTION:any) => {
                OPTION.setName(packCommandOption.name)
                OPTION.setDescription(packCommandOption.description || packCommandOption.name)
                    packCommandOption.required    && OPTION.setRequired(packCommandOption.required)
                return OPTION
            })
        break;
        case 'u':
        case 'user':
            SLASH_COMMAND.addUserOption((OPTION:any) => {
                OPTION.setName(packCommandOption.name)
                OPTION.setDescription(packCommandOption.description || packCommandOption.name)
                    packCommandOption.required    && OPTION.setRequired(packCommandOption.required)
                return OPTION
            })
        break;
        case 'r':
        case 'role':
            SLASH_COMMAND.addRoleOption((OPTION:any) => {
                OPTION.setName(packCommandOption.name)
                OPTION.setDescription(packCommandOption.description || packCommandOption.name)
                    packCommandOption.required    && OPTION.setRequired(packCommandOption.required)
                return OPTION
            })
        break;
        case 'm':
        case 'mention':
        case 'mentionable':
            SLASH_COMMAND.addMentionableOption((OPTION:any) => {
                OPTION.setName(packCommandOption.name)
                OPTION.setDescription(packCommandOption.description || packCommandOption.name)
                    packCommandOption.required    && OPTION.setRequired(packCommandOption.required)
                return OPTION
            })
        break;
        default:
            SLASH_COMMAND.addStringOption((OPTION: any) => {
                OPTION.setName(packCommandOption.name);
                OPTION.setDescription(packCommandOption.description || packCommandOption.name);
                    packCommandOption.required    && OPTION.setRequired(packCommandOption.required)
                return OPTION
            })
    }
}