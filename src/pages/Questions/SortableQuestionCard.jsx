import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import QuestionCard from "./QuestionCard";

const SortableQuestionCard = ({ id, question, onDelete, onSave }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: "grab",
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <QuestionCard question={question} onDelete={onDelete} onSave={onSave} />
        </div>
    );
};

export default SortableQuestionCard;
