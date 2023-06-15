import React, { useState, useEffect } from "react";
import { matchSorter } from "match-sorter";
import { allowedTags } from "../utils/Constants";

const SelectMenu = ({ onSelect, close }) => {
  const [command, setCommand] = useState("");
  const [items, setItems] = useState(allowedTags);
  const [selectedItem, setSelectedItem] = useState(0);

  // Handle keydown event
  useEffect(() => {
    const handleKeyDown = (e) => {
      const selected = selectedItem;
      const currentCommand = command;

      switch (e.key) {
        case "Enter":
          e.preventDefault();
          console.log("Handling ENTER key event -> selected index", selected, "items", items);
          onSelect(items[selected].tag);
          break;
        case "Backspace":
          if (!currentCommand) {
            close();
          }
          setCommand(currentCommand.substring(0, currentCommand.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          const prevSelected = selected === 0 ? items.length - 1 : selected - 1;
          setSelectedItem(prevSelected);
          break;
        case "ArrowDown":
        case "Tab":
          e.preventDefault();
          const nextSelected = selected === items.length - 1 ? 0 : selected + 1;
          setSelectedItem(nextSelected);
          break;
        default:
          setCommand(currentCommand + e.key);
          break;
      }
    };

    // Add event listener for keydown
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      // Cleanup function to remove event listener when component unmounts
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [command, items, onSelect, close, selectedItem]);

  // Filter items based on command
  useEffect(() => {
    const updatedItems = matchSorter(allowedTags, command, { keys: ["tag"] });
    setItems(updatedItems);
  }, [command]);

  return (
    <div className="SelectMenu">
      <div className="Items">
        {items.map((item, key) => {
          const isSelected = items.indexOf(item) === selectedItem;
          return (
            <div
              className={isSelected ? "Selected" : null}
              key={key}
              role="button"
              tabIndex="0"
              onClick={() => onSelect(item.tag)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onSelect(item.tag);
                }
              }}
            >
              {item.label}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SelectMenu;
