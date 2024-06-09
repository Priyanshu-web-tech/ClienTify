import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CampaignsList = () => {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      const res = await axios.get('api/campaigns');
      setCampaigns(res.data.data);
    };
    fetchCampaigns();
  }, []);

  return (
    <div>
      <h2>Campaigns List</h2>
      <ul>
        {campaigns.map((campaign) => (
          <li key={campaign._id}>
            <h3>{campaign.name}</h3>
            <p>Status: {campaign.status}</p>
            <p>Audience Size: {campaign.audience.length}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CampaignsList;
