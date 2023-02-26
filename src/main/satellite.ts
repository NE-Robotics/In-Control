import { FRCData } from "../packages/FRC/FRCData";
import NamedMessage from "../packages/utils/NamedMessage";
import Preferences from "../packages/convenience/Preferences";
import TabType, { getTabIcon } from "../packages/utils/TabType";
import { htmlEncode } from "../packages/utils/util";
import JoysticksVisualizer from "../packages/visualizers/JoysticksVisualizer";
import MechanismVisualizer from "../packages/visualizers/MechanismVisualizer";
import OdometryVisualizer from "../packages/visualizers/OdometryVisualizer";
import PointsVisualizer from "../packages/visualizers/PointsVisualizer";
import SwerveVisualizer from "../packages/visualizers/SwerveVisualizer";
import ThreeDimensionVisualizer from "../packages/visualizers/ThreeDimensionVisualizer";
import ScoringNodesVisualizer from "../packages/visualizers/ScoringNodesVisualizer";
import VideoVisualizer from "../packages/visualizers/VideoVisualizer";
import Visualizer from "../packages/visualizers/Visualizer";

const MAX_ASPECT_RATIO = 5;

declare global {
  interface Window {
    frcData: FRCData | null;
    preferences: Preferences | null;
    sendMainMessage: (name: string, data?: any) => void;
  }
}

let visualizer: Visualizer | null = null;
let type: TabType | null = null;
let title: string | null = null;
let messagePort: MessagePort | null = null;
let lastAspectRatio: number | null = null;
let lastCommand: any = null;

window.sendMainMessage = (name: string, data?: any) => {
  if (messagePort != null) {
    let message: NamedMessage = { name: name, data: data };
    messagePort.postMessage(message);
  }
};

window.addEventListener("message", (event) => {
  if (event.source == window && event.data == "port") {
    messagePort = event.ports[0];
    messagePort.onmessage = (event) => {
      let message: NamedMessage = event.data;
      switch (message.name) {
        case "set-frc-data":
          window.frcData = message.data;
          break;

        case "set-preferences":
          window.preferences = message.data;
          break;

        case "set-type":
          type = message.data as TabType;

          // Update visible elements
          (document.getElementById("odometry") as HTMLElement).hidden = type != TabType.Odometry;
          (document.getElementById("threeDimension") as HTMLElement).hidden = type != TabType.ThreeDimension;
          (document.getElementById("video") as HTMLElement).hidden = type != TabType.Video;
          (document.getElementById("joysticks") as HTMLElement).hidden = type != TabType.Joysticks;
          (document.getElementById("swerve") as HTMLElement).hidden = type != TabType.Swerve;
          (document.getElementById("mechanism") as HTMLElement).hidden = type != TabType.Mechanism;
          (document.getElementById("points") as HTMLElement).hidden = type != TabType.Points;
          (document.getElementById("scoring") as HTMLElement).hidden = type != TabType.ScoringNodes;

          // Create visualizer
          switch (type) {
            case TabType.Odometry:
              visualizer = new OdometryVisualizer(document.getElementById("odometryCanvasContainer") as HTMLElement);
              break;
            case TabType.ThreeDimension:
              visualizer = new ThreeDimensionVisualizer(
                document.body,
                document.getElementById("threeDimensionCanvas") as HTMLCanvasElement,
                document.getElementById("threeDimensionAlert") as HTMLElement
              );
              break;
            case TabType.Video:
              visualizer = new VideoVisualizer(document.getElementsByClassName("video-image")[0] as HTMLImageElement);
              break;
            case TabType.Joysticks:
              visualizer = new JoysticksVisualizer(document.getElementById("joysticksCanvas") as HTMLCanvasElement);
              break;
            case TabType.Swerve:
              visualizer = new SwerveVisualizer(
                document.getElementsByClassName("swerve-canvas-container")[0] as HTMLElement
              );
              break;
            case TabType.Mechanism:
              visualizer = new MechanismVisualizer(
                document.getElementsByClassName("mechanism-svg-container")[0] as HTMLElement
              );
              break;
            case TabType.Points:
              visualizer = new PointsVisualizer(
                document.getElementsByClassName("points-background-container")[0] as HTMLElement
              );
              break;
            case TabType.ScoringNodes:
              visualizer = new ScoringNodesVisualizer(
                document.getElementsByClassName("scoring-table")[0] as HTMLElement
              );
              break;
          }
          break;

        case "render":
          // Update title
          let titleElement = document.getElementsByTagName("title")[0] as HTMLElement;
          let newTitle = message.data.title;
          if (newTitle != title) {
            titleElement.innerHTML =
              (type ? getTabIcon(type) + " " : "") + htmlEncode(newTitle) + " &mdash; In Control";
            title = newTitle;
          }

          // Render frame
          lastCommand = message.data.command;
          if (visualizer) {
            let aspectRatio = visualizer.render(message.data.command);
            processAspectRatio(aspectRatio);
          }
          break;

        case "set-3d-camera":
          if (type == TabType.ThreeDimension) {
            (visualizer as ThreeDimensionVisualizer).set3DCamera(message.data);
          }
          break;

        default:
          console.warn("Unknown message from main process", message);
          break;
      }
    };
  }
});

window.addEventListener("resize", () => {
  if (visualizer == null || lastCommand == null) {
    return;
  }
  let aspectRatio = visualizer.render(lastCommand);
  if (aspectRatio) processAspectRatio(aspectRatio);
});

function processAspectRatio(aspectRatio: number | null) {
  if (aspectRatio != lastAspectRatio) {
    lastAspectRatio = aspectRatio;
    if (aspectRatio !== null) {
      if (aspectRatio > MAX_ASPECT_RATIO) aspectRatio = MAX_ASPECT_RATIO;
      if (aspectRatio < 1 / MAX_ASPECT_RATIO) aspectRatio = 1 / MAX_ASPECT_RATIO;
    }
    window.sendMainMessage("set-aspect-ratio", aspectRatio);
  }
}
