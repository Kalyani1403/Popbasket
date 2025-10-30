import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Address } from '../types';

interface ProfileViewProps {
	onBack: () => void;
}

const emptyAddress = (): Address => ({ id: Date.now(), label: 'Home', fullName: '', phone: '', street: '', city: '', state: '', postalCode: '', country: '', isDefault: false });

const ProfileView: React.FC<ProfileViewProps> = ({ onBack }) => {
	const { currentUser, updateProfile } = useAuth();
	const [avatarPreview, setAvatarPreview] = useState<string | undefined>(currentUser?.avatar);
	const [name, setName] = useState(currentUser?.name || '');
	const [email, setEmail] = useState(currentUser?.email || '');
	const [phone, setPhone] = useState(currentUser?.phone || '');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [isSaving, setIsSaving] = useState(false);

	// Address management
	const [addresses, setAddresses] = useState<Address[]>(currentUser?.addresses || []);
	const [editingAddress, setEditingAddress] = useState<Address | null>(null);
	const [showAddressForm, setShowAddressForm] = useState(false);

	if (!currentUser) {
		return (
			<div className="max-w-md mx-auto py-20 text-center">
				<p className="text-gray-600">You need to be signed in to view your profile.</p>
				<button onClick={onBack} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md">Back</button>
			</div>
		);
	}

	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setSuccess('');

		if (password && password !== confirmPassword) {
			setError('Passwords do not match.');
			return;
		}

		setIsSaving(true);
		try {
			const updates: any = { name, email, phone, addresses };
			if (avatarPreview) updates.avatar = avatarPreview;
			if (password) updates.password = password;
			await updateProfile(updates);
			setSuccess('Profile updated successfully.');
			setPassword('');
			setConfirmPassword('');
		} catch (err: any) {
			setError(err.message || 'Failed to update profile');
		} finally {
			setIsSaving(false);
		}
	};

	const handleAvatarChange = (file?: File) => {
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => {
			setAvatarPreview(reader.result as string);
		};
		reader.readAsDataURL(file);
	};

	const startAddAddress = () => {
		setEditingAddress(emptyAddress());
		setShowAddressForm(true);
	};

	const startEditAddress = (addr: Address) => {
		setEditingAddress({ ...addr });
		setShowAddressForm(true);
	};

	const saveAddress = (addr: Address) => {
		let next = [...addresses];
		if (addr.isDefault) {
			next = next.map(a => ({ ...a, isDefault: a.id === addr.id }));
		}
		const idx = next.findIndex(a => a.id === addr.id);
		if (idx >= 0) {
			next[idx] = addr;
		} else {
			next.push(addr);
		}
		setAddresses(next);
		setShowAddressForm(false);
		setEditingAddress(null);
	};

	const deleteAddress = (id: number) => {
		setAddresses(prev => prev.filter(a => a.id !== id));
	};

	const setDefaultAddress = (id: number) => {
		setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
	};

	return (
		<div className="max-w-3xl mx-auto py-10 px-4">
			<div className="bg-white shadow rounded-md p-6">
				<div className="flex items-center gap-4 mb-4">
					<div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
						{avatarPreview ? (
							<img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
						) : (
							<span className="text-gray-400">No image</span>
						)}
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700">Profile picture</label>
						<input
							type="file"
							accept="image/*"
							onChange={(e) => handleAvatarChange(e.target.files ? e.target.files[0] : undefined)}
							className="mt-1"
						/>
						<p className="text-xs text-gray-500 mt-1">Supported: JPG, PNG. Max size depends on browser; images are stored as data URLs for this demo.</p>
					</div>
				</div>
				<h2 className="text-2xl font-semibold mb-4">Your Profile</h2>
				<form onSubmit={handleSave} className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700">Full name</label>
							<input
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700">Email</label>
							<input
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								type="email"
								className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700">Phone</label>
							<input
								value={phone}
								onChange={(e) => setPhone(e.target.value)}
								type="tel"
								className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700">New password (leave blank to keep current)</label>
							<input
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								type="password"
								className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700">Confirm new password</label>
							<input
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								type="password"
								className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
							/>
						</div>
					</div>

					{error && <p className="text-sm text-red-600">{error}</p>}
					{success && <p className="text-sm text-green-600">{success}</p>}

					<div className="flex items-center justify-between">
						<div className="flex gap-3">
							<button type="submit" disabled={isSaving} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-60">{isSaving ? 'Saving...' : 'Save'}</button>
							<button type="button" onClick={onBack} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md">Cancel</button>
						</div>
					</div>
				</form>
			</div>

			<div className="mt-8 bg-white shadow rounded-md p-6">
				<div className="flex items-center justify-between">
					<h3 className="text-lg font-medium">Addresses</h3>
					<div>
						<button onClick={startAddAddress} className="px-3 py-2 bg-green-500 text-white rounded-md">Add address</button>
					</div>
				</div>

				<div className="mt-4 space-y-3">
					{addresses.length === 0 && <p className="text-sm text-gray-500">No saved addresses yet.</p>}
					{addresses.map(addr => (
						<div key={addr.id} className="border rounded-md p-3 flex items-start justify-between">
							<div>
								<div className="flex items-center gap-3">
									<div className="font-medium">{addr.label || 'Address'}</div>
									{addr.isDefault && <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">Default</span>}
								</div>
								<div className="text-sm text-gray-700 mt-1">
									<div>{addr.fullName}</div>
									<div>{addr.street}, {addr.city} {addr.postalCode}</div>
									<div>{addr.state} {addr.country}</div>
									<div className="mt-1">Phone: {addr.phone}</div>
								</div>
							</div>
							<div className="flex flex-col items-end gap-2">
								<div>
									<button onClick={() => setDefaultAddress(addr.id)} className="text-sm text-indigo-600 hover:underline">Set as default</button>
								</div>
								<div className="flex gap-2">
									<button onClick={() => startEditAddress(addr)} className="px-2 py-1 bg-blue-100 text-blue-700 rounded">Edit</button>
									<button onClick={() => deleteAddress(addr.id)} className="px-2 py-1 bg-red-100 text-red-700 rounded">Delete</button>
								</div>
							</div>
						</div>
					))}
				</div>

				{showAddressForm && editingAddress && (
					<div className="mt-4 border-t pt-4">
						<h4 className="text-sm font-medium mb-2">{addresses.find(a => a.id === editingAddress.id) ? 'Edit address' : 'Add address'}</h4>
						<AddressForm
							initial={editingAddress}
							onCancel={() => { setShowAddressForm(false); setEditingAddress(null); }}
							onSave={(a) => saveAddress(a)}
						/>
					</div>
				)}
			</div>
		</div>
	);
};

const AddressForm: React.FC<{ initial: Address; onSave: (a: Address) => void; onCancel: () => void }> = ({ initial, onSave, onCancel }) => {
	const [addr, setAddr] = useState<Address>(initial);

	return (
		<form onSubmit={(e) => { e.preventDefault(); onSave(addr); }} className="space-y-3">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
				<input value={addr.label} onChange={(e) => setAddr({ ...addr, label: e.target.value })} placeholder="Label (Home, Work)" className="border px-3 py-2 rounded" />
				<input value={addr.fullName} onChange={(e) => setAddr({ ...addr, fullName: e.target.value })} placeholder="Full name" className="border px-3 py-2 rounded" />
			</div>
			<div>
				<input value={addr.phone} onChange={(e) => setAddr({ ...addr, phone: e.target.value })} placeholder="Phone" className="w-full border px-3 py-2 rounded" />
			</div>
			<div>
				<input value={addr.street} onChange={(e) => setAddr({ ...addr, street: e.target.value })} placeholder="Street address" className="w-full border px-3 py-2 rounded" />
			</div>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
				<input value={addr.city} onChange={(e) => setAddr({ ...addr, city: e.target.value })} placeholder="City" className="border px-3 py-2 rounded" />
				<input value={addr.state} onChange={(e) => setAddr({ ...addr, state: e.target.value })} placeholder="State" className="border px-3 py-2 rounded" />
				<input value={addr.postalCode} onChange={(e) => setAddr({ ...addr, postalCode: e.target.value })} placeholder="Postal code" className="border px-3 py-2 rounded" />
			</div>
			<div>
				<input value={addr.country} onChange={(e) => setAddr({ ...addr, country: e.target.value })} placeholder="Country" className="w-full border px-3 py-2 rounded" />
			</div>
			<div className="flex items-center gap-3">
				<label className="inline-flex items-center"><input type="checkbox" checked={addr.isDefault} onChange={(e) => setAddr({ ...addr, isDefault: e.target.checked })} className="mr-2" /> Set as default</label>
			</div>
			<div className="flex gap-3">
				<button type="submit" className="px-3 py-2 bg-indigo-600 text-white rounded">Save address</button>
				<button type="button" onClick={onCancel} className="px-3 py-2 bg-gray-100 rounded">Cancel</button>
			</div>
		</form>
	);
};

export default ProfileView;
