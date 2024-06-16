import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import EditCampaignModal from "../components/EditCampaignModal";

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

  useEffect(() => {
    fetchCampaigns();
    fetchAudiences();
  }, []);

  useEffect(() => {
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

    fetchMessageStats();
  }, [audiences]);

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

  const renderMessageStats = (stats) => {
    if (!stats) return "NA";

    const { sentCount, totalCount } = stats;
    const successRate = (sentCount / totalCount) * 100;
    const failureRate = 100 - successRate;

    return (
      <div>
        <div>Sent: {sentCount}</div>
        <div>Failed: {totalCount - sentCount}</div>
        <div>
          Success Rate: {successRate.toFixed(2)}%
          <div className="progress-bar">
            <div
              className="progress"
              style={{ width: `${successRate}%`, backgroundColor: "green" }}
            ></div>
            <div
              className="progress"
              style={{ width: `${failureRate}%`, backgroundColor: "red" }}
            ></div>
          </div>
        </div>
      </div>
    );
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
  return (
    <div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaigns
          .filter((campaign) =>
            campaign.name.toLowerCase().includes(campaignSearch.toLowerCase())
          )
          .map((campaign, index) => (
            <div
              key={campaign._id}
              className={`border transition-all border-gray rounded-lg p-4 cursor-pointer ${
                campaignId === campaign._id ? "bg-pale-white text-black" : ""
              }`}
              onClick={() =>
                handleCampaignChange(campaign._id, campaign.message)
              }
            >
              <h2 className="text-lg font-bold mb-2 flex items-center">
                {campaign.name}
                {index === 0 && (
                  <span className="ml-2 bg-warn text-black px-2 py-1 rounded-full text-xs">
                    Latest
                  </span>
                )}
              </h2>
              <p className="text-sm">{campaign.message}</p>

              <div className="flex justify-center items-center gap-4 mt-4">
                <button
                  className="bg-dark  hover:scale-110 transition-all duration-300 text-pale-white  px-2 rounded-md w-1/2"
                  onClick={() => handleCampaignDelete(campaign._id)}
                >
                  Delete
                </button>
                <button
                  className="bg-dark hover:scale-110 transition-all duration-300 text-white  px-2 rounded-md w-1/2"
                  onClick={() => handleCampaignEdit(campaign._id)}
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
      </div>

      <div className="mb-4 mt-4">
        <input
          type="text"
          placeholder="Search Audiences"
          value={audienceSearch}
          onChange={(e) => setAudienceSearch(e.target.value)}
          className="border border-gray rounded-md p-2 mb-2"
        />
      </div>

      <div className="block w-full overflow-x-auto">
        <table className="items-center bg-transparent w-full border-collapse mt-2">
          <thead className="">
            <tr>
              <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                Name
              </th>
              <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                Audience Size
              </th>
              <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                Status
              </th>
              <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                Send Message
              </th>
              <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                Message Stats
              </th>
            </tr>
          </thead>
          <tbody>
            {audiences
              .filter((audience) =>
                audience.name
                  .toLowerCase()
                  .includes(audienceSearch.toLowerCase())
              )
              .map((audience) => (
                <tr
                  className="transition-all duration-300 hover:font-bold hover:bg-pale-white "
                  key={audience._id}
                >
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                    {audience.name}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                    {audience.customerIds.length}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                    {audience.status}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                    <button
                      disabled={
                        audience.status === "DONE" ||
                        sendingAudienceId === audience._id
                      }
                      className={`bg-dark hover:scale-110 transition-all duration-300 text-pale-white py-2 px-6 rounded-full ${
                        audience.status === "DONE" ||
                        sendingAudienceId === audience._id
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={() =>
                        sendMessage(audience._id, audience.customerIds)
                      }
                    >
                      {sendingAudienceId === audience._id
                        ? "Sending..."
                        : "Send"}
                    </button>
                  </td>

                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                    {renderMessageStats(messageStats[audience._id])}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <EditCampaignModal
        campaign={selectedCampaign}
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onUpdate={fetchCampaigns}
      />
    </div>
  );
};

export default CampaignsList;
