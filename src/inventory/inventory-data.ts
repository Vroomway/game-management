/*      INVENTORY ITEM DATA
    this file contains all object definitions for items the player can gather, craft, etc.
    counts/values of these items are managed through the 'PlayerStats' class
    leveling data objects (experience and prestige) are also defined here as well b.c they are
        simply a different type of inventory item the way they are being used (basically flag checks)
  
    NOTE: all IDs should be unique across ALL objects
 
    Author: TheCryptoTrader69 (Alex Pazder)
    Contact: TheCryptoTrader69@gmail.com
*/
//interfaces
interface BaseObject {
    ID: string; //unique index, this is the value sent to the server
    Name: string;   //display name 
    Desc: string;   //display desc, hover text
}
interface ResourceObject {
    ID: string; //unique index, this is the value sent to the server
    Rarity: number; //TODO: noticed this in the rewards calculator, but currently not implemented
    Name: string;   //display name 
    Desc: string;   //display desc, hover text
}
interface CargoObject {
    ID: string; //unique index, this is the value sent to the server
    Name: string;   //display name 
    Desc: string;   //display desc, hover text
    Rewards: { Type: number, ID: string, Count: number }[];   //represents rewards that are awarded upon opening
}
//call-values for IDs, leveling
export enum ItemNameLeveling {
    exp = "exp", lvl = "lvl"
}
/**
 * contains all object definitions for leveling items
 */
export const LevelingObjectData: BaseObject[] =
    [
        //experience
        {
            ID: "exp",
            Name: "Experience",
            Desc: "<HOVER_TEXT>"
        },
        //prestige
        {
            ID: "lvl",
            Name: "Prestige",
            Desc: "<HOVER_TEXT>"
        }
    ]
//call-values for IDs, resources (seperates access labels and object IDs)
export enum ItemNameResource {
    coins = "coins", fuel = "fuel",
    metal = "metal", rubber = "rubber", glass = "glass", propulsion = "propulsion",
    wires = "wires", antimatter = "antimatter", cannisters = "cannisters", circuitBoard = "circuitBoard"
}
/**
 * contains all object definitions for resource items
 */
export const ResourceObjectData: ResourceObject[] =
    [
        //core resources
        {
            ID: "coins",
            Rarity: 0,
            Name: "Coins",
            Desc: "<HOVER_TEXT>"
        },
        {
            ID: "fuel",
            Rarity: 0,
            Name: "Fuel",
            Desc: "<HOVER_TEXT>"
        },
        //basic
        {
            ID: "metal",
            Rarity: 0,
            Name: "Metal",
            Desc: "<HOVER_TEXT>"
        },
        {
            ID: "rubber",
            Rarity: 0,
            Name: "Rubber",
            Desc: "<HOVER_TEXT>"
        },
        {
            ID: "glass",
            Rarity: 1,
            Name: "Glass",
            Desc: "<HOVER_TEXT>"
        },
        {
            ID: "propulsion",
            Rarity: 3,
            Name: "Propulsion",
            Desc: "<HOVER_TEXT>"
        },
        //components
        {
            ID: "wires",
            Rarity: 1,
            Name: "Wires",
            Desc: "<HOVER_TEXT>"
        },
        {
            ID: "antimatter",
            Rarity: 0,
            Name: "Antimatter",
            Desc: "<HOVER_TEXT>"
        },
        {
            ID: "cannisters",
            Rarity: 0,
            Name: "Cannisters",
            Desc: "<HOVER_TEXT>"
        },
        {
            ID: "circuitBoard",
            Rarity: 2,
            Name: "Circuit Boards",
            Desc: "<HOVER_TEXT>"
        }
    ]
//call-values for IDs, cargo
export enum ItemNameCargo {
    smCargo = "smCargo", mdCargo = "mdCargo", lgCargo = "lgCargo"
}
//all cargo
export const CargoObjectData: CargoObject[] =
    [
        {
            ID: "smCargo",
            Name: "Small Cargo",
            Desc: "<HOVER_TEXT>",
            Rewards:
                [
                    { Type: -1, ID: "0", Count: 5 },   //loot generation rounds
                    { Type: 0, ID: "0", Count: 5 }   //experience
                ]
        },
        {
            ID: "mdCargo",
            Name: "Medium Cargo",
            Desc: "<HOVER_TEXT>",
            Rewards:
                [
                    { Type: -1, ID: "0", Count: 12 },   //loot generation rounds
                    { Type: 0, ID: "0", Count: 10 }   //experience
                ]
        },
        {
            ID: "lgCargo",
            Name: "Large Cargo",
            Desc: "<HOVER_TEXT>",
            Rewards:
                [
                    { Type: -1, ID: "0", Count: 40 },   //loot generation rounds
                    { Type: 0, ID: "0", Count: 25 }   //experience
                ]
        }
    ]
//call-values for IDs, cargo
export enum ItemNameToken {
    token0 = "token0", token1 = "token1", token2 = "token2"
}
//all tokens
export const TokenObjectData: BaseObject[] =
    [
        {
            ID: "token0",
            Name: "Common Token",
            Desc: "<HOVER_TEXT>"
        },
        {
            ID: "token1",
            Name: "Uncommon Token",
            Desc: "<HOVER_TEXT>"
        },
        {
            ID: "token2",
            Name: "Rare Token",
            Desc: "<HOVER_TEXT>"
        }
    ]

//TODO: this is a quick-fix append, race scores should be relegated to their own
//  data & management structure (just done this way to avoid additional restructure/cost)
//  ideally the management structure will compress times, collected coins, etc into a single
//  entry (inv entry does not support this atm)
//before this can be broken appart into a properly scalable system data tags will need to be 
//aligned ('entry type' + 'entry attribute', ex: soloSprint + Time || Coins) atm data is too
//chaotic/a few elements do not conform
interface RaceScoreObject {
    ID: string; //unique index, this is the value sent to the server
    Name: string;   //display name 
}
//call-values for IDs, leveling
export enum ItemNameRaceScore {
    soloSprintTime = "soloSprintTime", sprintCoinsCollected = "sprintCoinsCollected",
    sprintCompTime = "sprintCompTime", sprintCoinsQtyCollected = "sprintCoinsQtyCollected",
    circuitTime = "circuitTime", circuitsCoinsCollected = "circuitsCoinsCollected",
    circuitCompTime = "circuitCompTime", compPoints = "compPoints",
    dragRaceTime = "dragRaceTime",
}
/**
 * contains all object definitions for race scores
 */
export const RaceScoreObjectData: RaceScoreObject[] =
    [
        //solo sprint
        {
            ID: "soloSprintTime",
            Name: "",
        },
        {
            ID: "sprintCoinsCollected",
            Name: "",
        },
        //solo comp
        {
            ID: "sprintCompTime",
            Name: "",
        },
        {
            ID: "sprintCoinsQtyCollected",
            Name: "",
        },
        //circuit
        {
            ID: "circuitTime",
            Name: "",
        },
        {
            ID: "circuitsCoinsCollected",
            Name: "",
        },
        //circuit comp
        {
            ID: "circuitCompTime",
            Name: "",
        },
        {
            ID: "compPoints",
            Name: "",
        },
        //drag race
        {
            ID: "dragRaceTime",
            Name: "",
        }
    ]