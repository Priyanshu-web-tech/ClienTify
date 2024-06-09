import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';


const CreateCampaign = () => {
  const [name, setName] = useState('');
  const [totalSpends, setTotalSpends] = useState('');
  const [maxVisits, setMaxVisits] = useState('');
  const [lastVisit, setLastVisit] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const rules = { totalSpends, maxVisits, lastVisit };
    const campaign = { name, rules };
    await axios.post('api/campaigns/create', campaign);
    toast.success('Campaign created successfully');
  };

  return (
    <div>
      <h2>Create Campaign</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Campaign Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="number" placeholder="Total Spends Greater Than" value={totalSpends} onChange={(e) => setTotalSpends(e.target.value)} />
        <input type="number" placeholder="Max Visits Less Than or Equal" value={maxVisits} onChange={(e) => setMaxVisits(e.target.value)} />
        <input type="number" placeholder="Last Visit More Than Months Ago" value={lastVisit} onChange={(e) => setLastVisit(e.target.value)} />
        <button type="submit">Create Campaign</button>
      </form>
    </div>
  );
};

export default CreateCampaign;
