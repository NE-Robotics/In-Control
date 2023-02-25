import { TabState } from "../../packages/utils/HubState";
import TabType from "../../packages/utils/TabType";
import TabController from "../TabController";

export default class ScoringNodesController implements TabController {
  private content: HTMLElement;

  private nodeElements: HTMLElement[] = [];

  constructor(content: HTMLElement) {
    this.content = content;

    let container: HTMLElement = this.content.children[0].children[0] as HTMLElement;
    console.log(container);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 9; j++) {
        this.nodeElements.push(container.children[i].children[j] as HTMLElement);
      }
    }
  }

  saveState(): TabState {
    return { type: TabType.ScoringNodes };
  }

  restoreState(state: TabState) {}

  periodic() {}

  refresh() {
    let data = window.log.getBooleanArray(
      "/SmartDashboard/ScoringNodes",
      window.log.getTimestampRange()[1],
      window.log.getTimestampRange()[1]
    );
    if (data == undefined) return;
    let scoreState = data.values[0];

    for (let node in scoreState) {
      if (scoreState[node]) {
        this.nodeElements[node].classList.add("scored");
      } else {
        this.nodeElements[node].classList.remove("scored");
      }
    }
  }
}
