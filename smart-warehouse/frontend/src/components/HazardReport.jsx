import React, { useState } from 'react';
import axios from 'axios';
import { Camera, AlertTriangle, Loader2 } from 'lucide-react';

const HazardReport = ({ onHazardReported }) => {
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('medium');
  const [facility, setFacility] = useState('Facility 1');
  const [photo, setPhoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('description', description);
      formData.append('severity', severity);
      formData.append('facility', facility);
      if (photo) {
        formData.append('photo', photo);
      }

      await axios.post('http://localhost:5001/api/hazards', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setMessage({ type: 'success', text: 'Hazard reported successfully.' });
      setDescription('');
      setPhoto(null);
      if (onHazardReported) onHazardReported();
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Failed to report hazard. Check console.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-amber-500" />
        <h2 className="text-lg font-semibold text-flex-dark">Report Hazard</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
        {message && (
          <div className={`p-3 rounded text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {message.text}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Facility</label>
          <select 
            value={facility} 
            onChange={(e) => setFacility(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-flex-blue text-sm"
          >
            <option>Facility 1</option>
            <option>Facility 2</option>
            <option>Facility 3</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea 
            required
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the safety hazard..."
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-flex-blue text-sm resize-none"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
          <div className="flex gap-4">
            {['low', 'medium', 'high'].map(sev => (
              <label key={sev} className="flex items-center gap-1 text-sm cursor-pointer">
                <input 
                  type="radio" 
                  name="severity" 
                  value={sev} 
                  checked={severity === sev} 
                  onChange={(e) => setSeverity(e.target.value)} 
                  className="text-flex-blue focus:ring-flex-blue"
                />
                <span className="capitalize">{sev}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <Camera className="w-4 h-4" /> Photo (Optional)
          </label>
          <input 
            type="file" 
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-flex-blue hover:file:bg-gray-100"
          />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="mt-2 w-full py-2 bg-flex-dark text-white rounded font-medium hover:bg-black transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Report'}
        </button>
      </form>
    </div>
  );
};

export default HazardReport;
