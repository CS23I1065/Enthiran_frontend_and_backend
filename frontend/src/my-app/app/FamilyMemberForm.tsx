import React, { useState } from 'react';

const FamilyMemberForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        relation: '',
        aadhaar: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form Submitted:', formData);
        // Add functionality to send data to an API or state management
        alert('Family member details submitted successfully!');
    };

    return (
        <div>
            <h2>Family Member Form</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="relation">Relation:</label>
                    <select
                        id="relation"
                        name="relation"
                        value={formData.relation}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Relation</option>
                        <option value="Father">Father</option>
                        <option value="Mother">Mother</option>
                        <option value="Sibling">Sibling</option>
                        <option value="Spouse">Spouse</option>
                        <option value="Child">Child</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="aadhaar">Aadhaar Number:</label>
                    <input
                        type="text"
                        id="aadhaar"
                        name="aadhaar"
                        value={formData.aadhaar}
                        onChange={handleChange}
                        maxLength={12}
                        pattern="\d{12}"
                        title="Aadhaar number must be 12 digits"
                        required
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default FamilyMemberForm;

