# TODO

## Urgent

- treat all commands as slash commands if no prefix is provided, or require a prefix to be defined

- commands only contain a `description` with slash type commands, can this be used as a flag instead of `useSlash: true` ?



## Testing

- create a bunch of commands that use all key:values in the toybot return object



## Validation

- create a cache of used command names and alert the user of duplicates (fatal)



## Features

- add a command flag for `allowRoles` that only allows users with that role to access that command

```js
member.roles.cache.some(role => role.name === 'Mod');
// https://discordjs.guide/popular-topics/permissions.html
```

- reconsider the inclusion of partials and rely only on intents

- consider using an object instead of an array for commands:
  > this means no roles for prefix commands! seems fine...

```js
commands: {
    'prefix-command-1': (msg) => {},
    'prefix-command-2': (msg) => {},
    'help-slash':{
        description: 'List the commands, options and usage',
        roles: [],
        options: [],
        command: (intr) => {}
    }
}
```