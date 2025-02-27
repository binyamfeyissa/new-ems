import { useState, useRef, useEffect } from 'react';
import { FiImage, FiType, FiGrid, FiLayers, FiSave, FiDownload, FiEye, FiMove, FiPlus, FiTrash2, FiAlignLeft, FiAlignCenter, FiAlignRight, FiUpload } from 'react-icons/fi';
import { toast } from 'react-toastify';

const TicketDesigner = ({ event, onSave }) => {
  const [canvas, setCanvas] = useState({
    width: 1000,
    height: 500,
    background: '#ffffff',
    backgroundImage: null,
  });
  
  const [elements, setElements] = useState([
    {
      id: 'event-name',
      type: 'text',
      content: event?.title || 'Event Name',
      x: 50,
      y: 50,
      fontSize: 24,
      fontFamily: 'Arial',
      color: '#000000',
      fontWeight: 'bold',
      dynamic: false,
    },
    {
      id: 'attendee-name',
      type: 'text',
      content: '{attendee_name}',
      x: 50,
      y: 100,
      fontSize: 18,
      fontFamily: 'Arial',
      color: '#333333',
      fontWeight: 'normal',
      dynamic: true,
    },
    {
      id: 'event-date',
      type: 'text',
      content: event?.date ? new Date(event.date).toLocaleDateString() : 'Event Date',
      x: 50,
      y: 150,
      fontSize: 16,
      fontFamily: 'Arial',
      color: '#555555',
      fontWeight: 'normal',
      dynamic: false,
    },
    {
      id: 'venue',
      type: 'text',
      content: event?.location || 'Venue Location',
      x: 50,
      y: 180,
      fontSize: 16,
      fontFamily: 'Arial',
      color: '#555555',
      fontWeight: 'normal',
      dynamic: false,
    },
    {
      id: 'qr-code',
      type: 'qrcode',
      content: '{ticket_id}',
      x: 800,
      y: 50,
      width: 150,
      height: 150,
      dynamic: true,
    },
    {
      id: 'ticket-type',
      type: 'text',
      content: '{ticket_type}',
      x: 800,
      y: 220,
      fontSize: 16,
      fontFamily: 'Arial',
      color: '#333333',
      fontWeight: 'bold',
      dynamic: true,
    },
  ]);
  
  const [selectedElement, setSelectedElement] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(false);
  const [templates, setTemplates] = useState([
    { id: 'default', name: 'Default Template', preview: 'https://via.placeholder.com/100x50/e2e8f0/475569?text=Default' },
    { id: 'vip', name: 'VIP Template', preview: 'https://via.placeholder.com/100x50/fef3c7/92400e?text=VIP' },
    { id: 'concert', name: 'Concert Template', preview: 'https://via.placeholder.com/100x50/dbeafe/1e40af?text=Concert' },
  ]);
  
  const canvasRef = useRef(null);
  const [availableFonts] = useState([
    'Arial',
    'Helvetica',
    'Times New Roman',
    'Courier New',
    'Georgia',
    'Verdana',
    'Tahoma',
    'Impact',
  ]);
  
  // Handle element selection
  const handleElementClick = (e, element) => {
    e.stopPropagation();
    setSelectedElement(element);
    
    // Calculate drag offset
    const rect = e.currentTarget.getBoundingClientRect();
    const canvasRect = canvasRef.current.getBoundingClientRect();
    
    setDragOffset({
      x: e.clientX - (rect.left - canvasRect.left),
      y: e.clientY - (rect.top - canvasRect.top),
    });
    
    setIsDragging(true);
  };
  
  // Handle canvas click (deselect elements)
  const handleCanvasClick = () => {
    setSelectedElement(null);
  };
  
  // Handle element dragging
  const handleMouseMove = (e) => {
    if (!isDragging || !selectedElement) return;
    
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - canvasRect.left - dragOffset.x;
    const y = e.clientY - canvasRect.top - dragOffset.y;
    
    // Update element position
    setElements(elements.map(el => 
      el.id === selectedElement.id 
        ? { ...el, x: Math.max(0, Math.min(canvas.width - 20, x)), y: Math.max(0, Math.min(canvas.height - 20, y)) }
        : el
    ));
  };
  
  // Handle mouse up (end dragging)
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  // Add mouse event listeners
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, selectedElement, dragOffset]);
  
  // Update element properties
  const updateElement = (property, value) => {
    if (!selectedElement) return;
    
    setElements(elements.map(el => 
      el.id === selectedElement.id 
        ? { ...el, [property]: value }
        : el
    ));
    
    // Update selected element reference
    setSelectedElement(prev => ({ ...prev, [property]: value }));
  };
  
  // Add new text element
  const addTextElement = () => {
    const newElement = {
      id: `text-${Date.now()}`,
      type: 'text',
      content: 'New Text',
      x: 100,
      y: 100,
      fontSize: 16,
      fontFamily: 'Arial',
      color: '#000000',
      fontWeight: 'normal',
      dynamic: false,
    };
    
    setElements([...elements, newElement]);
    setSelectedElement(newElement);
  };
  
  // Delete selected element
  const deleteSelectedElement = () => {
    if (!selectedElement) return;
    
    // Don't allow deleting required elements
    if (['qr-code', 'attendee-name', 'ticket-type'].includes(selectedElement.id)) {
      toast.error('Cannot delete required elements');
      return;
    }
    
    setElements(elements.filter(el => el.id !== selectedElement.id));
    setSelectedElement(null);
  };
  
  // Handle background image upload
  const handleBackgroundUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setCanvas({
        ...canvas,
        backgroundImage: event.target.result,
      });
    };
    reader.readAsDataURL(file);
  };
  
  // Save template
  const saveTemplate = () => {
    const template = {
      canvas,
      elements,
    };
    
    // In a real app, this would save to a database
    toast.success('Template saved successfully');
    
    if (onSave) {
      onSave(template);
    }
  };
  
  // Load template
  const loadTemplate = (templateId) => {
    // In a real app, this would load from a database
    toast.info(`Loading template: ${templateId}`);
    
    // For demo purposes, we'll just change the background color
    if (templateId === 'vip') {
      setCanvas({
        ...canvas,
        background: '#fef3c7',
      });
    } else if (templateId === 'concert') {
      setCanvas({
        ...canvas,
        background: '#dbeafe',
      });
    } else {
      setCanvas({
        ...canvas,
        background: '#ffffff',
      });
    }
  };
  
  // Preview ticket
  const previewTicket = () => {
    // In a real app, this would generate a preview with actual data
    toast.info('Generating preview...');
    setTimeout(() => {
      toast.success('Preview generated');
      // Would open a modal with the preview
    }, 1000);
  };
  
  // Export template
  const exportTemplate = () => {
    // In a real app, this would export the template as JSON or PDF
    const templateData = JSON.stringify({ canvas, elements }, null, 2);
    const blob = new Blob([templateData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ticket_template.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Template exported successfully');
  };
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Ticket Designer</h2>
      </div>
      
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - Tools */}
          <div className="w-full lg:w-64 space-y-6">
            {/* Templates */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-md font-medium text-gray-800 mb-3">Templates</h3>
              <div className="grid grid-cols-2 gap-2">
                {templates.map(template => (
                  <div 
                    key={template.id}
                    className="cursor-pointer border border-gray-200 rounded p-1 hover:border-blue-500"
                    onClick={() => loadTemplate(template.id)}
                  >
                    <img 
                      src={template.preview} 
                      alt={template.name}
                      className="w-full h-auto rounded"
                    />
                    <p className="text-xs text-center mt-1">{template.name}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Elements */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-md font-medium text-gray-800 mb-3">Add Elements</h3>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={addTextElement}
                  className="w-full flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FiType className="h-4 w-4 mr-2" />
                  Add Text
                </button>
                <label className="w-full flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
                  <FiImage className="h-4 w-4 mr-2" />
                  Upload Background
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleBackgroundUpload}
                  />
                </label>
              </div>
            </div>
            
            {/* Element Properties */}
            {selectedElement && (
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-md font-medium text-gray-800">Properties</h3>
                  <button
                    type="button"
                    onClick={deleteSelectedElement}
                    className="text-red-500 hover:text-red-700"
                    disabled={['qr-code', 'attendee-name', 'ticket-type'].includes(selectedElement.id)}
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="space-y-3">
                  {selectedElement.type === 'text' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Text Content
                        </label>
                        <input
                          type="text"
                          value={selectedElement.content}
                          onChange={(e) => updateElement('content', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          disabled={selectedElement.dynamic}
                        />
                        {selectedElement.dynamic && (
                          <p className="text-xs text-gray-500 mt-1">
                            This is a dynamic field and will be replaced with actual data
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Font Size
                        </label>
                        <input
                          type="number"
                          value={selectedElement.fontSize}
                          onChange={(e) => updateElement('fontSize', parseInt(e.target.value))}
                          min="8"
                          max="72"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Font Family
                        </label>
                        <select
                          value={selectedElement.fontFamily}
                          onChange={(e) => updateElement('fontFamily', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          {availableFonts.map(font => (
                            <option key={font} value={font}>{font}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Text Color
                        </label>
                        <input
                          type="color"
                          value={selectedElement.color}
                          onChange={(e) => updateElement('color', e.target.value)}
                          className="w-full h-8 p-0 border border-gray-300 rounded-md"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Font Weight
                        </label>
                        <select
                          value={selectedElement.fontWeight}
                          onChange={(e) => updateElement('fontWeight', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="normal">Normal</option>
                          <option value="bold">Bold</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Alignment
                        </label>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => updateElement('textAlign', 'left')}
                            className={`flex-1 flex items-center justify-center px-3 py-2 border rounded-md text-sm ${
                              selectedElement.textAlign === 'left' || !selectedElement.textAlign
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                            }`}
                          >
                            <FiAlignLeft className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => updateElement('textAlign', 'center')}
                            className={`flex-1 flex items-center justify-center px-3 py-2 border rounded-md text-sm ${
                              selectedElement.textAlign === 'center'
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                            }`}
                          >
                            <FiAlignCenter className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => updateElement('textAlign', 'right')}
                            className={`flex-1 flex items-center justify-center px-3 py-2 border rounded-md text-sm ${
                              selectedElement.textAlign === 'right'
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                            }`}
                          >
                            <FiAlignRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {selectedElement.type === 'qrcode' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        QR Code Size
                      </label>
                      <input
                        type="number"
                        value={selectedElement.width}
                        onChange={(e) => {
                          const size = parseInt(e.target.value);
                          updateElement('width', size);
                          updateElement('height', size);
                        }}
                        min="50"
                        max="300"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        This is a dynamic QR code and will be generated for each ticket
                      </p>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Position
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-gray-500">X</label>
                        <input
                          type="number"
                          value={Math.round(selectedElement.x)}
                          onChange={(e) => updateElement('x', parseInt(e.target.value))}
                          min="0"
                          max={canvas.width}
                          className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500">Y</label>
                        <input
                          type="number"
                          value={Math.round(selectedElement.y)}
                          onChange={(e) => updateElement('y', parseInt(e.target.value))}
                          min="0"
                          max={canvas.height}
                          className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Canvas */}
          <div className="flex-1">
            <div className="mb-4 flex justify-between items-center">
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setShowGrid(!showGrid)}
                  className={`px-3 py-1.5 border rounded-md text-sm flex items-center ${
                    showGrid
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                  }`}
                >
                  <FiGrid className="h-4 w-4 mr-1" />
                  {showGrid ? 'Hide Grid' : 'Show Grid'}
                </button>
                <button
                  type="button"
                  onClick={previewTicket}
                  className="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50 flex items-center"
                >
                  <FiEye className="h-4 w-4 mr-1" />
                  Preview
                </button>
              </div>
              
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={saveTemplate}
                  className="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50 flex items-center"
                >
                  <FiSave className="h-4 w-4 mr-1" />
                  Save
                </button>
                <button
                  type="button"
                  onClick={exportTemplate}
                  className="px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm text-white bg-blue-500 hover:bg-blue-600 flex items-center"
                >
                  <FiDownload className="h-4 w-4 mr-1" />
                  Export
                </button>
              </div>
            </div>
            
            <div 
              className="border border-gray-300 rounded-lg overflow-auto"
              style={{ maxWidth: '100%', maxHeight: '70vh' }}
            >
              <div
                ref={canvasRef}
                className="relative"
                style={{
                  width: `${canvas.width}px`,
                  height: `${canvas.height}px`,
                  backgroundColor: canvas.background,
                  backgroundImage: canvas.backgroundImage ? `url(${canvas.backgroundImage})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  cursor: isDragging ? 'grabbing' : 'default',
                }}
                onClick={handleCanvasClick}
              >
                {/* Grid */}
                {showGrid && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="w-full h-full" style={{
                      backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)',
                      backgroundSize: '20px 20px'
                    }}></div>
                  </div>
                )}
                
                {/* Elements */}
                {elements.map(element => (
                  <div
                    key={element.id}
                    className={`absolute cursor-move ${selectedElement?.id === element.id ? 'ring-2 ring-blue-500' : ''}`}
                    style={{
                      left: `${element.x}px`,
                      top: `${element.y}px`,
                      padding: '4px',
                    }}
                    onMouseDown={(e) => handleElementClick(e, element)}
                  >
                    {element.type === 'text' && (
                      <div
                        style={{
                          fontSize: `${element.fontSize}px`,
                          fontFamily: element.fontFamily,
                          color: element.color,
                          fontWeight: element.fontWeight,
                          textAlign: element.textAlign || 'left',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {element.content}
                      </div>
                    )}
                    
                    {element.type === 'qrcode' && (
                      <div
                        style={{
                          width: `${element.width}px`,
                          height: `${element.height}px`,
                          backgroundColor: '#f3f4f6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px dashed #9ca3af',
                        }}
                      >
                        <div className="text-xs text-gray-500 text-center">
                          QR Code<br />
                          (Generated for each ticket)
                        </div>
                      </div>
                    )}
                    
                    {/* Drag handle for selected element */}
                    {selectedElement?.id === element.id && (
                      <div className="absolute -top-3 -right-3 bg-blue-500 text-white rounded-full p-1">
                        <FiMove className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDesigner;