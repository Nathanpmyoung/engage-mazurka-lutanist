// import { useGraphState } from "../lib/useGraphState";
import ReactFlow, {
  Controls,
  Background,
  BackgroundVariant,
  OnNodesChange,
} from "reactflow";
import "reactflow/dist/style.css";
import { useGraphState } from "../lib/completeGraphDataFromSquiggleState";
import { useNodeLocation } from "../lib/useNodeLocation";

import { CustomNode } from "../components/CustomNode";
import { useCallback, useState } from "react";
import { augmentNodes } from "../lib/augmentNodes";

const nodeTypes = {
  squiggleNodeType: CustomNode,
};

export function Graph() {
  const nodes = useGraphState((state) => state.nodes);
  const edges = useGraphState((state) => state.edges);
  const nodeLocation = useNodeLocation();
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const _nodes = augmentNodes(nodes, nodeLocation, selectedNodes);

  const onNodesChange: OnNodesChange = useCallback((changes) => {
    for (const change of changes) {
      if (change.type === "position" && change.position) {
        useNodeLocation.setState({
          [change.id]: { x: change.position.x, y: change.position.y },
        });
      } else if (change.type === "select") {
        const { id, selected } = change;
        if (selected) {
          setSelectedNodes((selectedNodes) => [...selectedNodes, id]);
        } else {
          setSelectedNodes((selectedNodes) =>
            selectedNodes.filter((nodeId) => nodeId !== id)
          );
        }
      }
    }
  }, []);

  return (
    <ReactFlow
      fitView
      nodes={_nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      minZoom={0.2}
      maxZoom={2}
      onNodesChange={onNodesChange}
      nodesConnectable={false}
      className={selectedNodes.length > 0 ? "selecting" : ""}
    >
      <Background
        color="#f0f0f0"
        style={{ backgroundColor: "#f7f7f7" }}
        variant={BackgroundVariant.Lines}
      />
      <Controls />
    </ReactFlow>
  );
}
