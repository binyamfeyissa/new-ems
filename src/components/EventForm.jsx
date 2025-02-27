import { useState, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FiCalendar, FiClock, FiMapPin, FiTag, FiDollarSign, FiUsers, FiImage } from 'react-icons/fi';

const EventForm = () => {
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    date: null,
    time: '',
    location: '',
    description: '',
    category: '',
    price: '',
    maxAttendees: '',
    image: null
  });

  // Form validation state
  const [errors, setErrors] = useState({});
  
  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  
  // Ref for file input
  const fileInputRef = useRef(null);

  // Event categories
  const categories = [
    'Conference',
    'Workshop',
    'Seminar',
    'Concert',
    'Exhibition',
    'Networking',
    'Sports',
    'Other'
  ];

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

  // Handle date change
  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      date
    });
    
    if (errors.date) {
      setErrors({
        ...errors,
        date: ''
      });
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.match('image.*')) {
        setErrors({
          ...errors,
          image: 'Please select an image file'
        });
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({
          ...errors,
          image: 'Image size should be less than 5MB'
        });
        return;
      }
      
      setFormData({
        ...formData,
        image: file
      });
      
      if (errors.image) {
        setErrors({
          ...errors,
          image: ''
        });
      }
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    if (!formData.title.trim()) newErrors.title = 'Event title is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time.trim()) newErrors.time = 'Time is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    
    // Price validation (if provided)
    if (formData.price && isNaN(Number(formData.price))) {
      newErrors.price = 'Price must be a number';
    }
    
    // Max attendees validation (if provided)
    if (formData.maxAttendees && isNaN(Number(formData.maxAttendees))) {
      newErrors.maxAttendees = 'Maximum attendees must be a number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      setSubmitStatus({
        type: 'error',
        message: 'Please fix the errors in the form'
      });
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real application, you would send the form data to your backend here
      console.log('Form submitted successfully:', formData);
      
      // Show success message
      setSubmitStatus({
        type: 'success',
        message: 'Event posted successfully!'
      });
      
      // Reset form
      setFormData({
        title: '',
        date: null,
        time: '',
        location: '',
        description: '',
        category: '',
        price: '',
        maxAttendees: '',
        image: null
      });
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Failed to post event. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Post a New Event</h2>
      
      {/* Status message */}
      {submitStatus.message && (
        <div 
          className={`mb-4 p-4 rounded-md ${
            submitStatus.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {submitStatus.message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Event Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Event Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter event title"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>
        
        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCalendar className="text-gray-400" />
              </div>
              <DatePicker
                selected={formData.date}
                onChange={handleDateChange}
                dateFormat="MMMM d, yyyy"
                minDate={new Date()}
                className={`w-full pl-10 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.date ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholderText="Select date"
              />
            </div>
            {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
          </div>
          
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
              Time *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiClock className="text-gray-400" />
              </div>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className={`w-full pl-10 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.time ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.time && <p className="mt-1 text-sm text-red-600">{errors.time}</p>}
          </div>
        </div>
        
        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location *
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
              className={`w-full pl-10 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.location ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter event location"
            />
          </div>
          {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
        </div>
        
        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe your event"
          ></textarea>
        </div>
        
        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
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
              className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Image Upload */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
            Event Image
          </label>
          <div className="flex items-center">
            <label className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 border-dashed rounded-md cursor-pointer hover:bg-gray-50">
              <div className="flex items-center space-x-2">
                <FiImage className="text-gray-400" />
                <span className="text-gray-500">
                  {formData.image ? formData.image.name : 'Upload an image'}
                </span>
              </div>
              <input
                type="file"
                id="image"
                name="image"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </label>
          </div>
          {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
          <p className="mt-1 text-xs text-gray-500">Max file size: 5MB. Supported formats: JPG, PNG, GIF</p>
        </div>
        
        {/* Price and Max Attendees */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price (if applicable)
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
                className={`w-full pl-10 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.price ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
            </div>
            {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
          </div>
          
          <div>
            <label htmlFor="maxAttendees" className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Attendees
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUsers className="text-gray-400" />
              </div>
              <input
                type="text"
                id="maxAttendees"
                name="maxAttendees"
                value={formData.maxAttendees}
                onChange={handleChange}
                className={`w-full pl-10 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.maxAttendees ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter maximum attendees"
              />
            </div>
            {errors.maxAttendees && <p className="mt-1 text-sm text-red-600">{errors.maxAttendees}</p>}
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Posting...' : 'Post Event'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;