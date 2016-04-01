# homebridge-hdmi
HDMI plugin for homebridge: https://github.com/nfarina/homebridge

# Installation

The Homebridge HDMI plugin has been designed to run on the Raspberry Pi

The quickest way to get up and running is to install via the Homebridge Ansible Pi : https://github.com/x2c/homebridge-ansible-pi

To install manually run "sudo npm install -g homebridge-hdmi" you will also need to install LibCEC https://github.com/Pulse-Eight/libcec



# Configuration

Configuration sample:

 ```
"accessories": [
    {
        "accessory": "TV",
        "name": "TV"
    },
    {
        "accessory": "AMP",
        "name": "Amplifier"
    }
]
```

# Example Siri commands
"Hey Siri, turn the TV on"
"Hey Siri, turn the TV off"
"Hey Siri, turn the Amplifier on"
"Hey Siri, turn the Amplifier off"

