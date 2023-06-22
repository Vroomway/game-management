/*      INVENTORY MANAGER
    provides an interface for processing/storing all the player's items and components. before
    initializing/using system ensure all delegation methods have been assigned. this system also
    includes tokenization of player experience/prestige.
    
    author: Alex Pazder
    contact: TheCryptoTrader69@gmail.com 
*/
import { Dictionary } from "../utilities/collections";
import { CargoObjectData, LevelingObjectData, RaceScoreObjectData, ResourceObjectData, TokenObjectData } from "./inventory-data";

//used to define a single item in the player's inventory
type CallbackFunction = () => void;
export class InventoryEntry {
    private id: string;
    public get ID() { return this.id; }
    //whether this item's amount has changed since last server update
    private isModified: boolean = false;
    public get IsModified() { return this.isModified };
    public set IsModified(value: boolean) {
        //log("Inventory Manager: isMod change cur=" + this.IsModified + ", new=" + value);
        //if flag state is changing, set value as reference for previous server communication
        if (this.isModified != value) this.amountPrev = this.amount;
        this.isModified = value;
    };
    //current amount of item, includes back-checking to ensure only new values force an update
    private amount: number = 0; //current item count
    private amountPrev: number = 0; //item as of last server update
    public get Amount() { return this.amount; }
    public set Amount(value: number) {
        //set modified flag
        this.IsModified = true;
        //set new value
        this.amount = value;
        //redraw ui
        this.UpdateItemUI();
    }
    /** returns the change in amount since last server update */
    public get AmountDelta() {
        return this.amount - this.amountPrev;
    }

    //listing of all registered callback events
    private updateItemUICallbacks: CallbackFunction[] = [];
    /** registers the given method to the list of ui update callbacks */
    public RegisterItemUICallback(callback: CallbackFunction) {
        this.updateItemUICallbacks.push(callback);
    }
    /** makes an update attempt to call every registed ui callbacks */
    public UpdateItemUI() {
        this.updateItemUICallbacks.forEach(callback => callback());
    }

    constructor(id: string) {
        this.id = id;
    }
}
//object that represents an enemy in scene
export class InventoryManager {
    //if true, all debugging logs will be visible (ensure is false when deploying to remove overhead)
    private static IsDebugging: boolean = true;

    //access pocketing
    private static instance: undefined | InventoryManager;
    public static get Instance(): InventoryManager {
        //ensure instance is set
        if (InventoryManager.instance === undefined) {
            InventoryManager.instance = new InventoryManager();
        }
        return InventoryManager.instance;
    }

    //resource inventory
    //  via position in data
    private itemRegistryViaIndex: Dictionary<InventoryEntry>[];
    //  via data's id, sorted by type
    private itemRegistryViaType: Dictionary<InventoryEntry>[];
    //  via data's id
    private itemRegistryViaID: Dictionary<InventoryEntry>;

    //returns number of item types
    public get ItemTypes() { return this.itemRegistryViaType.length; }
    //returns length of registry of given type
    public GetRegistryLengthOfType(type: number): number { return this.itemRegistryViaIndex[type].size(); }

    /**
     * prepares the inventory for use, populating all inventory item and callback dictionaries. 
     */
    public constructor() {
        if (InventoryManager.IsDebugging) console.log("Inventory System: initializing...");

        //initialize resource dicitonary sets
        this.itemRegistryViaIndex =
            [
                new Dictionary<InventoryEntry>(),   //leveling
                new Dictionary<InventoryEntry>(),   //resources
                new Dictionary<InventoryEntry>(),   //cargo
                new Dictionary<InventoryEntry>(),   //tokens
                //TODO: move to own system
                new Dictionary<InventoryEntry>()    //score
            ];
        this.itemRegistryViaType =
            [
                new Dictionary<InventoryEntry>(),   //leveling
                new Dictionary<InventoryEntry>(),   //resources
                new Dictionary<InventoryEntry>(),   //cargo
                new Dictionary<InventoryEntry>(),   //tokens
                //TODO: move to own system
                new Dictionary<InventoryEntry>()    //score
            ];
        this.itemRegistryViaID = new Dictionary<InventoryEntry>();

        //populate dictionaries
        for (var i: number = 0; i < LevelingObjectData.length; i++) {
            this.itemRegistryViaIndex[0].addItem(i.toString(), new InventoryEntry(LevelingObjectData[i].ID));
            this.itemRegistryViaType[0].addItem(i.toString(), this.itemRegistryViaIndex[0].getItem(i.toString()));
            this.itemRegistryViaID.addItem(LevelingObjectData[i].ID, this.itemRegistryViaIndex[0].getItem(i.toString()));
        }
        for (var i: number = 0; i < ResourceObjectData.length; i++) {
            this.itemRegistryViaIndex[1].addItem(i.toString(), new InventoryEntry(ResourceObjectData[i].ID));
            this.itemRegistryViaType[1].addItem(i.toString(), this.itemRegistryViaIndex[1].getItem(i.toString()));
            this.itemRegistryViaID.addItem(ResourceObjectData[i].ID, this.itemRegistryViaIndex[1].getItem(i.toString()));
        }
        for (var i: number = 0; i < CargoObjectData.length; i++) {
            this.itemRegistryViaIndex[2].addItem(i.toString(), new InventoryEntry(CargoObjectData[i].ID));
            this.itemRegistryViaType[2].addItem(i.toString(), this.itemRegistryViaIndex[2].getItem(i.toString()));
            this.itemRegistryViaID.addItem(CargoObjectData[i].ID, this.itemRegistryViaIndex[2].getItem(i.toString()));
        }
        for (var i: number = 0; i < TokenObjectData.length; i++) {
            this.itemRegistryViaIndex[3].addItem(i.toString(), new InventoryEntry(TokenObjectData[i].ID));
            this.itemRegistryViaType[3].addItem(i.toString(), this.itemRegistryViaIndex[3].getItem(i.toString()));
            this.itemRegistryViaID.addItem(TokenObjectData[i].ID, this.itemRegistryViaIndex[3].getItem(i.toString()));
        }
        //TODO: move to own system
        for (var i: number = 0; i < RaceScoreObjectData.length; i++) {
            this.itemRegistryViaIndex[4].addItem(i.toString(), new InventoryEntry(RaceScoreObjectData[i].ID));
            this.itemRegistryViaType[4].addItem(i.toString(), this.itemRegistryViaIndex[4].getItem(i.toString()));
            this.itemRegistryViaID.addItem(RaceScoreObjectData[i].ID, this.itemRegistryViaIndex[4].getItem(i.toString()));
        }

        if (InventoryManager.IsDebugging) console.log("Inventory System: initialized!");
    }

    //clears the inventory of the given type of all items, setting their value to 0
    public CallbackResetItems(type: number) { return InventoryManager.Instance.ResetItems(type); }
    public ResetItems(type: number) {
        //process every item in collection
        for (var i: number = 0; i < this.itemRegistryViaIndex[type].size(); i++) {
            this.SetItemCountByIndex(type, i.toString(), 0);
        }
    }

    //access via numeric position in data
    //  returns true if the count of target resource has been modified since the last server interaction
    public CallbackIsItemModifiedByIndex(type: number, index: string): boolean { return InventoryManager.Instance.IsItemModifiedByIndex(type, index); }
    public IsItemModifiedByIndex(type: number, index: string): boolean {
        return this.itemRegistryViaIndex[type].getItem(index).IsModified;
    }
    //  get current count of target item, reset for modification has been packed into this method so 
    //      server calls accessing the value can easily reset the save-state of the inv entry
    public CallbackGetItemCountByIndex(type: number, index: string, reset: boolean = false): number { return InventoryManager.Instance.GetItemCountByIndex(type, index, reset); }
    public GetItemCountByIndex(type: number, index: string, reset: boolean = false): number {
        if (reset) this.itemRegistryViaIndex[type].getItem(index).IsModified = false;
        return this.itemRegistryViaIndex[type].getItem(index).Amount;
    }
    //  set current count of target item, reset for modification has been packed into this meathod so
    //      server calls setting the value can easily reset the save-state of the inv entry
    public CallbackSetItemCountByIndex(type: number, index: string, value: number, reset: boolean = false) { InventoryManager.Instance.SetItemCountByIndex(type, index, value, reset); }
    public SetItemCountByIndex(type: number, index: string, value: number, reset: boolean = false) {
        this.itemRegistryViaIndex[type].getItem(index).Amount = value;
        if (reset) this.itemRegistryViaIndex[type].getItem(index).IsModified = false;
    }
    //  add given amount to target item
    public CallbackAddItemCountByIndex(type: number, index: string, value: number) { InventoryManager.Instance.AddItemCountByIndex(type, index, value); }
    public AddItemCountByIndex(type: number, index: string, value: number) {
        //log("inventory adding count to item, type=" + type + ", index=" + index + ", value=" + value);
        this.itemRegistryViaIndex[type].getItem(index).Amount += value;
    }
    //  updates the ui update meathod of the target item 
    public CallbackSetUpdateUI(type: number, index: string, callbackUpdateUI: () => void) { return InventoryManager.Instance.RegisterUpdateUI(type, index, callbackUpdateUI); }
    public RegisterUpdateUI(type: number, index: string, callbackUpdateUI: () => void) {
        this.itemRegistryViaIndex[type].getItem(index).RegisterItemUICallback(callbackUpdateUI);
    }
    //  retrieves actual inventory entry object (use with caution, mishandling this will brick the system)
    public CallbackGetEntry(type: number, index: string): InventoryEntry { return InventoryManager.Instance.GetEntry(type, index); }
    public GetEntry(type: number, index: string): InventoryEntry {
        return this.itemRegistryViaIndex[type].getItem(index);
    }

    //access via type + id combo
    //  returns true if the count of target resource has been modified since the last server interaction
    public CallbackIsItemModifiedByType(type: number, index: string): boolean { return InventoryManager.Instance.IsItemModifiedByType(type, index); }
    public IsItemModifiedByType(type: number, index: string): boolean {
        return this.itemRegistryViaType[type].getItem(index).IsModified;
    }
    //  get current count of target item
    public CallbackGetItemCountByType(type: number, index: string, reset: boolean = false): number { return InventoryManager.Instance.GetItemCountByType(type, index, reset); }
    public GetItemCountByType(type: number, index: string, reset: boolean = false): number {
        if (reset) this.itemRegistryViaType[type].getItem(index).IsModified = false;
        return this.itemRegistryViaType[type].getItem(index).Amount;
    }
    //  set current count of target item 
    public CallbackSetItemCountByType(type: number, index: string, value: number, reset: boolean = false) { InventoryManager.Instance.SetItemCountByType(type, index, value, reset); }
    public SetItemCountByType(type: number, index: string, value: number, reset: boolean = false) {
        this.itemRegistryViaType[type].getItem(index).Amount = value;
        if (reset) this.itemRegistryViaType[type].getItem(index).IsModified = false;
    }
    //  add given amount to target item
    public CallbackAddItemCountByType(type: number, index: string, value: number) { InventoryManager.Instance.AddItemCountByType(type, index, value); }
    public AddItemCountByType(type: number, index: string, value: number) {
        this.itemRegistryViaType[type].getItem(index).Amount += value;
    }

    //access via ID (all IDs must be unique)
    //  get item count using item's name as indexing 
    public CallbackGetItemCountByID(id: any, reset: boolean = false): number { return InventoryManager.Instance.GetItemCountByID(id, reset); }
    public GetItemCountByID(id: any, reset: boolean = false): number {
        if (reset) this.itemRegistryViaID.getItem(id.toString()).IsModified = false;
        return this.itemRegistryViaID.getItem(id.toString()).Amount;
    }
    //  set item count using item's name as indexing 
    public CallbackSetItemCountByID(id: any, value: number, reset: boolean = false) { InventoryManager.Instance.SetItemCountByID(id, value, reset); }
    public SetItemCountByID(id: any, value: number, reset: boolean = false) {
        this.itemRegistryViaID.getItem(id.toString()).Amount = value;
        if (reset) this.itemRegistryViaID.getItem(id.toString()).IsModified = false;
    }
    //  modify item count using item's name as indexing 
    public CallbackAddItemCountByID(id: any, value: number) { InventoryManager.Instance.AddItemCountByID(id, value); }
    public AddItemCountByID(id: any, value: number) {
        this.itemRegistryViaID.getItem(id.toString()).Amount += value;
    }
    //  updates the ui update meathod of the target item 
    public RegisterUpdateUIByID(id: any, callbackUpdateUI: () => void) {
        this.itemRegistryViaID.getItem(id.toString()).RegisterItemUICallback(callbackUpdateUI);
    }
}