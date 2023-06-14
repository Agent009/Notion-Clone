import React, { useEffect, useRef, useState } from "react";
import ContentEditable from "react-contenteditable";
import "../css/styles.css";
import SelectMenu from "./selectMenu";
import { setCaretToEnd } from "./caretHelpers";
import axios from "axios";
import { CMD_KEY } from "../utils/Constants";

const EditableBlock = ({
  id,
  html,
  tag,
  updatePage,
  addBlock,
  deleteBlock,
}) => {
  const htmlRef = useRef(html || "");
  const [selectedTag, setSelectedTag] = useState(tag || "p");
  const [selectMenuIsOpen, setSelectMenuIsOpen] = useState(false);
  const [tagSelected, setTagSelected] = useState(false);

  console.log("tag", tag);
  const contentEditable = useRef(null);

  useEffect(() => {
    const htmlChanged = htmlRef.current !== html;
    const tagChanged = tag !== selectedTag;

    if (htmlChanged || tagChanged) {
      updatePage({ id, html: htmlRef.current, tag: selectedTag });
    }
  }, [id, html, selectedTag, updatePage]);

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

  const onKeyDownHandler = (e) => {
    if (e.key === CMD_KEY) {
      if (!tagSelected) {
        e.preventDefault();
        setTagSelected(true);
        return;
      }
    }

    if (e.key === "Enter") {
      if (!selectMenuIsOpen) {
        if (!e.shiftKey) {
          if (!tagSelected) {
            e.preventDefault();
            addBlock({ id, ref: contentEditable.current });
            contentEditable.current.blur();
            if (html.length > 0) {
              handleEditBlock();
            } else {
              handleCreateBlock();
            }
            setTagSelected(false);
            return;
          }
        }
      }
    }

    if (e.key === "Backspace" && !htmlRef.current) {
      e.preventDefault();
      handleDeleteBlock();
    }
  };

  const onKeyUpHandler = (e) => {
    if (e.key === CMD_KEY && !selectMenuIsOpen) {
      openSelectMenuHandler();
    }
  };

  const openSelectMenuHandler = () => {
    setSelectMenuIsOpen(true);
    document.addEventListener("click", closeSelectMenuHandler);
  };

  const closeSelectMenuHandler = () => {
    setSelectMenuIsOpen(false);
    document.removeEventListener("click", closeSelectMenuHandler);
    contentEditable.current.focus();
    setCaretToEnd(contentEditable.current);
  };

  const tagSelectionHandler = (selectedTag) => {
    htmlRef.current = htmlRef.current.replace(CMD_KEY, `<${selectedTag}>`);
    setSelectedTag(selectedTag);
    closeSelectMenuHandler();
    setTimeout(() => {
      contentEditable.current.focus();
      setCaretToEnd(contentEditable.current);
    }, 0);
  };

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
        if (success) {
          updatePage({ id, html: htmlRef.current, tag: selectedTag });
        }
      })
      .catch((error) => {
        console.log("Error: ", error);
      });
  };

  const handleCreateBlock = async () => {
    const block = {
      html: htmlRef.current,
      tag: selectedTag,
    };

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
        console.log("Response:", response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <React.Fragment>
      {selectMenuIsOpen && (
        <SelectMenu
          onSelect={tagSelectionHandler}
          close={closeSelectMenuHandler}
        />
      )}
      <ContentEditable
        className="Block"
        innerRef={contentEditable}
        html={htmlRef.current}
        tagName={selectedTag}
        onChange={onChangeHandler}
        onKeyDown={onKeyDownHandler}
        onKeyUp={onKeyUpHandler}
      />
    </React.Fragment>
  );
};

export default EditableBlock;
