import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import EditCampaignModal from "../components/EditCampaignModal";
import CampaignCard from "../components/CampaignCard";
import AudienceTable from "../components/AudienceTable";

const CampaignsList = () => {
  const { currentUser } = useSelector((state) => state.user);

  const [campaigns, setCampaigns] = useState([]);
  const [audiences, setAudiences] = useState([]);
  const [campaignId, setCampaignId] = useState("");
  const [campaignMsg, setCampaignMsg] = useState("");
  const [campaignSearch, setCampaignSearch] = useState("");
  const [audienceSearch, setAudienceSearch] = useState("");
  const [sendingAudienceId, setSendingAudienceId] = useState(null);
  const [messageStats, setMessageStats] = useState({});
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const fetchCampaigns = async () => {
    try {
      const res = await axios.get(`api/campaigns/${currentUser._id}`);
      const { data } = res.data;
      data.reverse();
      setCampaigns(data);
    } catch (error) {
      toast.error(error.response.data.message || error.message);
    }
  };

  const fetchAudiences = async () => {
    try {
      const res = await axios.get(`api/audience/${currentUser._id}`);
      const { data } = res.data;
      data.reverse();
      setAudiences(data);
    } catch (error) {
      toast.error(error.response.data.message || error.message);
    }
  };

  const fetchMessageStats = async () => {
    try {
      const stats = await Promise.all(
        audiences
          .filter((audience) => audience.status !== "PENDING")
          .map(async (audience) => {
            const response = await axios.get(
              `api/communication/check-status?audienceId=${audience._id}`
            );

            return {
              audienceId: audience._id,
              stats: response.data.data,
            };
          })
      );

      const newStats = {};
      stats.forEach(({ audienceId, stats }) => {
        newStats[audienceId] = stats;
      });
      setMessageStats(newStats);
    } catch (error) {
      toast.error(
        "Error fetching msg stats",
        error.response.data.message || error.message
      );
    }
  };

  const sendMessage = async (audienceId, customerIds) => {
    if (!campaignId) {
      toast.error("Please select a campaign");
      return;
    }

    setSendingAudienceId(audienceId);

    const formData = {
      audienceId: audienceId,
      campaignId: campaignId,
      customerIds: customerIds,
      campaignMsg: campaignMsg,
      serverUrl: import.meta.env.VITE_BASE_URL,
    };

    try {
      const response = await axios.post(`api/customers/send-message`, formData);
      const { success } = response.data;
      if (success) {
        fetchAudiences();
      }
    } catch (error) {
      toast.error(error.response.data.message || error.message);
    } finally {
      setSendingAudienceId(null);
    }
  };

  const handleCampaignChange = (id, msg) => {
    setCampaignId(id);
    setCampaignMsg(msg);
  };

  const handleCampaignDelete = async (id) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this campaign?"
    );
    if (!shouldDelete || !id) {
      return;
    }

    try {
      await axios.delete(`api/campaigns/delete-campaign/${id}`);
      fetchCampaigns();
      toast.success("Campaign deleted successfully");
    } catch (error) {
      toast.error(error.response.data.message || "Error deleting campaign");
    }
  };

  const handleCampaignEdit = async (id) => {
    try {
      const campaignToEdit = campaigns.find((campaign) => campaign._id === id);
      setSelectedCampaign(campaignToEdit);
      setEditModalOpen(true);
    } catch (error) {
      toast.error("Error editing campaign");
    }
  };

  useEffect(() => {
    fetchCampaigns();
    fetchAudiences();
  }, []);

  useEffect(() => {
    fetchMessageStats();
  }, [audiences]);

  return (
    <div>
      <EditCampaignModal
        campaign={selectedCampaign}
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onUpdate={fetchCampaigns}
      />
      <div className="p-4 bg-pale-white rounded-lg">
        <h1 className="text-3xl font-bold mb-4">Campaign List</h1>
        <hr />
      </div>

      <div className="mb-4 mt-4">
        <input
          type="text"
          placeholder="Search Campaigns"
          value={campaignSearch}
          onChange={(e) => setCampaignSearch(e.target.value)}
          className="border border-gray rounded-md p-2 mb-2"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
        {campaigns
          .filter((campaign) =>
            campaign.name.toLowerCase().includes(campaignSearch.toLowerCase())
          )
          .map((campaign, index) => (
            <CampaignCard
              key={campaign._id}
              campaign={campaign}
              isSelected={campaignId === campaign._id}
              handleCampaignChange={handleCampaignChange}
              handleCampaignDelete={handleCampaignDelete}
              handleCampaignEdit={handleCampaignEdit}
              index={index}
            />
          ))}
      </div>

      <AudienceTable
        audiences={audiences}
        audienceSearch={audienceSearch}
        setAudienceSearch={setAudienceSearch}
        sendingAudienceId={sendingAudienceId}
        sendMessage={sendMessage}
        messageStats={messageStats}
      />
    </div>
  );
};

export default CampaignsList;
