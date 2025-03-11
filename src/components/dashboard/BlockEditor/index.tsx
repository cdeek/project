// components/BlockEditor.js
import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import DynamicBlockEditor from "./DynamicBlockEditor";
import Blocks from "@/lib/blocks";

export default function BlockEditor({ blocks, setBlocks }) {
  const addBlock = (blockType) => {
    // Build default data for the new block by iterating over its fields:
    const newBlock = { blockType };
    blockType.fields.forEach((field) => {
      newBlock[field.name] = field.defaultValue ?? (field.type === "array" ? [] : "");
    });
    setBlocks([...blocks, newBlock]);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(blocks);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setBlocks(reordered);
  };

  const updateBlock = (index, newBlock) => {
    const updated = [...blocks];
    updated[index] = newBlock;
    setBlocks(updated);
  };

  const removeBlock = (index) => {
    setBlocks(blocks.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h3 className="text-2xl font-bold mb-4">Page Blocks</h3>
      {/* Block Type Selector */}
      <div className="flex gap-2 mb-4">
        {Blocks.map((blockType) => (
          <button
            key={blockType}
            onClick={() => addBlock(blockType)}
            className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
          >
            + {blockType.label}
          </button>
        ))}
      </div>

      {/* Drag & Drop Area */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="blocks">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {blocks.map((block, index) => (
                <Draggable key={index} draggableId={`block-${index}`} index={index}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                      <DynamicBlockEditor
                        block={block}
                        index={index}
                        updateBlock={updateBlock}
                        removeBlock={removeBlock}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
