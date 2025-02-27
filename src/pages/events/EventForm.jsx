import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiCalendar, FiClock, FiMapPin, FiTag, FiDollarSign, FiUsers, FiImage, FiX, FiPlus } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';

const EventForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: '',
    location: '',
    amenities: [],
    ticketsAvailable: '',
    price: '',
    eventDate: null,
    eventTime: '',
    sellingPeriodStart: null,
    sellingPeriodEnd: null,
    category: '',
    thumbnail: null,
    gallery: []
  });
  
  // Form validation state
  const [errors, setErrors] = useState({});
  
  // New amenity input state
  const [newAmenity, setNewAmenity] = useState('');
  
  // Event types
  const eventTypes = ['inperson', 'online', 'hybrid'];
  
  // Event categories
  const categories = [
    'Concert',
    'Conference',
    'Workshop',
    'Seminar',
    'Exhibition',
    'Networking',
    'Sports',
    'Other'
  ];
  
  // Fetch event data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchEvent = async () => {
        setIsLoading(true);
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock data for edit mode
          const eventData = {
            title: 'JKT 48 11th Anniversary Concert',
            description: '<p>Are you ready to fly again? JKT48 will soon be celebrating its 11th anniversary through the JKT48 11th Anniversary Concert: Flying High.</p><p>Fasten your seat belt, because JKT48 will invite you to fly higher into the sky. Together, we will witness the beauty of the universe through the songs and dances of the JKT48 stars.</p>',
            eventType: 'inperson',
            location: 'Gelora Bung Karno Stadium, Jakarta, Indonesia',
            amenities: ['Free Drinks', 'Indoor food', 'Merchandise Booth'],
            ticketsAvailable: '25000',
            price: '120',
            eventDate: new Date('2023-12-31'),
            eventTime: '16:00',
            sellingPeriodStart: new Date('2023-09-01'),
            sellingPeriodEnd: new Date('2023-12-01'),
            category: 'Concert',
            thumbnail: null,
            gallery: []
          };
          
          setFormData(eventData);
          setIsLoading(false);
        } catch (err) {
          toast.error('Failed to fetch event data. Please try again later.');
          setIsLoading(false);
          navigate('/events');
        }
      };
      
      fetchEvent();
    }
  }, [id, isEditMode, navigate]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  // Handle rich text editor changes
  const handleDescriptionChange = (content) => {
    setFormData({
      ...formData,
      description: content
    });
    
    if (errors.description) {
      setErrors({
        ...errors,
        description: ''
      });
    }
  };
  
  // Handle date changes
  const handleDateChange = (date, field) => {
    setFormData({
      ...formData,
      [field]: date
    });
    
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: ''
      });
    }
  };
  
  // Handle thumbnail upload
  const onThumbnailDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        setErrors({
          ...errors,
          thumbnail: 'Please upload an image file'
        });
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({
          ...errors,
          thumbnail: 'Image size should be less than 5MB'
        });
        return;
      }
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      
      setFormData({
        ...formData,
        thumbnail: {
          file,
          preview: previewUrl
        }
      });
      
      if (errors.thumbnail) {
        setErrors({
          ...errors,
          thumbnail: ''
        });
      }
    }
  };
  
  // Handle gallery upload
  const onGalleryDrop = (acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => {
      // Check file type
      if (!file.type.startsWith('image/')) {
        setErrors({
          ...errors,
          gallery: 'Please upload image files only'
        });
        return null;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({
          ...errors,
          gallery: 'Each image should be less than 5MB'
        });
        return null;
      }
      
      return {
        file,
        preview: URL.createObjectURL(file)
      };
    }).filter(Boolean);
    
    if (newFiles.length > 0) {
      setFormData({
        ...formData,
        gallery: [...formData.gallery, ...newFiles]
      });
      
      if (errors.gallery) {
        setErrors({
          ...errors,
          gallery: ''
        });
      }
    }
  };
  
  // Remove gallery image
  const removeGalleryImage = (index) => {
    const updatedGallery = [...formData.gallery];
    updatedGallery.splice(index, 1);
    setFormData({
      ...formData,
      gallery: updatedGallery
    });
  };
  
  // Add new amenity
  const addAmenity = () => {
    if (newAmenity.trim()) {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, newAmenity.trim()]
      });
      setNewAmenity('');
    }
  };
  
  // Remove amenity
  const removeAmenity = (index) => {
    const updatedAmenities = [...formData.amenities];
    updatedAmenities.splice(index, 1);
    setFormData({
      ...formData,
      amenities: updatedAmenities
    });
  };
  
  // Dropzone hooks
  const { getRootProps: getThumbnailRootProps, getInputProps: getThumbnailInputProps } = useDropzone({
    onDrop: onThumbnailDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1
  });
  
  const { getRootProps: getGalleryRootProps, getInputProps: getGalleryInputProps } = useDropzone({
    onDrop: onGalleryDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    }
  });
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    if (!formData.title.trim()) newErrors.title = 'Event title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.eventType) newErrors.eventType = 'Event type is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.eventDate) newErrors.eventDate = 'Event date is required';
    if (!formData.eventTime.trim()) newErrors.eventTime = 'Event time is required';
    if (!formData.sellingPeriodStart) newErrors.sellingPeriodStart = 'Selling period start date is required';
    if (!formData.sellingPeriodEnd) newErrors.sellingPeriodEnd = 'Selling period end date is required';
    if (!formData.category) newErrors.category = 'Category is required';
    
    // Numeric fields validation
    if (formData.ticketsAvailable && isNaN(Number(formData.ticketsAvailable))) {
      newErrors.ticketsAvailable = 'Tickets available must be a number';
    }
    
    if (formData.price && isNaN(Number(formData.price))) {
      newErrors.price = 'Price must be a number';
    }
    
    // Date validation
    if (formData.sellingPeriodStart && formData.sellingPeriodEnd && 
        formData.sellingPeriodStart > formData.sellingPeriodEnd) {
      newErrors.sellingPeriodEnd = 'End date must be after start date';
    }
    
    if (formData.sellingPeriodEnd && formData.eventDate && 
        formData.sellingPeriodEnd > formData.eventDate) {
      newErrors.eventDate = 'Event date must be after selling period ends';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
   // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success message
      toast.success(`Event ${isEditMode ? 'updated' : 'created'} successfully!`);
      
      // Redirect to events list
      navigate('/events');
    } catch (err) {
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} event. Please try again.`);
      setIsSaving(false);
    }
  };
  
  // Format date for display
  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">
          {isEditMode ? 'Edit Event' : 'Create New Event'}
        </h2>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-6">
          {/* Event Thumbnail */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Thumbnail
            </label>
            <div 
              {...getThumbnailRootProps()} 
              className={`border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 ${
                errors.thumbnail ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <input {...getThumbnailInputProps()} />
              
              {formData.thumbnail ? (
                <div className="relative">
                  <img 
                    src={formData.thumbnail.preview} 
                    alt="Thumbnail preview" 
                    className="h-40 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFormData({
                        ...formData,
                        thumbnail: null
                      });
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <FiX className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  <FiImage className="h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Drag and drop an image, or click to browse</p>
                  <p className="text-xs text-gray-400 mt-1">Recommended size: 1200 x 630 pixels</p>
                </>
              )}
            </div>
            {errors.thumbnail && <p className="mt-1 text-sm text-red-600">{errors.thumbnail}</p>}
          </div>
          
          {/* Event Gallery */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Gallery
            </label>
            <div 
              {...getGalleryRootProps()} 
              className={`border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 ${
                errors.gallery ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <input {...getGalleryInputProps()} />
              <FiImage className="h-12 w-12 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Drag and drop images, or click to browse</p>
              <p className="text-xs text-gray-400 mt-1">Up to 10 images, max 5MB each</p>
            </div>
            {errors.gallery && <p className="mt-1 text-sm text-red-600">{errors.gallery}</p>}
            
            {/* Gallery Preview */}
            {formData.gallery.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {formData.gallery.map((image, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={image.preview} 
                      alt={`Gallery image ${index + 1}`} 
                      className="h-24 w-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <FiX className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Event Name */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Event Name *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter event name"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>
          
          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <ReactQuill
              id="description"
              value={formData.description}
              onChange={handleDescriptionChange}
              className={errors.description ? 'border-red-300' : ''}
              placeholder="Describe your event"
              modules={{
                toolbar: [
                  [{ 'header': [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                  ['link', 'image'],
                  ['clean']
                ]
              }}
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>
          
          {/* Event Type and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-2">
                Event Type *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiTag className="text-gray-400" />
                </div>
                <select
                  id="eventType"
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  className={`w-full pl-10 px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.eventType ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select event type</option>
                  {eventTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              {errors.eventType && <p className="mt-1 text-sm text-red-600">{errors.eventType}</p>}
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiTag className="text-gray-400" />
                </div>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full pl-10 px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.category ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
            </div>
          </div>
          
          {/* Event Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Event Location *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMapPin className="text-gray-400" />
              </div>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`w-full pl-10 px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.location ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter event location"
              />
            </div>
            {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
          </div>
          
          {/* Event Amenities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Amenities
            </label>
            <div className="space-y-3">
              {formData.amenities.map((amenity, index) => (
                <div key={index} className="relative flex items-center">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiTag className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={amenity}
                    readOnly
                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => removeAmenity(index)}
                    className="absolute right-2 text-red-500 hover:text-red-700"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>
              ))}
              
              <div className="relative flex items-center">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiTag className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                  className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10"
                  placeholder="Add amenity"
                />
                <button
                  type="button"
                  onClick={addAmenity}
                  className="absolute right-2 text-blue-500 hover:text-blue-700"
                >
                  <FiPlus className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Ticket Available & Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="ticketsAvailable" className="block text-sm font-medium text-gray-700 mb-2">
                Tickets Available
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUsers className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="ticketsAvailable"
                  name="ticketsAvailable"
                  value={formData.ticketsAvailable}
                  onChange={handleChange}
                  className={`w-full pl-10 px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.ticketsAvailable ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter number of available tickets"
                />
              </div>
              {errors.ticketsAvailable && <p className="mt-1 text-sm text-red-600">{errors.ticketsAvailable}</p>}
            </div>
            
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Ticket Price ($)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiDollarSign className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className={`w-full pl-10 px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.price ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter ticket price"
                />
              </div>
              {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
            </div>
          </div>
          
          {/* Event Date & Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Date & Time *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiCalendar className="text-gray-400" />
                  </div>
                  <DatePicker
                    id="eventDate"
                    selected={formData.eventDate}
                    onChange={(date) => handleDateChange(date, 'eventDate')}
                    dateFormat="MMMM d, yyyy"
                    minDate={new Date()}
                    className={`w-full pl-10 px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.eventDate ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholderText="Select event date"
                  />
                </div>
                {errors.eventDate && <p className="mt-1 text-sm text-red-600">{errors.eventDate}</p>}
              </div>
              
              <div>
                <label htmlFor="eventTime" className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiClock className="text-gray-400" />
                  </div>
                  <input
                    type="time"
                    id="eventTime"
                    name="eventTime"
                    value={formData.eventTime}
                    onChange={handleChange}
                    className={`w-full pl-10 px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.eventTime ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.eventTime && <p className="mt-1 text-sm text-red-600">{errors.eventTime}</p>}
              </div>
            </div>
          </div>
          
          {/* Ticket Selling Period */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ticket Selling Period *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="sellingPeriodStart" className="block text-sm font-medium text-gray-700 mb-2">
                  From
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiCalendar className="text-gray-400" />
                  </div>
                  <DatePicker
                    id="sellingPeriodStart"
                    selected={formData.sellingPeriodStart}
                    onChange={(date) => handleDateChange(date, 'sellingPeriodStart')}
                    dateFormat="MMMM d, yyyy"
                    className={`w-full pl-10 px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.sellingPeriodStart ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholderText="Select start date"
                  />
                </div>
                {errors.sellingPeriodStart && <p className="mt-1 text-sm text-red-600">{errors.sellingPeriodStart}</p>}
              </div>
              
              <div>
                <label htmlFor="sellingPeriodEnd" className="block text-sm font-medium text-gray-700 mb-2">
                  To
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiCalendar className="text-gray-400" />
                  </div>
                  <DatePicker
                    id="sellingPeriodEnd"
                    selected={formData.sellingPeriodEnd}
                    onChange={(date) => handleDateChange(date, 'sellingPeriodEnd')}
                    dateFormat="MMMM d, yyyy"
                    minDate={formData.sellingPeriodStart}
                    className={`w-full pl-10 px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.sellingPeriodEnd ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholderText="Select end date"
                  />
                </div>
                {errors.sellingPeriodEnd && <p className="mt-1 text-sm text-red-600">{errors.sellingPeriodEnd}</p>}
              </div>
            </div>
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="mt-8 pt-5 border-t border-gray-200 flex justify-end">
          <button
            type="button"
            onClick={() => navigate('/events')}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className={`ml-3 inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isSaving ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSaving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isEditMode ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>{isEditMode ? 'Update Event' : 'Create Event'}</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;