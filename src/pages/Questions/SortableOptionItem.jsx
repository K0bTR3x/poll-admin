import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Input, Button, Select } from "antd";
import { FiMove, FiTrash2 } from "react-icons/fi";

const { Option } = Select;

const SortableOptionItem = ({ option, isEditing, onDelete }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: option.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "8px",
        padding: "8px",
        border: "1px solid #444",
        borderRadius: "8px",
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <FiMove style={{ cursor: "grab", color: "#aaa" }} />
            <Input value={option.label} disabled={!isEditing} style={{ flex: 1 }} />
            {isEditing && (
                <Select defaultValue={option.type} style={{ width: 120 }}>
                    <Option value="input">Input</Option>
                    <Option value="textarea">Textarea</Option>
                </Select>
            )}
            {isEditing && (
                <Button danger icon={<FiTrash2 />} onClick={onDelete} />
            )}
        </div>
    );
};

export default SortableOptionItem;
