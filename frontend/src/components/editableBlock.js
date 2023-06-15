import React, { useEffect, useRef, useState } from "react";
import ContentEditable from "react-contenteditable";
import "../css/styles.css";
import SelectMenu from "./selectMenu";
import { setCaretToEnd } from "./CaretHelpers";
import axios from "axios";
import { CMD_KEY } from "../utils/Constants";

// Destructuring props: id, html, tag, updatePage, addBlock, deleteBlock
const EditableBlock = ({
  id,
  html,
  tag,
  updatePage,
  addBlock,
  deleteBlock,
}) => {
  //States for Editable block
  const htmlRef = useRef(html || "");
  const [selectedTag, setSelectedTag] = useState(tag || "p");
  const [selectMenuIsOpen, setSelectMenuIsOpen] = useState(false);
  const [tagSelected, setTagSelected] = useState(false);

  const contentEditable = useRef(null);

  // Triggers an update to the page when the id, html, selectedTag, or updatePage dependencies change
  useEffect(() => {
    const htmlChanged = htmlRef.current !== html;
    const tagChanged = tag !== selectedTag;

    if (htmlChanged || tagChanged) {
      updatePage({ id, html: htmlRef.current, tag: selectedTag });
    }
  }, [id, html, selectedTag, updatePage]);

  // Modifies the input value by removing a specific pattern if selectMenuIsOpen is false, and updates the htmlRef with the updated value.
  const onChangeHandler = (e) => {
    const inputValue = e.target.value;
    let updatedValue = inputValue;

    if (!selectMenuIsOpen) {
      const slashIndex = inputValue.lastIndexOf(CMD_KEY);
      const nextCharacterIndex = slashIndex + CMD_KEY.length;

      if (slashIndex !== -1 && nextCharacterIndex < inputValue.length) {
        updatedValue =
          inputValue.slice(0, slashIndex) +
          inputValue.slice(nextCharacterIndex);
      }
    }

    htmlRef.current = updatedValue;
  };

  // Handles keydown events and performs various actions based on the pressed key and certain conditions.

  const onKeyUpHandler = (e) => {
    if (e.key === CMD_KEY && !selectMenuIsOpen) {
      openSelectMenuHandler();
    }
  };

  // Handles keyup events and triggers the openSelectMenuHandler() function when CMD_KEY is released and the select menu is not already open.
  const openSelectMenuHandler = () => {
    setSelectMenuIsOpen(true);
    document.addEventListener("click", closeSelectMenuHandler);
  };

  // Closes the select menu, removes the click event listener, focuses on the contentEditable element, and sets the caret to the end.
  const closeSelectMenuHandler = () => {
    setSelectMenuIsOpen(false);
    document.removeEventListener("click", closeSelectMenuHandler);
    contentEditable.current.focus();
    setCaretToEnd(contentEditable.current);
  };

  // Handles the selection of an HTML tag, updates state and references, closes the select menu, and adjusts focus and caret position for continued editing.
  const tagSelectionHandler = (selectedTag) => {
    htmlRef.current = htmlRef.current.replace(CMD_KEY, `<${selectedTag}>`);
    setSelectedTag(selectedTag);
    closeSelectMenuHandler();
    setTimeout(() => {
      contentEditable.current.focus();
      setCaretToEnd(contentEditable.current);
    }, 0);
  };

  //Delete Request
  const handleDeleteBlock = async () => {
    await axios
      .delete(`http://localhost:1338/api/blocks/${id}`)
      .then((response) => {
        const success = response.data;
        console.log("deleted: ", success);
        if (success) {
          deleteBlock({ id, ref: contentEditable.current });
        }
      })
      .catch((error) => {
        console.log("Error: ", error);
      });
  };

  //PUT Requeest to update the block data
  const handleEditBlock = async () => {
    const updatedBlock = {
      html: htmlRef.current,
      tag: selectedTag,
    };

    await axios
      .put(`http://localhost:1338/api/blocks/${id}`, {
        data: updatedBlock,
      })
      .then((response) => {
        const success = response.data;
        console.log("Updated: ", success);
        // If the update is successful, update the page with the new block data
        if (success) {
          updatePage({ id, html: htmlRef.current, tag: selectedTag });
        }
      })
      .catch((error) => {
        // Handle any errors that occur during the PUT request
        console.log("Error: ", error);
      });
  };

  // Make a POST request to create a new block
  const handleCreateBlock = async () => {
    const block = {
      html: htmlRef.current,
      tag: selectedTag,
    };
    console.log("block", block);
    await axios
      .post(
        "http://localhost:1338/api/blocks",
        { data: block },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        // Handle the response from the POST request
        console.log("Response:", response.data);
      })
      .catch((error) => {
        // Handle any errors that occur during the POST request
        console.error("Error:", error);
      });
  };

  return (
    <React.Fragment>
      {/* Conditional rendering of SelectMenu component */}
      {selectMenuIsOpen && (
        <SelectMenu
          onSelect={tagSelectionHandler}
          close={closeSelectMenuHandler}
        />
      )}
      {/* ContentEditable component */}
      <ContentEditable
        className="Block"
        innerRef={contentEditable}
        html={htmlRef.current}
        tagName={selectedTag}
        onChange={onChangeHandler}
        // onKeyDown={onKeyDownHandler}
        onKeyUp={onKeyUpHandler}
      />
    </React.Fragment>
  );
};

export default EditableBlock;
