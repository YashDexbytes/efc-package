'use client';
import { useState } from 'react';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface FormField {
  id: string;
  attributeName: string;
  dataType: 'VARCHAR' | 'INTEGER' | 'DATETIME' | 'BOOLEAN' | 'TEXT' | 'DECIMAL';
  keyType: 'NONE' | 'PRIMARY' | 'FOREIGN';
  length?: number;
  required: boolean;
}

const ManageEntities = () => {
  const [fields, setFields] = useState<FormField[]>([
    {
      id: '1',
      attributeName: 'id',
      dataType: 'INTEGER',
      keyType: 'PRIMARY',
      required: true
    },
    {
      id: '2',
      attributeName: 'name',
      dataType: 'VARCHAR',
      keyType: 'NONE',
      length: 255,
      required: true
    }
  ]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(fields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setFields(items);
  };

  const addNewField = () => {
    const newField: FormField = {
      id: Date.now().toString(),
      attributeName: 'new_field',
      dataType: 'VARCHAR',
      keyType: 'NONE',
      length: 255,
      required: false
    };
    setFields([...fields, newField]);
  };

  const removeField = (id: string) => {
    setFields(fields.filter(field => field.id !== id));
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ));
  };

  return (
    <DefaultLayout>
      <div className="p-4 md:p-6 2xl:p-10">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-black dark:text-white">Create Entity</h2>
        </div>

        <div className="mb-4">
          <button
            onClick={addNewField}
            className="btn bg-primary text-white px-4 py-2 rounded-md"
          >
            Add Field
          </button>
        </div>

        <div className="bg-white dark:bg-boxdark rounded-sm">
          {/* Header */}
          <div className="grid grid-cols-[30px_1fr_1fr_1fr_1fr_80px] gap-4 p-4 border-b border-stroke dark:border-strokedark">
            <div></div>
            <div className="text-sm font-medium">Attribute Name</div>
            <div className="text-sm font-medium">Data Type</div>
            <div className="text-sm font-medium">Length</div>
            <div className="text-sm font-medium">Key Type</div>
            <div className="text-sm font-medium text-center">Required</div>
          </div>
{/* 
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="fields">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {fields.map((field, index) => (
                    <Draggable key={field.id} draggableId={field.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="grid grid-cols-[30px_1fr_1fr_1fr_1fr_80px] gap-4 p-4 border-b border-stroke dark:border-strokedark items-center hover:bg-gray-50 dark:hover:bg-boxdark-2"
                        >
                          <div {...provided.dragHandleProps} className="cursor-move text-center">
                            ⋮⋮
                          </div>
                          
                          <input
                            type="text"
                            value={field.attributeName}
                            onChange={(e) => updateField(field.id, { attributeName: e.target.value })}
                            className="w-full bg-transparent border border-stroke dark:border-strokedark rounded px-2 py-1"
                          />

                          <select
                            value={field.dataType}
                            onChange={(e) => updateField(field.id, { 
                              dataType: e.target.value as FormField['dataType']
                            })}
                            className="w-full bg-transparent border border-stroke dark:border-strokedark rounded px-2 py-1"
                          >
                            <option value="VARCHAR">VARCHAR</option>
                            <option value="INTEGER">INTEGER</option>
                            <option value="DATETIME">DATETIME</option>
                            <option value="BOOLEAN">BOOLEAN</option>
                            <option value="TEXT">TEXT</option>
                            <option value="DECIMAL">DECIMAL</option>
                          </select>

                          <input
                            type="number"
                            value={field.length}
                            onChange={(e) => updateField(field.id, { length: parseInt(e.target.value) })}
                            className="w-full bg-transparent border border-stroke dark:border-strokedark rounded px-2 py-1"
                            disabled={field.dataType !== 'VARCHAR'}
                          />

                          <select
                            value={field.keyType}
                            onChange={(e) => updateField(field.id, { 
                              keyType: e.target.value as FormField['keyType']
                            })}
                            className="w-full bg-transparent border border-stroke dark:border-strokedark rounded px-2 py-1"
                          >
                            <option value="NONE">None</option>
                            <option value="PRIMARY">Primary Key</option>
                            <option value="FOREIGN">Foreign Key</option>
                          </select>

                          <div className="flex items-center justify-between">
                            <input
                              type="checkbox"
                              checked={field.required}
                              onChange={(e) => updateField(field.id, { required: e.target.checked })}
                              className="mr-2"
                            />
                            <button
                              onClick={() => removeField(field.id)}
                              className="text-danger hover:text-danger-dark"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext> */}
        </div>

        <div className="mt-6">
          <button
            onClick={() => console.log('Entity structure:', fields)}
            className="btn bg-success text-white px-6 py-2 rounded-md"
          >
            Save Entity
          </button>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ManageEntities;
