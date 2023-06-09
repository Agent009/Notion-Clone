import React, { useState, useCallback, useEffect } from "react";
import "../css/styles.css";
import EditableBlock from "./editableBlock";
import uid from "./uid";
import { setCaretToEnd } from "./caretHelpers";
import axios from "axios";

const initialBlock = { id: uid(), html: "", tag: "p" };

function EditablePage() {
  const [blocks, setBlocks] = useState([initialBlock]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  //Function used for the Update Block
  const updatePageHandler = useCallback((updatedBlock) => {
    //Updated block is the parameter passed from the editableBlock Comp.
    setBlocks((prevBlocks) => {
      const index = prevBlocks.findIndex((b) => b.id === updatedBlock.id);
      if (index !== -1) {
        const updatedBlocks = [...prevBlocks];
        updatedBlocks[index] = {
          ...updatedBlocks[index],
          tag: updatedBlock.tag,
          html: updatedBlock.html,
        };
        return updatedBlocks;
      }
      return prevBlocks;
    });
  }, []);

  const addBlockHandler = useCallback((currentBlock) => {
    setBlocks((prevBlocks) => {
      const newBlock = { id: uid(), html: "", tag: "p" };
      const index = prevBlocks.findIndex((b) => b.id === currentBlock.id);
      if (index !== -1) {
        const updatedBlocks = [...prevBlocks];
        updatedBlocks.splice(index + 1, 0, newBlock);
        return updatedBlocks;
      }
      return prevBlocks;
    });
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

  // GET REQUEST
  const fetchItems = async () => {
    try {
      await axios
        .get("http://localhost:1338/api/blocks")
        .then((response) => {
          const result = response.data.data;
          setItems(result);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.error("Error Fetching data", error);
    }
  };

  return (
    <div className="Page">
      {items.map((item) => (
        <EditableBlock
          key={item.id}
          id={item.id}
          tag={item.attributes.tag}
          html={item.attributes.html}
          updatePage={updatePageHandler}
          addBlock={addBlockHandler}
          deleteBlock={deleteBlockHandler}
        />
      ))}
      {blocks.map((block) => (
        <EditableBlock
          key={block.id}
          id={block.id}
          tag={block.tag}
          html={block.html}
          updatePage={updatePageHandler}
          addBlock={addBlockHandler}
          update={updateBlock}
          deleteBlock={deleteBlockHandler}
        />
      ))}
    </div>
  );
}

export default EditablePage;
