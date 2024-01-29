import {
  MaterialEngine,
  MaterialStandardData,
  MapData,
  viewports,
  sceneTree,
  Viewer
} from "@shapediver/viewer";

const materialEngine: MaterialEngine = MaterialEngine.instance;

/**
 * Create the menu for the material, assign the default values
 *
 * @param material
 */
export const createMaterialMenu = async (material: MaterialStandardData) => {


  const menu = {
    color:'',
    opacity:'',
    metalness:'',
    roughness:'',
    sheen:'',
    ticket:'359956cc5a7f61b3690d59df23b2e6b27f27121de2a550504d1155f4be077e500a304dc373815e87d56d2b9a4415814cf9e3752bae9ae175ba5af39b5a1a20c5832b8f31acff989ab0ecfffc30f8ad694c856b4d024aee1424c6698d9eb4c8db6d1da54a1685e4-183b051b9e4821cb18b838a02c5d763d'
  }
  // create an update callback for the material
  const updateMaterial = () => {
    material.updateVersion();
    sceneTree.root.updateVersion();
    viewports["myViewport"].update();
    localStorage.setItem("dataModel",JSON.stringify(menu));
  };

  // set default values
  material.color = "#666";
  material.metalness = 1;
  material.roughness = 1.0;
  material.metalnessMap =
    (await materialEngine.loadMap(
      "https://viewer.shapediver.com/v3/images/SD_grayscale.png"
    )) || undefined;

  material.roughnessMap =
    (await materialEngine.loadMap(
      "https://viewer.shapediver.com/v3/images/SD_grayscale_inverse.png"
    )) || undefined;
  updateMaterial();

  // create settings UI
  const materialPanel = (<any>window).QuickSettings.create("Material");
  const titleBarHeight = (<HTMLDivElement>(
    document.getElementsByClassName("qs_title_bar")[0]
  )).clientHeight;
  (<HTMLDivElement>(
    document.getElementsByClassName("qs_content")[0]
  )).style.maxHeight = window.innerHeight - titleBarHeight + "px";


  // create settings UI
// const materialPanel = (<any>window).QuickSettings.create(window.innerWidth - 220, 0, "Material");
// const titleBarHeight = (<HTMLDivElement>(
//     document.getElementsByClassName("qs_title_bar")[0]
// )).clientHeight;
// (<HTMLDivElement>(
//     document.getElementsByClassName("qs_content")[0]
// )).style.maxHeight = window.innerHeight - titleBarHeight + "px";



  // Add a color input field to change the material color
  materialPanel.addColor("color", "#666", (value: string) => {
    material.color = value;
    menu.color = value;
    updateMaterial();
  });


  // Add a number input field to change the material thickness
  materialPanel.addNumber("opacity", 0, 1, 0, 1, (value: number) => {
    material.opacity = value;
    menu.opacity = value.toString();
    updateMaterial();
  });


  materialPanel.addNumber("metalness", 0, 1, 1, 0.01, (value: number) => {
    material.metalness = value;
    menu.metalness = value.toString();
    updateMaterial();
  });

  materialPanel.addNumber("roughness", 0, 1, 1, 0.01, (value: number) => {
    material.roughness = value;
    menu.roughness = value.toString();
    updateMaterial();
  });


  // Add a range input field to increase the size of the material
  materialPanel.addRange("sheen", 0, 50, 25, 1, (value: number) => {
    menu.sheen = value.toString();
    material.sheen = value;
     // update the value
    updateMaterial();
  });



  let loadingUrlM: string;
  // material input
  materialPanel.addText(
    "metalnessMap",
    "https://viewer.shapediver.com/v3/images/SD_grayscale.png",
    async (value: string) => {
      let metalnessMap: MapData | undefined;
      try {
        loadingUrlM = value;
        metalnessMap = (await materialEngine.loadMap(value)) || undefined;
      } catch (e) {
        console.log("An error occurred while loading the metalnessMap:", e);
      } finally {
        // The check with the loadingURL is needed to ensure
        // that we are actually applying the last value that was sent
        // It could be that while loading, the user entered another url
        // If that happens, we don't want to apply the map that was loaded inbetween
        if (loadingUrlM === value) {
          material.metalnessMap = metalnessMap;
          updateMaterial();
        }
      }
    }
  );

  let loadingUrlR: string;
  // material input
  materialPanel.addText(
    "roughnessMap",
    "https://viewer.shapediver.com/v3/images/SD_grayscale_inverse.png",
    async (value: string) => {
      let roughnessMap: MapData | undefined;
      try {
        loadingUrlR = value;
        roughnessMap = (await materialEngine.loadMap(value)) || undefined;
      } catch (e) {
        console.log("An error occurred while loading the roughnessMap:", e);
      } finally {
        // The check with the loadingURL is needed to ensure
        // that we are actually applying the last value that was sent
        // It could be that while loading, the user entered another url
        // If that happens, we don't want to apply the map that was loaded inbetween
        if (loadingUrlR === value) {
          material.roughnessMap = roughnessMap;
          updateMaterial();
        }
      }
    }
  );


};
