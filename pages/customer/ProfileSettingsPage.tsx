
import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useAuth } from '../../hooks/useAuth';
import * as api from '../../api/mockApi';

const ProfileSettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      const formData = new FormData(e.currentTarget);
      
      try {
          await api.updateProfile({
              name: formData.get('name') as string,
              address: formData.get('address') as string,
              city: formData.get('city') as string,
              postalCode: formData.get('postalCode') as string
          });
          alert('Profile updated!');
      } catch (error) {
          console.error(error);
          alert('Failed to update profile.');
      } finally {
          setLoading(false);
      }
  };

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setPassLoading(true);
      const formData = new FormData(e.currentTarget);
      const newPassword = formData.get('newPassword') as string;
      const confirmPassword = formData.get('confirmPassword') as string;

      if (newPassword !== confirmPassword) {
          alert("Passwords do not match");
          setPassLoading(false);
          return;
      }

      if (newPassword.length < 6) {
           alert("Password must be at least 6 characters");
           setPassLoading(false);
           return;
      }

      try {
          await api.updateUserPassword(newPassword);
          alert('Password updated successfully!');
          (e.target as HTMLFormElement).reset();
      } catch (error: any) {
          console.error(error);
          alert(error.message || 'Failed to update password.');
      } finally {
          setPassLoading(false);
      }
  };

  return (
    <div className="space-y-8">
        <Card>
        <h1 className="text-2xl font-bold text-text-primary mb-6">Profile Settings</h1>
        <form className="space-y-6" onSubmit={handleSave}>
            <div className="flex items-center space-x-4">
            <img src={`https://i.pravatar.cc/96?u=${user?.id}`} alt="User Avatar" className="w-24 h-24 rounded-full" />
            <Button variant="outline" type="button">Change Photo</Button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
                <Input label="Full Name" name="name" id="name" defaultValue={user?.name} />
                <Input label="Email Address" id="email" defaultValue={user?.email} readOnly className="bg-gray-100 cursor-not-allowed" />
            </div>
            
            <Input label="Address" name="address" id="address" defaultValue={user?.address} />
            
            <div className="grid md:grid-cols-2 gap-6">
                <Input label="City" name="city" id="city" defaultValue={user?.city} />
                <Input label="Postal Code" name="postalCode" id="postalCode" defaultValue={user?.postalCode} />
            </div>

            <div className="pt-4 flex justify-end">
                <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</Button>
            </div>
        </form>
        </Card>

        <Card>
            <h2 className="text-xl font-bold text-text-primary mb-6">Security</h2>
            <form className="space-y-6" onSubmit={handlePasswordChange}>
                <div className="grid md:grid-cols-2 gap-6">
                    <Input label="New Password" name="newPassword" type="password" placeholder="••••••••" required />
                    <Input label="Confirm New Password" name="confirmPassword" type="password" placeholder="••••••••" required />
                </div>
                 <div className="pt-4 flex justify-end">
                    <Button type="submit" variant="outline" disabled={passLoading}>{passLoading ? 'Updating...' : 'Update Password'}</Button>
                </div>
            </form>
        </Card>
    </div>
  );
};

export default ProfileSettingsPage;
