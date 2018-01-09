# API object

This library, by calling `createApi`, will generate a JavaScript object with all required information for the other functions.
Below you can find the format of the API object, but when using this library you probably won't directly touch this object.

## Structure
```json
{
    "name": "<API name>",
    "url": "<API url>",
    "stripSlash": true,
    "defaults": {
        "<config key>": "<config function>"
    },
    "models": {
        "<model name>": {
            "url": "<model url>",
            "actionTypes": {
                "<action name>": {
                    "REQUEST": "<request model action symbol>",
                    "SUCCESS": "<success model action symbol>",
                    "FAILURE": "<failure model action symbol>",
                }
            },
            "actions": {
                "<action name>": "<action function>"
            }
        }
    },
    "endpoints": {
        "<endpoint name>": {
            "name": "<endpoint name>",
            "actionTypes": {
                "REQUEST": "<request action symbol>",
                "SUCCESS": "<success action symbol>",
                "FAILURE": "<failure action symbol>",
            },
            "<config key>": "<config function>"
        }
    },
    "customEndpoints": {
        "<custom endpoint name>": {
            "name": "<custom endpoint name>",
            "actionTypes": {
                "REQUEST": "<request custom action symbol>",
                "SUCCESS": "<success custom action symbol>",
                "FAILURE": "<failure custom action symbol>",
            },
            "<config key>": "<config function>"
        }
    },
    "actionTypes": {
        "<full action name>": "<action symbol>"
    },
    "actions": [
        "<action function>"
    ]
}
```
