/*      INVENTORY DEBUGGING MENU
    interface for testing inventory management system, currently just targets standard resources
    such as coins, fuel, metal, because the process is the same for every resource type

    Author: TheCryptoTrader69 (Alex Pazder)
    Contact: TheCryptoTrader69@gmail.com
*/

import { Color3, Color4, Vector3 } from "@dcl/sdk/math";
import { ResourceObjectData } from "../inventory/inventory-data";
import { MenuGroup3D } from "./menu-group-3D";
import { InputAction, pointerEventsSystem } from "@dcl/sdk/ecs";

export class DebugMenuInventory {
    //access pocketing
    private static instance: undefined | DebugMenuInventory;
    public static get Instance(): DebugMenuInventory {
        //ensure instance is set
        if (DebugMenuInventory.instance === undefined) {
            DebugMenuInventory.instance = new DebugMenuInventory();
        }
        return DebugMenuInventory.instance;
    }

    //3D menu group
    public menuInventoryController: MenuGroup3D;

    //callbacks
    //access via numeric position in data
    //  returns true if the count of target resource has been modified since the last server interaction
    public IsItemModifiedByIndex: (type: number, index: string) => boolean = this.isItemModifiedByIndex;
    private isItemModifiedByIndex(type: number, index: string): boolean { console.log("debug inventory menu callback not set - get experience"); return false; }
    //  get current count of target item
    public GetItemCountByIndex: (type: number, index: string, reset: boolean) => number = this.getItemCountByIndex;
    private getItemCountByIndex(type: number, index: string, reset: boolean = false): number { console.log("debug inventory menu callback not set - get item count"); return 0; }
    //  set current count of target item 
    public SetItemCountByIndex: (type: number, index: string, value: number, reset: boolean) => void = this.setItemCountByIndex;
    private setItemCountByIndex(type: number, index: string, value: number, reset: boolean = false) { console.log("debug inventory menu callback not set - set item count"); }
    //  add given amount to target item
    public AddItemCountByIndex: (type: number, index: string, value: number) => void = this.addItemCountByIndex;
    private addItemCountByIndex(type: number, index: string, value: number) { console.log("debug inventory menu callback not set - add item count"); }
    //  resets given inventory
    public ResetItems: (type: number) => void = this.resetItems;
    private resetItems(type: number) { console.log("debug inventory menu callback not set - reset items"); }

    //constructor
    //  generates and places each object
    constructor() {
        //group config
        this.menuInventoryController = new MenuGroup3D();
        this.menuInventoryController.SetColour(Color4.create(1, 0, 1, 1));
        this.menuInventoryController.AdjustMenuParent(0, Vector3.create(5, 1.5, 14));

        //main parent object setup
        //  create overhead object
        this.menuInventoryController.AddMenuObject("menuOffset", 0);
        this.menuInventoryController.AdjustMenuObject("menuOffset", 0, Vector3.create(0, 0, 0));
        this.menuInventoryController.AdjustMenuObject("menuOffset", 1, Vector3.create(1, 1, 1));

        //display setup
        //  main display object
        this.menuInventoryController.AddMenuObject("infoFrame", 2, "menuOffset");
        this.menuInventoryController.AdjustMenuObject("infoFrame", 0, Vector3.create(0, 0, 0));
        this.menuInventoryController.AdjustMenuObject("infoFrame", 1, Vector3.create(1, 1, 1));
        //  main display offset object
        this.menuInventoryController.AddMenuObject("displayInfo", 0, "menuOffset");
        this.menuInventoryController.AdjustMenuObject("displayInfo", 0, Vector3.create(0, 0, 0.0125));
        this.menuInventoryController.AdjustMenuObject("displayInfo", 1, Vector3.create(1, 1, 1));
        //  label header text
        this.menuInventoryController.AddMenuText("displayInfo", "menuLabel", "SYSTEM DEBUGGING\nINVENTORY");
        this.menuInventoryController.AdjustTextObject("displayInfo", "menuLabel", 0, Vector3.create(0, 0.59, 0));
        this.menuInventoryController.AdjustTextObject("displayInfo", "menuLabel", 1, Vector3.create(0.4, 0.4, 1));
        this.menuInventoryController.AdjustTextDisplay("displayInfo", "menuLabel", 0, 5);

        //generate a button displaying every resource object
        for (var i: number = 0; i < ResourceObjectData.length; i++) {
            //requires stored spaced index for button call 
            const index: number = i;
            //define position
            const pos: Vector3 = Vector3.create(((i % 4) - 1.5) * 0.65, 0.135 - (Math.floor(i / 4) * 0.275), 0);
            //  button object
            this.menuInventoryController.AddMenuObject("buttonResource" + i, 5, "displayInfo");
            this.menuInventoryController.AdjustMenuObject("buttonResource" + i, 0, pos);
            this.menuInventoryController.AdjustMenuObject("buttonResource" + i, 1, Vector3.create(0.22, 0.2, 0.2));
            //  click event
            pointerEventsSystem.onPointerDown(
                {
                    entity: this.menuInventoryController.GetMenuObject("buttonResource" + i).entity,
                    opts: 
                    {
                        hoverText: "[E] Add 1 " + ResourceObjectData[i].Name,
                        button: InputAction.IA_POINTER
                    }
                },
                () => {
                    DebugMenuInventory.Instance.AddItemCountByIndex(1, index.toString(), 1);
                }
            );
            //  button creator text
            this.menuInventoryController.AddMenuText("buttonResource" + i, "buttonText", "");
            this.menuInventoryController.AdjustTextObject("buttonResource" + i, "buttonText", 0, Vector3.create(0, 0, -0.031));
            this.menuInventoryController.AdjustTextObject("buttonResource" + i, "buttonText", 1, Vector3.create(0.30, 0.30, 0.03));
            this.menuInventoryController.AdjustTextDisplay("buttonResource" + i, "buttonText", 0, 5);
            //  redraw this button
            this.UpdateResourceDisplayByIndex(i);
        }

        //button -> reset resources
        //  object
        this.menuInventoryController.AddMenuObject("interactResetR", 5, "displayInfo");
        this.menuInventoryController.AdjustMenuObject("interactResetR", 0, Vector3.create(-0.9, -0.675, 0));
        this.menuInventoryController.AdjustMenuObject("interactResetR", 1, Vector3.create(0.15, 0.15, 0.15));
        //  click event
        pointerEventsSystem.onPointerDown(
            {
                entity: this.menuInventoryController.GetMenuObject("interactResetR").entity,
                opts: 
                {
                    hoverText: "RESET RESOURCES",
                    button: InputAction.IA_POINTER
                }
            },
            () => {
                this.ResetItems(1);
                this.UpdateResourceDisplay();
            }
        );
        //  label
        this.menuInventoryController.AddMenuText("interactResetR", "buttonLabel", "RESET\nRESOURCES");
        this.menuInventoryController.AdjustTextObject("interactResetR", "buttonLabel", 0, Vector3.create(0, 0, -0.04));
        this.menuInventoryController.AdjustTextObject("interactResetR", "buttonLabel", 1, Vector3.create(2.2, 2.2, 1));
        this.menuInventoryController.AdjustTextDisplay("interactResetR", "buttonLabel", 0, 1);

        //button -> server save
        //  object
        this.menuInventoryController.AddMenuObject("interactSave", 5, "displayInfo");
        this.menuInventoryController.AdjustMenuObject("interactSave", 0, Vector3.create(0.45, -0.675, 0));
        this.menuInventoryController.AdjustMenuObject("interactSave", 1, Vector3.create(0.15, 0.15, 0.15));
        //  click event
        pointerEventsSystem.onPointerDown(
            {
                entity: this.menuInventoryController.GetMenuObject("interactSave").entity,
                opts: 
                {
                    hoverText: "SAVE TO SERVER (ADD YOUR CODE)",
                    button: InputAction.IA_POINTER
                }
            },
            () => {
                //TODO: put your server call here
            }
        );
        //  label
        this.menuInventoryController.AddMenuText("interactSave", "buttonLabel", "SAVE TO\nSERVER");
        this.menuInventoryController.AdjustTextObject("interactSave", "buttonLabel", 0, Vector3.create(0, 0, -0.04));
        this.menuInventoryController.AdjustTextObject("interactSave", "buttonLabel", 1, Vector3.create(2.2, 2.2, 1));
        this.menuInventoryController.AdjustTextDisplay("interactSave", "buttonLabel", 0, 1);

        //button -> server load
        //  object
        this.menuInventoryController.AddMenuObject("interactLoad", 5, "displayInfo");
        this.menuInventoryController.AdjustMenuObject("interactLoad", 0, Vector3.create(0.9, -0.675, 0));
        this.menuInventoryController.AdjustMenuObject("interactLoad", 1, Vector3.create(0.15, 0.15, 0.15));
        //  click event
        pointerEventsSystem.onPointerDown(
            {
                entity: this.menuInventoryController.GetMenuObject("interactLoad").entity,
                opts: 
                {
                    hoverText: "LOAD FROM SERVER (ADD YOUR CODE)",
                    button: InputAction.IA_POINTER
                }
            },
            () => {
                //TODO: put your server call here
            }
        );
        //  label
        this.menuInventoryController.AddMenuText("interactLoad", "buttonLabel", "LOAD FROM\nSERVER");
        this.menuInventoryController.AdjustTextObject("interactLoad", "buttonLabel", 0, Vector3.create(0, 0, -0.04));
        this.menuInventoryController.AdjustTextObject("interactLoad", "buttonLabel", 1, Vector3.create(2.2, 2.2, 1));
        this.menuInventoryController.AdjustTextDisplay("interactLoad", "buttonLabel", 0, 1);
        
    }

    //rewrites display for a single item based on index
    public CallbackUpdateResourceDisplayByIndex(index: number) { DebugMenuInventory.Instance.CallbackUpdateResourceDisplayByIndex(index); }
    public UpdateResourceDisplayByIndex(index: number) {
        //update text
        this.menuInventoryController.SetMenuText("buttonResource" + index, "buttonText",
            "ID: " + ResourceObjectData[index].ID +
            " - Name: " + ResourceObjectData[index].Name +
            "\nCount: " + this.GetItemCountByIndex(1, index.toString(), false) +
            "\nNeeds Save: " + this.IsItemModifiedByIndex(1, index.toString())
        );
    }

    //rewrites display for ALL items
    public UpdateResourceDisplay() {
        //generate a button displaying every resource object
        for (var i: number = 0; i < ResourceObjectData.length; i++) {
            this.UpdateResourceDisplayByIndex(i);
        }
    }
}