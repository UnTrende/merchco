
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input, { Textarea } from '../../components/Input';
import Icon from '../../components/Icon';
import Spinner from '../../components/Spinner';
import * as api from '../../api/mockApi';

const CustomTshirtPage: React.FC = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const colors = ['#FFFFFF', '#000000', '#6B7280', '#EF4444', '#3B82F6', '#10B981'];
  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if(e.target.files && e.target.files[0]) {
          const selectedFile = e.target.files[0];
          setFile(selectedFile);
          setPreviewUrl(URL.createObjectURL(selectedFile));
      }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSubmitting(true);
      
      const formData = new FormData(e.currentTarget);
      let publicImageUrl = '';

      try {
          if (file) {
              publicImageUrl = await api.uploadFile(file);
          }

          const requestData = {
              color: formData.get('color') as string,
              size: formData.get('size') as string,
              placement: formData.get('placement') as any,
              description: formData.get('description') as string,
              imageUrl: publicImageUrl
          };

          await api.createCustomRequest(requestData);
          alert('Request submitted successfully!');
          navigate('/profile/requests');
      } catch (error: any) {
          console.error(error);
          alert(error.message || 'Failed to submit request');
      } finally {
          setSubmitting(false);
      }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Preview Section */}
        <div className="space-y-4">
          <Card padding="none" className="aspect-square flex flex-col items-center justify-center bg-gray-100 relative overflow-hidden">
            {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
            ) : (
                <div className="text-center p-6">
                    <Icon name="upload-cloud" className="w-12 h-12 text-text-secondary mx-auto mb-2" />
                    <p className="text-text-secondary">Upload design to preview</p>
                </div>
            )}
             {previewUrl && <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-1 text-center">Uploaded Image Preview</div>}
          </Card>
        </div>

        {/* Form Section */}
        <div>
          <Card padding="lg">
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-1">Design Your T-Shirt</h1>
            <p className="text-text-secondary mb-6">Fill out the details below to submit your custom request.</p>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">T-shirt Color</label>
                <div className="flex flex-wrap gap-3">
                    {colors.map((color, idx) => (
                        <label key={color}>
                            <input type="radio" name="color" value={color} className="sr-only peer" defaultChecked={idx===0} />
                            <div style={{ backgroundColor: color }} className="w-10 h-10 rounded-full border border-border cursor-pointer peer-checked:ring-2 peer-checked:ring-offset-2 peer-checked:ring-accent"></div>
                        </label>
                    ))}
                </div>
              </div>
              
              <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Size</label>
                  <div className="flex flex-wrap gap-2">
                       {sizes.map((size, idx) => (
                           <label key={size}>
                                <input type="radio" name="size" value={size} className="sr-only peer" defaultChecked={idx===1} />
                                <div className="w-12 h-12 flex items-center justify-center text-sm border border-border rounded-md cursor-pointer peer-checked:bg-accent peer-checked:text-white peer-checked:border-accent">{size}</div>
                           </label>
                       ))}
                  </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Placement</label>
                <div className="grid grid-cols-2 gap-4">
                    <label><input type="radio" name="placement" value="front" className="sr-only peer" defaultChecked/>
                        <div className="p-4 border rounded-lg text-center cursor-pointer peer-checked:border-accent peer-checked:bg-accent/10">Front</div>
                    </label>
                    <label><input type="radio" name="placement" value="back" className="sr-only peer" />
                        <div className="p-4 border rounded-lg text-center cursor-pointer peer-checked:border-accent peer-checked:bg-accent/10">Back</div>
                    </label>
                    <label><input type="radio" name="placement" value="both" className="sr-only peer" />
                        <div className="p-4 border rounded-lg text-center cursor-pointer peer-checked:border-accent peer-checked:bg-accent/10">Both</div>
                    </label>
                </div>
              </div>
              
              <div>
                 <label className="block text-sm font-medium text-text-secondary mb-2">Upload Image</label>
                 <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-border border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                        <Icon name="upload-cloud" className="mx-auto h-12 w-12 text-text-secondary" />
                        <div className="flex text-sm text-gray-600">
                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-accent hover:text-accent focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-accent">
                                <span>Upload a file</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                </div>
              </div>

              <Textarea name="description" label="Description" placeholder="Tell us about your design, any special instructions, etc." required />
              <Input name="phone" label="Phone Number" type="tel" placeholder="Your contact number" required />

              <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                  {submitting ? <Spinner /> : 'Submit Request'}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CustomTshirtPage;