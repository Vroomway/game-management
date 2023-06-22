/*      MENU GROUP 3D
    used to create a 3d menu group in the game scene. menu objects can be created and 
    organized through an instance of this manager.

    the menu group and toggle button are placed as parents of the object given, all
    menu objects are parented onto the menu group, and all text shape entities are
    parented to those menu objects.

    Author: TheCryptoTrader69 (Alex Pazder)
    Contact: TheCryptoTrader69@gmail.com
*/
import { Entity, Transform, engine, TextShape, GltfContainer, ColliderLayer, EntityState, EngineInfo, MeshRenderer, Font, PBTextShape, TextAlignMode } from "@dcl/sdk/ecs";
import { Vector3, Quaternion, Color4 } from "@dcl/sdk/math";
import { Dictionary, List } from "../utilities/collections";

/**
 * used to manage a group of 3D menu objects
 */
export class MenuGroup3D {
    //menu model locations
    //  TODO: set this as a static after SDK bugs are fixed
    private static MENU_OBJECT_MODELS: string[] =
    [
        //empty
        "",
        //panels
        "models/utilities/Menu3D_Panel_Square.glb",
        "models/utilities/Menu3D_Panel_Long.glb",
        //buttons
        "models/utilities/Menu3D_Button_Square.glb",
        "models/utilities/Menu3D_Button_Long.glb",
        "models/utilities/Menu3D_Button_Narrow.glb",
    ];

    //parental object for menu group, holds all associated menu objects
    public groupParent: Entity;
    
    //collections for entity access
    private menuList: List<MenuObject3D>;
    private menuDict: Dictionary<MenuObject3D>;

    //constructor
    constructor() {
        //create group parent
        this.groupParent = engine.addEntity();
        Transform.create(this.groupParent,
        ({
            position: Vector3.create(8, 1, 8), //defaults to center of first parcel
            scale: Vector3.create(1, 1, 1),
            rotation: Quaternion.fromEulerDegrees(0, 0, 0)
        }));

        //initialize collections
        this.menuList = new List<MenuObject3D>();
        this.menuDict = new Dictionary<MenuObject3D>();
    }
    
    /**
     * sets the state of the primary menu tree
     * @param state new display state for menu
     */
    public SetMenuState(state: boolean) {
        //TODO: replace when you can hide/soft remove entities again
        //enable menu
        if (state) Transform.getMutable(this.groupParent).scale = Vector3.One(); 
        //disable menu
        else Transform.getMutable(this.groupParent).scale = Vector3.Zero(); 
    }

    /**
     * modifies the transform details of the menu group parent object
     * @param type 0->position, 1->scale, 2->rotation
     * @param vect new value
     */
    public AdjustMenuParent(type: number, vect: Vector3) {
        switch (type) {
            case 0:
                Transform.getMutable(this.groupParent).position = vect;
                break;
            case 1:
                Transform.getMutable(this.groupParent).scale = vect;
                break;
            case 2:
                Transform.getMutable(this.groupParent).rotation = Quaternion.fromEulerDegrees(vect.x, vect.y, vect.z);
                break;
        }
    }

    /**
     * returns the requested menu object
     * @param objName name of targeted object
     * @returns targeted object
     */
    public GetMenuObject(objName: string): MenuObject3D {
        return this.menuDict.getItem(objName);
    }

    /**
     * returns the requested menu object
     * @param objName name of targeted object
     * @param textName name of targeted text (child on targeted object)
     * @returns text shape reference
     */
    public GetMenuObjectText(objName: string, textName: string): PBTextShape {
        return this.GetMenuObject(objName).GetTextObject(textName);
    }

    /**
     * prepares a menu object of the given size/shape, with the given text
     * @param name access label for menu to be registered under
     * @param type index of menu object to be used as base
     * @param parent target parent
     */
    public AddMenuObject(name: string, type: number, parent: string = '') {
        //create menu entity
        const tmp: MenuObject3D = new MenuObject3D(MenuGroup3D.MENU_OBJECT_MODELS[type], name);

        //if no target parent, set as child under main object
        if (parent != '') Transform.getMutable(tmp.entity).parent = this.GetMenuObject(parent).entity;
        //if target parent, set as child under target
        else Transform.getMutable(tmp.entity).parent = this.groupParent;

        //register object to collections
        this.menuList.addItem(tmp);
        this.menuDict.addItem(name, tmp);
    }

    /**
     * changes a targeted menu object entity
     * @param name access label of targeted object
     * @param type 0->position, 1->scale, 2->rotation
     * @param vect new value of targeted type
     */
    public AdjustMenuObject(name: string, type: number, vect: Vector3) {
        switch (type) {
            case 0:
                Transform.getMutable(this.GetMenuObject(name).entity).position = vect;
                break;
            case 1:
                Transform.getMutable(this.GetMenuObject(name).entity).scale = vect;
                break;
            case 2:
                Transform.getMutable(this.GetMenuObject(name).entity).rotation = Quaternion.fromEulerDegrees(vect.x, vect.y, vect.z);
                break;
        }
    }

    /**
     * prepares a menu object of the given size/shape, with the given text
     * @param nameObj access label of targeted object
     * @param nameTxt access label for text object 
     * @param text text that will be displayed
     */
    public AddMenuText(nameObj: string, nameTxt: string, text: string) {
        this.GetMenuObject(nameObj).AddTextObject(nameTxt, text, this.textColour);
    }

    /**
     * sets a text object's display text
     * @param nameObj access label of targeted object
     * @param nameTxt access label for text object 
     * @param text new display text
     */
    public SetMenuText(nameObj: string, nameTxt: string, text: string) {
        this.menuDict.getItem(nameObj).ChangeText(nameTxt, text);
    }

    //changes a text object's textshape settings
    public AdjustTextObject(nameObj: string, nameTxt: string, type: number, value: Vector3) {
        this.menuDict.getItem(nameObj).AdjustTextObject(nameTxt, type, value);
    }

    //changes a text object's textshape settings
    public AdjustTextDisplay(nameObj: string, nameTxt: string, type: number, value: number, value1: number = 1) {
        this.menuDict.getItem(nameObj).AdjustTextDisplay(nameTxt, type, value, value1);
    }

    private textColour: Color4 = Color4.Black();
    public SetColour(colour: Color4) {
        //change default colour
        this.textColour = colour;

        //apply change to all menu text objects
        for (var i: number = 0; i < this.menuList.size(); i++) {
            for (var j: number = 0; j < this.menuList.getItem(i).textList.size(); j++) {
                TextShape.getMutable(this.menuList.getItem(i).textList.getItem(j)).textColor = this.textColour;
            }
        }
    }
}

/**
 * used to represent and manage a single 3D menu object
 * 
 * each 3D menu object consists of a single parent entity and
 * several children textshape entities.
 */
export class MenuObject3D {
    //access label
    public Name: string;

    //e
    public entity: Entity;

    //collections of all text entities
    textList: List<Entity>;
    textDict: Dictionary<Entity>;

    //constructor
    constructor(model: string, nam: string) {
        //create entity object
        this.entity = engine.addEntity();

        //add transform
        Transform.create(this.entity,
        ({
            position: Vector3.create(0, 0, 0),
            scale: Vector3.create(1, 1, 1),
            rotation: Quaternion.fromEulerDegrees(0, 0, 0)
        }));

        //if model def, add custom object
        if (model != '')
        {
            GltfContainer.create(this.entity, {
                src: model,
                visibleMeshesCollisionMask: ColliderLayer.CL_POINTER,
                invisibleMeshesCollisionMask: undefined
            });
        }

        //set access name
        this.Name = nam;

        //collections
        this.textList = new List<Entity>();
        this.textDict = new Dictionary<Entity>();
    }

    public SetObjectState(state: boolean) {
        //TODO: replace when you can hide/soft remove entities again
        //enable menu
        if (state) Transform.getMutable(this.entity).scale = Vector3.One(); 
        //disable menu
        else Transform.getMutable(this.entity).scale = Vector3.Zero(); 
    }

    public GetTextObject(name: string): PBTextShape {
        return TextShape.getMutable(this.textDict.getItem(name));
    }

    //prepares a text object with the given text, 
    //  registered under the given name
    public AddTextObject(name: string, text: string, colour: Color4) : PBTextShape {
        //create entity
        const tmp: Entity = engine.addEntity();
        
        //add transform
        Transform.create( tmp,
        ({
            position: Vector3.create(0, 0, 0),
            scale: Vector3.create(1, 1, 1),
            rotation: Quaternion.fromEulerDegrees(0, 0, 0),
            parent: this.entity
        }));

        //add text shapre
        const tmpTS = TextShape.create(tmp,
        {
            text: text,
            textColor: colour,
            width: 0,
            height:0,
            textWrapping: false,
            fontSize: 9,
            font: Font.F_SANS_SERIF
        });

        //register object to collections
        this.textList.addItem(tmp);
        this.textDict.addItem(name, tmp);

        return tmpTS;
    }

    //changes a targeted text object entity
    //  type: 0->position, 1->scale, 2->rotation
    public AdjustTextObject(name: string, type: number, vect: Vector3) {
        switch (type) {
            case 0:
                Transform.getMutable(this.textDict.getItem(name)).position = vect;
                break;
            case 1:
                Transform.getMutable(this.textDict.getItem(name)).scale = vect;
                break;
            case 2:
                Transform.getMutable(this.textDict.getItem(name)).rotation = Quaternion.fromEulerDegrees(vect.x, vect.y, vect.z);
                break;
        }
    }

    /**
     * changes a targeted menu object entity
     * @param name access label for text object
     * @param type 0->font size, 1->line spacing, 2->align, 
     * @param value primary value to set
     * @param value1 used as secondary alignment value bc for some reason v/h alignments are NOT split...
     */
    public AdjustTextDisplay(name: string, type: number, value: number, value1: number = 1) {
        const textShape:PBTextShape = TextShape.getMutable(this.textDict.getItem(name));
        switch (type) {
            case 0:
                textShape.fontSize = value;
                break;
            case 1:
                textShape.lineSpacing = value;
                break;
            case 2:
                //TODO: change this when the interface is fixed to support v/h seperately 
                switch (value) {
                    case 0:
                        switch (value1) {
                            case 0: textShape.textAlign = TextAlignMode.TAM_TOP_LEFT; break;
                            case 1: textShape.textAlign = TextAlignMode.TAM_TOP_CENTER; break;
                            case 2: textShape.textAlign = TextAlignMode.TAM_TOP_RIGHT; break;
                        }
                    break;
                    case 1:
                        switch (value1) {
                            case 0: textShape.textAlign = TextAlignMode.TAM_MIDDLE_LEFT; break;
                            case 1: textShape.textAlign = TextAlignMode.TAM_MIDDLE_CENTER; break;
                            case 2: textShape.textAlign = TextAlignMode.TAM_MIDDLE_RIGHT; break;
                        }
                    break;
                    case 2:
                        switch (value1) {
                            case 0: textShape.textAlign = TextAlignMode.TAM_BOTTOM_LEFT; break;
                            case 1: textShape.textAlign = TextAlignMode.TAM_BOTTOM_CENTER; break;
                            case 2: textShape.textAlign = TextAlignMode.TAM_BOTTOM_RIGHT; break;
                        }
                    break;
                }
                break;
        }
    }

    //changes the text of a targeted textshape
    public ChangeText(name: string, text: string) {
        TextShape.getMutable(this.textDict.getItem(name)).text = text;
    }
}