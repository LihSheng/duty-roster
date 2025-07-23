import React, { useState, useEffect } from 'react';

// Lazy load react-beautiful-dnd
const LazyDragDrop = ({ children, onDragEnd, ...props }) => {
  const [DragDropComponents, setDragDropComponents] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDragDrop = async () => {
      try {
        const module = await import('react-beautiful-dnd');
        setDragDropComponents({
          DragDropContext: module.DragDropContext,
          Droppable: module.Droppable,
          Draggable: module.Draggable
        });
      } catch (error) {
        console.error('Failed to load drag and drop library:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDragDrop();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">Loading drag & drop...</span>
      </div>
    );
  }

  if (!DragDropComponents) {
    return <div className="p-4 text-red-500">Failed to load drag and drop functionality</div>;
  }

  const { DragDropContext } = DragDropComponents;

  return (
    <DragDropContext onDragEnd={onDragEnd} {...props}>
      {children}
    </DragDropContext>
  );
};

// Export the lazy-loaded components
export const useDragDropComponents = () => {
  const [components, setComponents] = useState(null);

  useEffect(() => {
    const loadComponents = async () => {
      const module = await import('react-beautiful-dnd');
      setComponents({
        Droppable: module.Droppable,
        Draggable: module.Draggable
      });
    };
    loadComponents();
  }, []);

  return components;
};

export default LazyDragDrop;