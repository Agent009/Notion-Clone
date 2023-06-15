import React, { useState, useCallback, useEffect } from "react";
import "../css/styles.css";
import EditableBlock from "./EditableBlock";
import uid from "./uid";
import { setCaretToEnd } from "./CaretHelpers";
import axios from "axios";
import { initialBlock } from "../utils/Constants";

function EditablePage() {
  //States used in Editable page component
  const [blocks, setBlocks] = useState([initialBlock]);
  const [items, setItems] = useState([]);

  //By calling fetchItems() within the useEffect callback function, it ensures that the data retrieval operation is performed after the component is rendered.
  useEffect(() => {
    fetchItems();
  }, []);

  //Function used for the Update Block
  const updatePageHandler = (updatedBlock) => {
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
  };

  //Function used for the Add block Block
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
    <React.Fragment>
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
        {blocks.map((block, index) => (
          <EditableBlock
            key={index}
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
    </React.Fragment>
  );
}

export default EditablePage;
