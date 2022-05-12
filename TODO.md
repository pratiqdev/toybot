# TODO

## Urgent

- commands that use `bot.title.toLowerCase()` should have spaces replaced with hyphens
  
- store WARNINGs in array that can be looped over when setup is done. 
  show warnings then success log
  (show FATALs right away)

- Add config option to reduce logs to console (FATALs still show)

- Add a metrics object that has details about uptime and commands:
```js
const stats = {
  commands: {
    '&total-commands': 5856,
    '&slash-commands': 424,
    '&prefix-commands': 5432,
    'command-name': 5432,
    'other-command':424,
  },
  startedAt: 172348071239,
  uptime: 7345234,
  storeSizeBytes: 90481203782034
}

```


  
## Testing

- create a bunch of commands that use all key:values in the toybot return object



## Validation

- prep / validate slash command options



## Features

- Pass the MessageEmbed constructor with the return ctx object
