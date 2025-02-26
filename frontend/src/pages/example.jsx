import { useState } from "react";

const ArrayInput = () => {
    const [inputValue, setInputValue] = useState(""); // For single input
    const [items, setItems] = useState([]); // Stores array of values

    const handleAddItem = () => {
        if (inputValue.trim() !== "") {
            setItems([...items, inputValue]); // Append value to array
            setInputValue(""); // Clear input after adding
        }
    };

    return (
        <div>
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter value"
            />
            <button onClick={handleAddItem}>Add</button>

            <ul>
                {items.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </div>
    );
};

export default ArrayInput;
