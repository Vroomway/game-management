/*      GAME MENU
    manages debugging menues used to test systems


    Author: TheCryptoTrader69 (Alex Pazder)
    Contact: TheCryptoTrader69@gmail.com
*/
import { Entity, engine, Transform, InputAction, pointerEventsSystem, MeshRenderer, MeshCollider } from "@dcl/sdk/ecs";
import { Vector3, Quaternion } from "@dcl/sdk/math";
import { ResourceObjectData } from "../inventory/inventory-data";
import { InventoryManager } from "../inventory/inventory-manager";
import { LevelManager } from "../leveling/level-manager";
import { DebugMenuInventory } from "./debug-menu-inventory";
import { DebuggingMenuLeveling } from "./debug-menu-leveling";
import { LevelPermissionData } from "../leveling/level-data";

/**
 * acts as the primary controller for setting up and displaying debug menues
 */
export class DebugMenuController {
    //access pocketing
    private static instance: undefined | DebugMenuController;
    public static get Instance(): DebugMenuController {
        //ensure instance is set
        if (DebugMenuController.instance === undefined) {
            DebugMenuController.instance = new DebugMenuController();
        }

        return DebugMenuController.instance;
    }

    /**
     * initializes the debugging menu for the inventory system
     */
    public InitDebugMenuInventory() {
        //NOTE: this is an example of how systems should be set up to avoid circular dependancy/respect order of operation
        //    this system only actually functions/has a footprint IF it is enabled through the lines below, if it is not called
        //    here it will not initialize and will not take additional resources (unlike basically everthing else in the current
        //    implementation).
        //DEBUGGING: inventory management menu (just comment out this code and they system will not have a footprint)
        console.log("Debug Menu: inventory menu initializing...");
        
        //  prepare interaction menu
        DebugMenuInventory.Instance.menuInventoryController.SetMenuState(true);
        //  set menu callbacks
        DebugMenuInventory.Instance.IsItemModifiedByIndex = InventoryManager.Instance.CallbackIsItemModifiedByIndex;
        DebugMenuInventory.Instance.GetItemCountByIndex = InventoryManager.Instance.CallbackGetItemCountByIndex;
        DebugMenuInventory.Instance.SetItemCountByIndex = InventoryManager.Instance.CallbackSetItemCountByIndex;
        DebugMenuInventory.Instance.AddItemCountByIndex = InventoryManager.Instance.CallbackAddItemCountByIndex;
        DebugMenuInventory.Instance.ResetItems = InventoryManager.Instance.CallbackResetItems;
        //  generate callbacks for auto updates (this will overwrite anything set above)
        for (var i: number = 0; i < ResourceObjectData.length; i++) {
            const index: number = i;
            InventoryManager.Instance.RegisterUpdateUI(1, index.toString(), () => DebugMenuInventory.Instance.UpdateResourceDisplayByIndex(index));
        }
        DebugMenuInventory.Instance.UpdateResourceDisplay();

        console.log("Debug Menu: inventory menu initialized!");
    }

    /**
     * initializes the debugging menu for the leveling system
     */
    public InitDebugMenuLeveling() {
        //example of permissions set up
        //permissions de/activate objects based on the player's current level, you can change the implementation to fit your needs
        //in the level manager class.
        
        //  create demo teleport objects
        for (var i: number = 0; i < LevelPermissionData.PermissionsTeleports.length; i++) {
            //create entity
            const teleEntity:Entity = engine.addEntity();
            MeshRenderer.setBox(teleEntity);
            MeshCollider.setBox(teleEntity);
            Transform.create(teleEntity,
                ({
                    position: Vector3.create(15, 1, 1 + (i * 1)),
                    scale: Vector3.create(0.5, 2, 0.5),
                    rotation: Quaternion.fromEulerDegrees(0, 0, 0)
                }));
            
            //click event
            pointerEventsSystem.onPointerDown(
                {
                    entity: teleEntity,
                    opts: 
                    {
                        hoverText: "[E] " + LevelPermissionData.PermissionsTeleports[i][2],
                        button: InputAction.IA_POINTER
                    }
                },
                () => {
                    //put teleport code here
                    console.log("ADD CODE HERE");
                }
            );

            //link to perms management
            LevelManager.Instance.permObjects_teleports[i] = teleEntity;
        }
        //  create demo wearable claim objects
        for (var i: number = 0; i < LevelPermissionData.PermissionsWearables.length; i++) {
            //create entity
            const permEntity:Entity = engine.addEntity();
            MeshRenderer.setBox(permEntity);
            MeshCollider.setBox(permEntity);
            Transform.create(permEntity,
                ({
                    position: Vector3.create(15, 1, 7 + (i * 1)),
                    scale: Vector3.create(0.5, 2, 0.5),
                    rotation: Quaternion.fromEulerDegrees(0, 0, 0)
                }));
            
            //click event
            pointerEventsSystem.onPointerDown(
                {
                    entity: permEntity,
                    opts: 
                    {
                        hoverText: "[E] " + LevelPermissionData.PermissionsWearables[i][2],
                        button: InputAction.IA_POINTER
                    }
                },
                () => {
                    //put teleport code here
                    console.log("ADD CODE HERE");
                }
            );

            //link to perms management
            LevelManager.Instance.permObjects_wearables[i] = permEntity;
        }
        //process new permission objects
        LevelManager.Instance.ProcessPermissions(0);

        //spawn leveling interaction menu
        //  prepare interaction menu
        DebuggingMenuLeveling.Instance.menuGroupLevelSystem.SetMenuState(true);
        //  set menu callbacks
        DebuggingMenuLeveling.Instance.Initialize = LevelManager.Instance.CallbackInitialize;
        DebuggingMenuLeveling.Instance.GetExperience = LevelManager.Instance.CallbackGetExperience;
        DebuggingMenuLeveling.Instance.GetExperienceNext = LevelManager.Instance.CallbackGetExperienceNext;
        DebuggingMenuLeveling.Instance.AddExperience = LevelManager.Instance.CallbackAddExperience;
        DebuggingMenuLeveling.Instance.GetLevel = LevelManager.Instance.GetLevelDisplayValue;
        DebuggingMenuLeveling.Instance.GetPrestige = LevelManager.Instance.CallbackGetPrestige;
        DebuggingMenuLeveling.Instance.AttemptPerstige = LevelManager.Instance.CallbackPerstigeAttempt;
        DebuggingMenuLeveling.Instance.GetStringRewards = LevelManager.Instance.GetLevelRewards;
        DebuggingMenuLeveling.Instance.GetStringPermissions = LevelManager.Instance.GetLevelPermissions;
        //  initialize menu
        DebuggingMenuLeveling.Instance.UpdateDisplay();
    }
}