# hide-players
tera-proxy module to hide/show players

## Dependency
- `Command` module

## Usage
- __`hide` · `ㅗㅑㅇㄷ`__
  - Toggle on/off
### Parameters
- __`a` · ` ㅁ`__
  - Toggle guild/party member on/off
- __`r` · `ㄱ`__
  - Refresh filter

## Config
- __`enable`__
  - Initialize module on/off
  - Default is `true`
- __`enableParty`__
  - Initialize option to show guild/party member on/off
  - Default is `true`

## Info
- Original author : [wuaw](https://github.com/wuaw)
- **Support seraph via paypal donations, thanks in advance : [paypal](https://www.paypal.me/seraphinush)**
- Hides all players except guild and party/raid members

## Changelog
<details>

    2.06
    - Added auto-update support
    - Updated to latest tera-data definition format
    - Refactored config file
    -- Added `enable`
    -- Added `enableParty`
    2.05
    - Added battleground to blacklist
    - Revised refresh condition for leaving party
    - Revised refresh condition for party length
    - Revised refresh command
    - Added `a` command parameter to toggle guild/party members
    2.04
    - Added zone blacklist for client crash hotfix
    - Added Guardian Legion mission hotfix by [HugeDong69](https://github.com/hugedong69)
    2.03
    - Fixed error which rendered players with no guild
    2.02
    - Updated code and font color
    2.01
    - Updated code aesthetics
    2.00
    - Updated code
    - Added string function
    - Updated to hide all players except guild and party members
    1.31
    - Updated code aesthetics
    1.30
    - Updated code aesthetics
    1.21
    - Added command for Korean keyboard
    1.20
    - Updated code
    - Removed protocol version restriction
    1.10
    - Personalized code aesthetics
    1.00
    - Initial fork

</details>
