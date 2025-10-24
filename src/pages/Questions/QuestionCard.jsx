import React, { useState } from "react";
import { Card, Button, Input, Switch, Tag } from "antd";
import { FiEdit, FiSave, FiTrash2, FiChevronDown } from "react-icons/fi";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
    arrayMove,
} from "@dnd-kit/sortable";
import SortableOptionItem from "./SortableOptionItem";

const QuestionCard = ({ question, onDelete, onSave }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [localData, setLocalData] = useState(question);
    const [options, setOptions] = useState([
        { id: 1, label: "Variant 1", type: "input" },
        { id: 2, label: "Variant 2", type: "textarea" },
    ]);

    const sensors = useSensors(useSensor(PointerSensor));

    const handleOptionDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setOptions((prev) => {
                const oldIndex = prev.findIndex((i) => i.id === active.id);
                const newIndex = prev.findIndex((i) => i.id === over.id);
                return arrayMove(prev, oldIndex, newIndex);
            });
        }
    };

    const handleSave = () => {
        setIsEditing(false);
        onSave(question.id, localData);
    };

    return (
        <Card
            className="question-card"
            style={{
                marginBottom: 16,
                background: "var(--color-card-bg)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text-dark)",
                transition: "all 0.3s ease",
            }}
        >
            {/* HEADER */}
            <div
                className="question-header"
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                }}
            >
                <div>
                    <strong>{localData.title || "Yeni sual"}</strong>
                    <Tag
                        color={localData.status ? "green" : "red"}
                        style={{ marginLeft: 8 }}
                    >
                        {localData.status ? "Aktiv" : "Passiv"}
                    </Tag>
                </div>
                <FiChevronDown
                    style={{
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "0.3s",
                    }}
                />
            </div>

            {/* BODY (Accordion content) */}
            {isOpen && (
                <div
                    className="question-body"
                    style={{
                        marginTop: 16,
                        paddingTop: 10,
                        borderTop: "1px solid var(--color-border)",
                    }}
                >
                    <div style={{ marginBottom: 10 }}>
                        <label>Başlıq:</label>
                        <Input
                            value={localData.title}
                            disabled={!isEditing}
                            onChange={(e) =>
                                setLocalData({ ...localData, title: e.target.value })
                            }
                        />
                    </div>

                    <div style={{ marginBottom: 10 }}>
                        <label>Alt başlıq:</label>
                        <Input
                            value={localData.subtitle}
                            disabled={!isEditing}
                            onChange={(e) =>
                                setLocalData({ ...localData, subtitle: e.target.value })
                            }
                        />
                    </div>

                    <div style={{ marginBottom: 10 }}>
                        <label>Status:</label>
                        <Switch
                            checked={localData.status}
                            disabled={!isEditing}
                            onChange={(checked) =>
                                setLocalData({ ...localData, status: checked })
                            }
                        />
                    </div>

                    <div style={{ marginBottom: 10 }}>
                        <label>Çoxseçimli sual?</label>
                        <Switch
                            checked={localData.is_multi}
                            disabled={!isEditing}
                            onChange={(checked) =>
                                setLocalData({ ...localData, is_multi: checked })
                            }
                        />
                    </div>

                    {/* Variantlar */}
                    <div className="options-section" style={{ marginTop: 16 }}>
                        <h4>Variantlar</h4>
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleOptionDragEnd}
                        >
                            <SortableContext
                                items={options.map((opt) => opt.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {options.map((opt) => (
                                    <SortableOptionItem
                                        key={opt.id}
                                        option={opt}
                                        isEditing={isEditing}
                                        onDelete={() =>
                                            setOptions((prev) => prev.filter((o) => o.id !== opt.id))
                                        }
                                    />
                                ))}
                            </SortableContext>
                        </DndContext>

                        {isEditing && (
                            <Button
                                type="dashed"
                                style={{ marginTop: 10 }}
                                onClick={() =>
                                    setOptions((prev) => [
                                        ...prev,
                                        { id: Date.now(), label: "Yeni variant", type: "input" },
                                    ])
                                }
                            >
                                + Yeni Variant
                            </Button>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div style={{ marginTop: 15 }}>
                        {!isEditing ? (
                            <Button
                                type="primary"
                                icon={<FiEdit />}
                                onClick={() => setIsEditing(true)}
                            >
                                Düzəliş et
                            </Button>
                        ) : (
                            <Button type="primary" icon={<FiSave />} onClick={handleSave}>
                                Yadda saxla
                            </Button>
                        )}
                        <Button
                            danger
                            icon={<FiTrash2 />}
                            onClick={() => onDelete(question.id)}
                            style={{ marginLeft: 10 }}
                        >
                            Sil
                        </Button>
                    </div>
                </div>
            )}
        </Card>
    );
};

export default QuestionCard;
