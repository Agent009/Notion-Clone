import React, { useState, useCallback, useEffect } from "react";
import "../css/styles.css";
import EditableBlock from "./editableBlock";
import uid from "./uid";
import { setCaretToEnd } from "./caretHelpers";
import { fetchAPI } from "../utils/api";
import { debounce } from "../utils/utils";
import axios from "axios";

const initialBlock = { id: uid(), html: "", tag: "p", backendId: null, createdAt: null };

function EditablePage() {
  //States used in Editable page component
  const [blocks, setBlocks] = useState([initialBlock]);

  //By calling fetchBlocks() within the useEffect callback function, it ensures that the data retrieval operation is performed after the component is rendered.
  useEffect(() => {
    fetchBlocks();
  }, []);

  // Called when a new or existing block's content is updated.
  const blockUpdateHandler = (updatedBlock) => {
    //Updated block is the parameter passed from the editableBlock Comp.
    setBlocks((prevBlocks) => {
      const index = prevBlocks.findIndex((b) => b.id === updatedBlock.id);
      console.log("blockUpdateHandler -> index", index, "tag", updatedBlock.tag, "html", updatedBlock.html);

      // Block not found, return the previous blocks.
      if (index === -1) {
        return prevBlocks;
      }

      // Block found. Update the tag and HTML for it.
      const updatedBlocks = [...prevBlocks];
      updatedBlocks[index] = {
        ...updatedBlocks[index],
        tag: updatedBlock.tag,
        html: updatedBlock.html,
      };

      return updatedBlocks;
    });
  };

  // Add a new block
  const addBlockHandler = useCallback((currentBlock) => {
    setBlocks((prevBlocks) => {
      const newBlock = { id: uid(), html: "", tag: "p", backendId: null, createdAt: null };
      const index = prevBlocks.findIndex((b) => b.id === currentBlock.id);
      console.log("addBlockHandler -> index", index, "currentBlock.id", currentBlock.id, "newBlock.id", newBlock.id, "currentBlock.html");
      console.log("currentBlock.tag", currentBlock.tag, "newBlock.tag", newBlock.tag, "currentBlock.html", currentBlock.html, "newBlock.html", newBlock.html);
      console.log("currentBlock.ref", currentBlock.ref);

      // Block not found, return the previous blocks.
      if (index === -1) {
        return prevBlocks;
      }

      // Block found. Update the tag and HTML for it.
      const updatedBlocks = [...prevBlocks];
      // Add the new block to the state.
      updatedBlocks.splice(index + 1, 0, newBlock);
      return updatedBlocks;
    });

    // Set the focus to ... something? Not sure what's going on in here.
    setTimeout(() => {
      if (currentBlock.ref && currentBlock.ref.nextElementSibling) {
        currentBlock.ref.nextElementSibling.focus();
      }
    }, 10);
  }, []);

  const updateBlock = (updatedBlock) => {
    setBlocks((prevBlocks) =>
      prevBlocks.map((block) =>
        block.id === updatedBlock.id ? { ...block, ...updatedBlock } : block
      )
    );
  };

  //Function used for the Delete block Block
  const deleteBlockHandler = useCallback((currentBlock) => {
    setBlocks((prevBlocks) => {
      const previousBlock =
        currentBlock.ref && currentBlock.ref.previousElementSibling;
      if (previousBlock) {
        const index = prevBlocks.findIndex((b) => b.id === currentBlock.id);
        if (index !== -1) {
          const updatedBlocks = [...prevBlocks];
          updatedBlocks.splice(index, 1);
          setTimeout(() => {
            setCaretToEnd(previousBlock);
            previousBlock.focus();
          });
          return updatedBlocks;
        }
      }
      return prevBlocks;
    });
  }, []);

  // GET Request to Fetch data from Backend
  const fetchBlocks = async () => {
    try {
      const response = await fetchAPI('/blocks');
      console.log("Fetch blocks response", response);
      const items = response.data;
      let blocks = [];
      items.forEach((item, index, array) => {
        const block = {
          key: item.id,
          id: item.id,
          tag: item.attributes.tag,
          html: item.attributes.html,
          backendId: item.id,
          createdAt: item.attributes.createdAt
        };
        blocks.push(block);
      });

      // Add an empty P block at the end.
      blocks.push(initialBlock);
      console.log("blocks", blocks);
      setBlocks(blocks);
    } catch (error) {
      console.error("Error fetching existing blocks.", error);
    }
  };

  return (
    <React.Fragment>
      <div className="Page">
        {blocks.map((block) => (
          <EditableBlock
            key={block.id}
            id={block.id}
            tag={block.tag}
            html={block.html}
            backendId={block.backendId}
            createdAt={block.createdAt}
            updateBlockContents={blockUpdateHandler}
            addBlock={addBlockHandler}
            update={updateBlock}
            deleteBlock={deleteBlockHandler}
          />
        ))}
      </div>
    </React.Fragment>
  );
}

export default EditablePage;
