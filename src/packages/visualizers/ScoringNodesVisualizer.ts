import Visualizer from "./Visualizer";

export default class ScoringNodesVisualizer implements Visualizer {
  private nodeElements: HTMLElement[] = [];

  constructor(container: HTMLElement) {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 9; j++) {
        this.nodeElements.push(container.firstElementChild?.children[i].children[j] as HTMLElement);
      }
    }

    // Add a handler for when the user clicks on a node
    for (let nodeNum in this.nodeElements) {
      let node = this.nodeElements[nodeNum];
      node.addEventListener("click", (event: MouseEvent) => {
        if (event.button != 0) return;
        event.preventDefault();
        window.setNt4("/SmartDashboard/TargetNode", parseInt(nodeNum));

        for (let node of this.nodeElements) {
          node.classList.remove("active");
        }
        node.classList.add("active");
      });
      node.addEventListener("auxclick", (event: MouseEvent) => {
        if (event.button != 2) return;
        event.preventDefault();
        let oldArray = window.log.getBooleanArray(
          "/SmartDashboard/ScoringNodes",
          window.log.getTimestampRange()[1],
          window.log.getTimestampRange()[1]
        )?.values[0];
        if (oldArray == undefined) return;
        oldArray[nodeNum] = !oldArray[nodeNum];
        window.setNt4("/SmartDashboard/ScoringNodes", oldArray);
        // Now that we sent it to networktables, it will be updated in the refresh function
      });
    }
  }

  render(command: null) {
    let data = window.log.getBooleanArray(
      "/SmartDashboard/ScoringNodes",
      window.log.getTimestampRange()[1],
      window.log.getTimestampRange()[1]
    );
    if (data == undefined) return null;
    let scoreState = data.values[0];

    for (let node in scoreState) {
      if (scoreState[node]) {
        this.nodeElements[node].classList.add("scored");
      } else {
        this.nodeElements[node].classList.remove("scored");
      }
    }
    return null;
  }
}
