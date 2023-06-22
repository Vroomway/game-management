/*		LEVEL PERMISSIONS DATA
    contains listings of every permission to be given to the player at a given level

    this has been split from the main level rewards data to allow for easier processing
    when experience is set. rewards will only be given on organic level gain, while
    these will be set whenever a level is set (including initialization)

    data entry breakdown:
        permission def example: [level, index, name]
            level: defines level required to acquire permission
            index: defines access index for permission (you can use this as a label in your de/activation code)
            name: display name for permission
        	
    Author: TheCryptoTrader69 (Alex Pazder)
    Contact: TheCryptoTrader69@gmail.com
*/
interface LevelPermissions { [permission: string]: any[][]; }
export const LevelPermissionData: LevelPermissions =
{
    //teleport access
    "PermissionsTeleports":
        [
            [0, 0, "TeleportLocation0"],
            [10, 1, "TeleportLocation1"],
            [15, 2, "TeleportLocation2"],
            [20, 3, "TeleportLocation3"]
        ],
    //wearable claim
    "PermissionsWearables":
        [
            [10, 0, "WearableClaim0"],
            [30, 1, "WearableClaim1"],
            [50, 2, "WearableClaim2"],
            [70, 3, "WearableClaim3"],
        ]
}

/*      LEVEL REWARDS DATA
    contains listings of every rewards given to the player based
    on newly aquirred levels. every level needs an entry (even if empty).
    this reduces the processing overhead of indexing each level individually
    and provides easy modability.
    
    level rewards are generated externally using the rewards-generator.js
    tool. you can change the data set's generation features within the tool,
    generate a new rewards file, and replace this file's data set with the result.

    data entry breakdown:
        reward def example: [type, subtype, count]
            type: defines type of reward to be given
                [0=resource, 1=Cargo, 2=Claim Token]
            subtype: defines the specific reward tied to that type
                ex for resources: [0=fuel, 1=coins, 2=propulsion, 3=cannisters, 4=antimatter]
            count: number of items to award player
*/
interface LevelRewardData { [level: string]: any[][]; }
export const LevelRewardData: LevelRewardData =
//when regenerating level rewards data using the python script:
//  delete everthing below this point, then copy and past the contents of the output file below
{
    "0":
        [
            ["fuel", 250]
        ],
    "1":
        [
            ["fuel", 250]
        ],
    "2":
        [
            ["fuel", 250]
        ],
    "3":
        [
            ["fuel", 250]
        ],
    "4":
        [
            ["fuel", 250]
        ],
    "5":
        [
            ["fuel", 250],
            ["coins", 100]
        ],
    "6":
        [
            ["fuel", 250]
        ],
    "7":
        [
            ["fuel", 250]
        ],
    "8":
        [
            ["fuel", 250]
        ],
    "9":
        [
            ["fuel", 250]
        ],
    "10":
        [
            ["fuel", 250],
            ["coins", 100],
            ["smCargo", 1]
        ],
    "11":
        [
            ["fuel", 250]
        ],
    "12":
        [
            ["fuel", 250]
        ],
    "13":
        [
            ["fuel", 250]
        ],
    "14":
        [
            ["fuel", 250]
        ],
    "15":
        [
            ["fuel", 250],
            ["coins", 100],
            ["propulsion", 2],
            ["mdCargo", 1]
        ],
    "16":
        [
            ["fuel", 250]
        ],
    "17":
        [
            ["fuel", 250]
        ],
    "18":
        [
            ["fuel", 250]
        ],
    "19":
        [
            ["fuel", 250]
        ],
    "20":
        [
            ["fuel", 250],
            ["coins", 100],
            ["antimatter", 5],
            ["lgCargo", 1]
        ],
    "21":
        [
            ["fuel", 250]
        ],
    "22":
        [
            ["fuel", 250]
        ],
    "23":
        [
            ["fuel", 250]
        ],
    "24":
        [
            ["fuel", 250]
        ],
    "25":
        [
            ["fuel", 250],
            ["coins", 100],
            ["propulsion", 2],
            ["cannisters", 5],
            ["lgCargo", 1]
        ],
    "26":
        [
            ["fuel", 250]
        ],
    "27":
        [
            ["fuel", 250]
        ],
    "28":
        [
            ["fuel", 250]
        ],
    "29":
        [
            ["fuel", 250]
        ],
    "30":
        [
            ["fuel", 250],
            ["coins", 100],
            ["propulsion", 2],
            ["lgCargo", 1],
            ["token0", 1]
        ],
    "31":
        [
            ["fuel", 250]
        ],
    "32":
        [
            ["fuel", 250]
        ],
    "33":
        [
            ["fuel", 250]
        ],
    "34":
        [
            ["fuel", 250]
        ],
    "35":
        [
            ["fuel", 250],
            ["coins", 100],
            ["propulsion", 2],
            ["antimatter", 5],
            ["lgCargo", 1]
        ],
    "36":
        [
            ["fuel", 250]
        ],
    "37":
        [
            ["fuel", 250]
        ],
    "38":
        [
            ["fuel", 250]
        ],
    "39":
        [
            ["fuel", 250]
        ],
    "40":
        [
            ["fuel", 250],
            ["coins", 100],
            ["propulsion", 2],
            ["cannisters", 5],
            ["lgCargo", 1]
        ],
    "41":
        [
            ["fuel", 250]
        ],
    "42":
        [
            ["fuel", 250]
        ],
    "43":
        [
            ["fuel", 250]
        ],
    "44":
        [
            ["fuel", 250]
        ],
    "45":
        [
            ["fuel", 250],
            ["coins", 100],
            ["propulsion", 2],
            ["lgCargo", 1],
            ["token1", 1]
        ],
    "46":
        [
            ["fuel", 250]
        ],
    "47":
        [
            ["fuel", 250]
        ],
    "48":
        [
            ["fuel", 250]
        ],
    "49":
        [
            ["fuel", 250]
        ],
    "50":
        [
            ["fuel", 250],
            ["coins", 100],
            ["propulsion", 2],
            ["cannisters", 5],
            ["lgCargo", 1]
        ],
    "51":
        [
            ["fuel", 250]
        ],
    "52":
        [
            ["fuel", 250]
        ],
    "53":
        [
            ["fuel", 250]
        ],
    "54":
        [
            ["fuel", 250]
        ],
    "55":
        [
            ["fuel", 250],
            ["coins", 100],
            ["propulsion", 2],
            ["cannisters", 5],
            ["antimatter", 5],
            ["lgCargo", 1]
        ],
    "56":
        [
            ["fuel", 250]
        ],
    "57":
        [
            ["fuel", 250]
        ],
    "58":
        [
            ["fuel", 250]
        ],
    "59":
        [
            ["fuel", 250]
        ]
};